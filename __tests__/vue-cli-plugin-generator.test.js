'use strict';

const vueCliPluginGenerator = require('../generator')

test('vue-cli-plugin-vueconf-2019-example:generator', () => {
  const mockApi = {
    extendPackage: jest.fn(),
    render: jest.fn(),
    onCreateComplete: jest.fn(),
  }

  vueCliPluginGenerator(mockApi, {}, { router: true })

  expect(mockApi.extendPackage.mock.calls.length).toBe(1)
  expect(mockApi.render.mock.calls.length).toBe(1)
  expect(mockApi.onCreateComplete.mock.calls.length).toBe(2)
})
