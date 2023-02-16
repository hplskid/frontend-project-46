import fs from "fs";
import path from "path";
import _ from "lodash";
import parse from './parsers.js'

export default function genDiff(fileOne, fileTwo) {
  try {
    const rawOne = fs.readFileSync(path.resolve(fileOne), 'utf-8');
    const rawTwo = fs.readFileSync(path.resolve(fileTwo), 'utf-8');

    const parsedFileOne = parse(rawOne, path.extname(fileOne).slice(1));
    const parsedFileTwo = parse(rawTwo, path.extname(fileTwo).slice(1));

    if (parsedFileOne === undefined || parsedFileTwo === undefined) {
      return `File ext ${path.extname(fileOne).slice(1)} is not supported yet`
    }

    const object = compareAndSortObject(parsedFileOne, parsedFileTwo);
    const result = iterSortedObject(object, parsedFileOne, parsedFileTwo);

    return `{\n    ${result.join('\n    ')}\n}`
  } catch (exception) {
    return 'No such file or directory';
  }
}

function iterSortedObject(object, inputOne, inputTwo) {
  const passedObject = [];

  for (const value of Object.values(object)) {
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

function compareAndSortObject(obj1, obj2) {
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