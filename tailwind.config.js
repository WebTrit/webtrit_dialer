const enabled = process.env.NODE_ENV === 'production'

module.exports = {
  purge: {
    enabled,
    content: [
      './public/**/*.html',
      './src/**/*.vue',
    ],
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        blue: '#1976D2',
        'light-blue': '#f4f9fc',
        'light-grey': '#78909C',
        grey: '#eceff1',
        green: '#43A047',
      },
    },
  },
  variants: {},
  plugins: [],
}
