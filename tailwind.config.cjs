import colors from 'tailwindcss/colors.js'
import defaultTheme from 'tailwindcss/defaultTheme.js'
import formsPlugin from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        error: colors.red['500']
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif', ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: [formsPlugin, aspectRatio, typography]
}
