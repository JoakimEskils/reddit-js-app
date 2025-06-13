import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    reddit: {
      orange: '#FF4500',
      blue: '#0079D3',
      dark: '#1A1A1B',
      light: '#FFFFFF',
      gray: '#DAE0E6',
      text: '#1A1A1B',
      textSecondary: '#7C7C7C'
    }
  },
  styles: {
    global: {
      body: {
        bg: 'reddit.light',
        color: 'reddit.text'
      }
    }
  }
})

export default theme 