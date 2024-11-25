import { Poppins } from 'next/font/google'
import { Open_Sans } from 'next/font/google'

// Non variable fonts.
// you have to specify array of weight

const poppins = Poppins({
  weight: ['400', '900'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--poppins-font',
})

// For variable fonts.
// you have to specify weight= "variable" value only.

const open_sans = Open_Sans({
  weight: 'variable',
  style: ['italic', 'normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--open-sans-font',
})

export { poppins, open_sans }
