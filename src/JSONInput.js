import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import {get} from 'lodash'
import {PatchEvent, set, setIfMissing} from 'part:@sanity/form-builder/patch-event'
import styles from './JSONInput.css'
import FormField from 'part:@sanity/components/formfields/default'

/* eslint-disable import/no-unassigned-import */
// NOTE: MAKE SURE THESE ALIGN WITH SUPPORTED_LANGUAGES
import 'brace/mode/json'

import 'brace/theme/github'
import 'brace/theme/monokai'
import 'brace/theme/terminal'
import 'brace/theme/tomorrow'
/* eslint-enable import/no-unassigned-import */

const DEFAULT_THEME = 'tomorrow'
const SUPPORTED_THEMES = ['github', 'monokai', 'terminal', 'tomorrow']

export default class JSONInput extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    value: PropTypes.object,
    markers: PropTypes.array,
    type: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired
        })
      )
    }).isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange() {}
  }

  state = {
    value: undefined,
    validJsonMarker: undefined
  }

  focus() {
    this.editor.focus()
  }

  handleCodeChange = json => {
    const {type, onChange} = this.props
    this.setState({
      value: json || '{ }'
    })

    let parsedJSON

    try {
      parsedJSON = JSON.parse(json)
      this.setState({validJsonMarker: undefined})
    } catch (e) {
      parsedJSON = undefined
      this.setState({
        validJsonMarker: {
          level: 'error',
          type: 'validation',
          item: {
            message: 'Must be valid JSON',
            name: 'ValidationError'
          }
        }
      })
    }

    if (typeof parsedJSON === 'object') {
      onChange(PatchEvent.from([setIfMissing({_type: type.name}), set(parsedJSON)]))
    }
  }

  handleEditorLoad = editor => {
    this.editor = editor
    this.editor.focus()
  }

  getTheme() {
    const preferredTheme = get(this.props.type, 'options.theme')
    return preferredTheme && SUPPORTED_THEMES.find(theme => theme === preferredTheme)
      ? preferredTheme
      : DEFAULT_THEME
  }

  renderEditor = () => {
    const {value} = this.props
    return (
      <AceEditor
        className={styles.aceEditor}
        mode="json"
        theme={this.getTheme()}
        width="100%"
        onChange={this.handleCodeChange}
        name={`${this._inputId}__aceEditor`}
        value={this.state.value || JSON.stringify(value, null, '\t') || '{\n\n}'}
        onLoad={this.handleEditorLoad}
        tabSize={2}
        setOptions={{
          useSoftTabs: true,
          navigateWithinSoftTabs: true
        }}
        editorProps={{$blockScrolling: true}}
      />
    )
  }

  render() {
    const {type, level, markers} = this.props
    const {validJsonMarker} = this.state
    return (
      <FormField
        label={type.title}
        description={type.description}
        level={level}
        markers={[...markers, validJsonMarker].filter(Boolean)}
      >
        {this.renderEditor()}
      </FormField>
    )
  }
}
