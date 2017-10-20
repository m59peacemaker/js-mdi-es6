#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const glob = require('globby')
const Case = require('case')
const sortBy = require('sort-array-by')
const iconPath = require('material-design-icons').STATIC_PATH

const flipFirstWords = string => {
  const words = string.split('_')
  const second = words[1]
  words[1] = words[0]
  words[0] = second
  return words.join('_')
}
const makeExportNameFromFileName = string => {
  // ic_3d_rotation_24_px => 3d_rotation_24
  string = string.slice(3, -2)

  // 3d_rotation_24 = rotation_3d_24
  string = isNaN(string.slice(0, 1)) ? string : flipFirstWords(string)

  const parts = string.split('_')
  const size = parts.pop()
  // rotation_3d_24 => rotation3d_24
  return `${Case.camel(parts.join('_'))}_${size}`
}

const generate = async () => {
  // ditch this duplicate icon --> https://github.com/google/material-design-icons/issues/415
  const svgPaths = await glob([ `${iconPath}/*/svg/production/*.svg`, `!${iconPath}/notification/**/*rv_hookup*` ])
  const svgs = (await Promise.all(svgPaths
    .map(async filePath => {
      const fileName = path.basename(filePath, path.extname(filePath))
      const name = makeExportNameFromFileName(fileName)
      const html = (await fs.readFile(filePath)).toString()

      return { name, html }
    })
  ))
  const sortedSvgs = sortBy(v => v.name, svgs)

  const svgExports = sortedSvgs
    .reduce((code, svg) => `${code}export const ${svg.name} = '${svg.html}'\n`, '')

  const exportNames = sortedSvgs.map(svg => svg.name)
  const exportAliases = exportNames
    .filter(name => /_(\d+x)?24$/.test(name))
    .reduce((aliases, name) => {
      aliases[name.split('_')[0]] = name
      return aliases
    }, {})

  const defaultSvgExports = Object.keys(exportAliases)
    .reduce((code, alias) => `${code}\n  ${exportAliases[alias]} as ${alias},`, 'export {')
    .slice(0, -1)
    + '\n}'

  process.stdout.write(svgExports + defaultSvgExports)
}

generate()
