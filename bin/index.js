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
  .option('-type, --type <type>', 'sdfsdfsd')
  .action((filePath, options) => {
    validateInput(filePath, options)
  })

program.parse()
