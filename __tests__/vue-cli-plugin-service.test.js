'use strict';

const vueCliPlugin = require('..')

test('vue-cli-plugin-vueconf-2019-example:service', () => {
  const mockPlugin = {
    use: jest.fn(),
    tap: jest.fn()
  }
  const mockConfig = {
    plugin: jest.fn().mockReturnValue(mockPlugin),
    output: { get: jest.fn() }
  }
  const mockApi = {
    chainWebpack: jest.fn().mockImplementation(cb => cb(mockConfig))
  }

  vueCliPlugin(mockApi)

  expect(mockApi.chainWebpack.mock.calls.length).toBe(2)
  expect(mockConfig.plugin.mock.calls.length).toBe(2)
  expect(mockConfig.plugin.mock.calls[0][0]).toBe('manifest')
  expect(mockConfig.plugin.mock.calls[1][0]).toBe('define')
  expect(mockPlugin.use.mock.calls.length).toBe(1)
  expect(mockPlugin.tap.mock.calls.length).toBe(1)
})
