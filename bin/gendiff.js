#!/usr/bin/env node

import fs from 'fs';
import {program} from 'commander';
import path from "path";
import _ from 'lodash';

program.version("1.0.0")
.arguments("<filePath1> <filePath2>")
.usage("[options] <filepath1> <filepath2>")
.option('-f, --format <type>', 'output format')
.description("Compares two configuration files and shows a difference.");

program.action((filePathOne, filePathTwo) => {
  console.log(`{\n    ${genDiff(filePathOne, filePathTwo)}\n}`);
});


function genDiff(fileOne, fileTwo) {
  const rawJsonOne = fs.readFileSync(path.resolve(fileOne)).toLocaleString();
  const parsedJsonOne = JSON.parse(rawJsonOne);

  const rawJsonTwo = fs.readFileSync(path.resolve(fileTwo)).toLocaleString();
  const parsedJsonTwo = JSON.parse(rawJsonTwo);

  const object = compareAndSortJSON(parsedJsonOne, parsedJsonTwo);

  const result = iterSortedObject(object, parsedJsonOne, parsedJsonTwo);

  return result.join('\n    ');
}
const compareAndSortJSON = (obj1, obj2) => {
  const keys = {};

  Object.keys(obj1).forEach((key) => {
    if (Object.hasOwn(obj2, key)) {
      if (obj2[key] === obj1[key]) {
        keys['element ' + key] = {name: key, status: 'empty'};
      } else {
        keys['element ' + key] = {name: key, status: 'both'};
      }
    } else {
      keys['element ' + key] = {name: key, status: 'minus'};
    }
  });

  Object.keys(obj2).forEach((key) => {
    if (!Object.hasOwn(obj1, key)) {
      keys['element ' + key] = {name: key, status: 'plus'};
    }
  });

  return _.orderBy(keys, ['name'], ['asc']);
};

function iterSortedObject(object, inputOne, inputTwo) {
  const passedObject = [];

  for (const [key, value] of Object.entries(object)) {
    if (value.status === 'minus') {
      passedObject.push(`- ${value.name}: ${inputOne[value.name]}`);
    }

    if (value.status === 'plus') {
      passedObject.push(`+ ${value.name}: ${inputTwo[value.name]}`);
    }

    if (value.status === 'empty') {
      passedObject.push(`${value.name}: ${inputOne[value.name]}`);
    }

    if (value.status === 'both') {
      passedObject.push(`- ${value.name}: ${inputOne[value.name]}`);
      passedObject.push(`+ ${value.name}: ${inputTwo[value.name]}`);
    }
  }

  return passedObject;
}

program.parse(process.argv);