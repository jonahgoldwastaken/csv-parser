import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { compose } from 'ramda'
import newline from 'newline'
const args = require('parse-cmd-args')()

const saveParsedCSVToFile = (data: any) => {
  const buf = Buffer.from(JSON.stringify(data))
  writeFileSync(
    resolve(process.cwd(), `${args.input.split('.')[0]}-parsed.json`),
    buf
  )
}

const parseWithSubObjects = (rows: string[], columns: string[]) =>
  rows.reduce((prev, curr, i) => {
    if (i === 0) return prev
    const newArr = [...prev]

    newArr.push(
      curr.split(';').reduce((prev, curr, j) => {
        const newObj = { ...prev }
        const currFixedValForNumber = curr.replace(',', '.')
        const splitColumn = columns[j].split('_')

        if (splitColumn.length > 1) {
          newObj[splitColumn[0]] = newObj[splitColumn[0]]
            ? {
                ...newObj[splitColumn[0]],
                [splitColumn[1]]: currFixedValForNumber,
              }
            : { [splitColumn[1]]: currFixedValForNumber }
        } else {
          newObj[columns[j]] = currFixedValForNumber
        }

        return newObj
      }, {} as any)
    )

    return newArr
  }, [] as any[])

const parseRegularly = (rows: string[], columns: string[]) =>
  rows.reduce((prev, currRow, i) => {
    if (i === 0) return prev
    const newArr = [...prev]

    newArr.push(
      currRow.split(';').reduce((prev, currColumn, i) => {
        const newObj = { ...prev }
        const currFixedValForNumber = currColumn.replace(',', '.')

        newObj[columns[i]] = currFixedValForNumber

        return newObj
      }, {} as any)
    )

    return newArr
  }, [] as any[])

const csvParser = () => {
  const buf = readFileSync(resolve(process.cwd(), `${args.input}`))
  const file = buf.toString('utf-8')
  const parsedLines = newline.set(file, 'LF')
  const rows = parsedLines.split('\n')
  const columns = rows[0].split(';')

  if (args.flags['--sub-objects'])
    compose(saveParsedCSVToFile, parseWithSubObjects)(rows, columns)
  else compose(saveParsedCSVToFile, parseRegularly)(rows, columns)
}

export default csvParser
