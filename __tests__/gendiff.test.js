import genDiff from "../src/compare.js";
import { test, expect } from '@jest/globals';

test('gendiff', () => {
  const resultJSON = genDiff('__fixtures__/filePathOne.json', '__fixtures__/filePathTwo.json');

  const expected = `{
    - follow: false
    host: test.test
    - proxy: 123.234.53.22
    - timeout: 50
    + timeout: 20
    + verbose: true
}`

  const resultYAML = genDiff('__fixtures__/yamlOne.yaml', '__fixtures__/yamlTwo.yaml');
  const resultUndefinedFormat = genDiff('__fixtures__/txtFile.txt', '__fixtures__/txtFileTwo.txt');
  const resultNonExistent = genDiff('__fixtures__/yOne.ya', '__fixtures__/yamlTwo.yaml');

  const expectedUndefined = 'is not supported yet';
  const expectedNonExistent = 'No such file or directory';

  expect(resultJSON).toMatch(expected);
  expect(resultYAML).toMatch(expected);
  expect(resultNonExistent).toMatch(expectedNonExistent)
  expect(resultUndefinedFormat).toContain(expectedUndefined);

});