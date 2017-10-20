# mdi-es6

> [material-design-icons](https://github.com/google/material-design-icons) as an es6 module with named exports for each icon as a string of svg markup.

`mdi-es6` is also compatible with CommonJS, but bear in mind, CommonJS lacks tree shaking.

```js
import { cake, addAPhoto, usb, usb_18, usb_24, usb_48 } from 'mdi-es6'
// const { cake, addAPhoto, usb, usb_18, usb_24, usb_48 } = require('mdi-es6')

const range = document.createRange()
const cakeSvgNode = range.createContextualFragment(cake)
document.body.appendChild(cakeSvgNode)
```

Icon names are camelCased and each size is appended to the name, separated by an underscore. `${camelCasedName}_${size}`

The default size, `24`, is also exported without the size in the name for convenience. SVG is vector and therefore infinitely scalable, so the default size should be suitable for most cases. You can scale the SVG up in size by adjusting (or removing) the height and width attributes on the SVG element.

View and search through the icons [here](https://material.io/icons/).
