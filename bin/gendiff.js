#!/usr/bin/env node

import {program} from 'commander';
import genDiff from '../src/compareJson.js'

program.version("1.0.0")
.arguments("<filePath1> <filePath2>")
.usage("[options] <filepath1> <filepath2>")
.option('-f, --format <type>', 'output format')
.description("Compares two configuration files and shows a difference.")
.action(function (filePathOne, filePathTwo) {
  console.log(genDiff(filePathOne, filePathTwo));
})
.parse(process.argv);

