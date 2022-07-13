const path = require("path")

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        "^@/(.+)": "<rootDir>/src/$1",
        "^@(Components|/component_ocean)/(.+)": "<rootDir>/src/components_ocean/$2"
      }
    }
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Components': path.resolve(__dirname, './src/components_ocean'),
      '@/component_ocean': path.resolve(__dirname, './src/components_ocean'),
    },
  },
};