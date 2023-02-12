import fs from "fs";
import path from "path";
import _ from "lodash";

export default function genDiff(fileOne, fileTwo) {
  const rawJsonOne = fs.readFileSync(path.resolve(fileOne)).toLocaleString();
  const parsedJsonOne = JSON.parse(rawJsonOne);

  const rawJsonTwo = fs.readFileSync(path.resolve(fileTwo)).toLocaleString();
  const parsedJsonTwo = JSON.parse(rawJsonTwo);

  const object = compareAndSortJSON(parsedJsonOne, parsedJsonTwo);

  const result = iterSortedObject(object, parsedJsonOne, parsedJsonTwo);

  return `{\n    ${result.join('\n    ')}\n}`
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

function compareAndSortJSON(obj1, obj2) {
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