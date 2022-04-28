const path = require("path")

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        "^@/(.+)": "<rootDir>/src/$1",
        "^@Components/(.+)": "<rootDir>/src/components_ocean/$1"
      }
    }
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Components': path.resolve(__dirname, './src/components_ocean'),
    },
  },
};