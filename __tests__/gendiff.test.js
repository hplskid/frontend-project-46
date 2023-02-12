import genDiff from "../src/compareJson.js";
import { test, expect } from '@jest/globals';

test('gendiff', () => {
  const result = genDiff('__fixtures__/filePathOne.json', '__fixtures__/filePathTwo.json');
  const expected = `{
    - follow: false
    host: test.test
    - proxy: 123.234.53.22
    - timeout: 50
    + timeout: 20
    + verbose: true
}`

  expect(result).toMatch(expected);
});