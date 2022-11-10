module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/docs/**',
    '!**/coverage/**',
    '!**/*.config.{js, ts}',
    '!**/.*',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
}
