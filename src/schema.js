/* eslint-disable max-len */
import React, {PureComponent} from 'react'
import JsonLogo from './jsonLogo'

// eslint-disable-next-line react/no-multi-comp
class Input extends PureComponent {
  constructor(props) {
    super(props)
    this.JSONInput = require('./JSONInput').default
    this.JSONInputRef = React.createRef()
  }

  focus() {
    if (this.JSONInput && this.JSONInput.current) {
      this.JSONInput.current.focus()
    }
  }

  render() {
    const {JSONInput} = this
    return <JSONInput ref={this.JSONInputRef} {...this.props} />
  }
}

// eslint-disable-next-line react/no-multi-comp
const Preview = props => {
  const PreviewJSON = require('./PreviewJSON').default
  return <PreviewJSON {...props} />
}

export default {
  name: 'json',
  type: 'object',
  title: 'JSON',
  inputComponent: Input,
  // icon: <JsonLogo />,
  fields: [
    {
      name: 'unusedField',
      type: 'string'
    }
  ],
  // validation: Rule => Rule.custom(obj => console.log(obj) JSON.parse(obj) || 'Not valid JSON'),
  // validation: Rule => Rule.custom(obj => console.log('test', obj)),
  preview: {
    select: {
      filename: 'filename'
    },
    prepare: value => {
      return {
        title: 'JSON Object',
        media: <JsonLogo />,
        extendedPreview: <Preview value={value} />
      }
    }
  }
}
