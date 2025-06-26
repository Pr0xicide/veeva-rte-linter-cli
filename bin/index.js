#!/usr/bin/env node
'use strict'

const { Command } = require('commander')
const { validateInput } = require('../src/lint')

const program = new Command()

program
  .name('veeva-rte-linter-cli')
  .description(
    'a rep-triggered email (RTE) HTML linter to report and identify issues when developing RTE files.'
  )
  .version('0.3.0')
  .argument('<file-path>', 'directory leading to the HTML file to lint.')
  .argument(
    '<file-type>',
    'approved email file type, expecting "et", "ef", "tf"'
  )
  .action((filePath, fileType) => {
    validateInput(filePath, fileType)
  })

program.parse(process.argv)
