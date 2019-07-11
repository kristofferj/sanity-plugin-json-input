# sanity-plugin-json-input

Edit objects with JSON in [Sanity](https://sanity.io/).


## Installation

```
sanity install json-input
```

## Usage

Use it in your schema types:

```js
// [...]
{
  fields: [
    // [...]
    {
      name: 'myObject',
      title: 'Object with custom fields',
      type: 'json'
    }
  ]
}
```

Note that the above only works if you import and use the `all:part:@sanity/base/schema-type` part in your schema.

## License

MIT-licensed. See LICENSE.
