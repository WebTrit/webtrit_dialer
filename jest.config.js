module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,ts,vue}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'ts',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/tests/unit/__mocks__/fileMock.js',
  },
}
