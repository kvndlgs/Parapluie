
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = ['hsla(0, 15%, 1%, 1)','hsla(0, 15%, 6%, 1)','hsla(0, 15%, 12%, 1)','hsla(0, 15%, 17%, 1)','hsla(0, 15%, 23%, 1)','hsla(0, 15%, 28%, 1)','hsla(0, 15%, 34%, 1)','hsla(0, 15%, 39%, 1)','hsla(0, 15%, 45%, 1)','hsla(0, 15%, 50%, 1)','hsla(0, 15%, 93%, 1)','hsla(0, 15%, 99%, 1)']
const lightPalette = ['hsla(300, 15%, 99%, 1)','hsla(300, 15%, 94%, 1)','hsla(300, 15%, 88%, 1)','hsla(300, 15%, 83%, 1)','hsla(300, 15%, 77%, 1)','hsla(300, 15%, 72%, 1)','hsla(300, 15%, 66%, 1)','hsla(300, 15%, 61%, 1)','hsla(300, 15%, 55%, 1)','hsla(300, 15%, 50%, 1)','hsla(300, 15%, 15%, 1)','hsla(300, 15%, 1%, 1)']

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsl(252, 98%, 7%)','hsl(252, 98%, 17%)','hsla(252, 98%, 36%, 1)','hsla(252, 98%, 48%, 1)','hsla(252, 98%, 58%, 1)','hsla(252, 98%, 64%, 1)','hsla(250, 50%, 77%, 1)','hsla(250, 50%, 81%, 1)','hsla(252, 98%, 85%, 1)','hsla(252, 98%, 92%, 1)','hsla(252, 98%, 95%, 1)','hsla(252, 98%, 95%, 1)'],
      light: ['hsl(252, 98%, 7%)','hsl(252, 98%, 17%)','hsla(252, 98%, 36%, 1)','hsla(252, 98%, 48%, 1)','hsla(252, 98%, 58%, 1)','hsla(252, 98%, 64%, 1)','hsla(250, 50%, 77%, 1)','hsla(250, 50%, 81%, 1)','hsla(252, 98%, 85%, 1)','hsla(252, 98%, 92%, 1)','hsla(252, 98%, 95%, 1)','hsla(252, 98%, 95%, 1)'],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)


// Design System Colors - Parapluie
export const colors = {
  primary: {
    50: 'hsl(252, 98%, 95%)',
    100: 'hsl(252, 98%, 88%)',
    200: 'hsl(252, 98%, 78%)',
    300: 'hsl(252, 98%, 68%)',
    400: 'hsl(252, 98%, 58%)',
    500: 'hsl(252, 98%, 48%)',
    600: 'hsl(252, 98%, 48%)',
    700: 'hsl(252, 98%, 38%)',
    800: 'hsl(252, 98%, 28%)',
    900: 'hsl(252, 98%, 16%)',
    950: 'hsl(252, 98%, 6%)',
  },


base: {
  50: 'hsl(300, 15%, 96%)',
  100: 'hsl(300, 15%, 88%)',
  200: 'hsl(300,15%, 76%)',
  300: 'hsl(300, 15%, 66%)',
  400: 'hsl(300,15%, 56%)',
  500: 'hsl(300,15%,44%)',
  600: 'hsl(300, 15%, 34%)',
  700: 'hsl(300, 15%, 26%)',
  800: 'hsl(300, 15%, 16%)',
  900: 'hsl(300, 15%, 6%)',
},

accent: {
      50: 'hsl(202, 95%, 96%)',
      100: 'hsl(202, 95%, 89%)',
      200: 'hsl(202, 95%, 78%)',
      300: 'hsl(202, 95%, 68%)',
      400: 'hsl(202, 95%, 60%)',
      500: 'hsl(202, 95%, 54%)',
      600: 'hsl(202, 95%, 43%)',
      700: 'hsl(202, 95%, 38%)',
      800: 'hsl(202, 95%, 20%)',
      900: 'hsl(202, 95%, 14%)',
      950: 'hsl(202, 95%, 7%)'
},

danger: {
  50:   'hsl(340, 72%, 97%)',
  100:  'hsl(340, 72%, 87%)',
  200:  'hsl(340, 72%, 77%)',
  300:  'hsl(340, 72%, 67%)',
  400:  'hsl(340, 72%, 57%)',
  500:  'hsl(340, 72%, 47%)',
  600:  'hsl(340, 72%, 37%)',
  700:  'hsl(340, 72%, 27%)',
  800:  'hsl(340, 72%, 22%)',
  900:  'hsl(340, 72%, 11%)',
  950:  'hsl(340, 72%, 7%)',
},

warning: {

  50:   'hsl(36, 97%, 97%)',
  100:  'hsl(36, 97%, 91%)',
  200:  'hsl(36, 97%, 86%)',
  300:  'hsl(36, 97%, 77%)',
  400:  'hsl(36, 97%, 66%)',
  500:  'hsl(36, 97%, 58%)',
  600:  'hsl(36, 97%, 49%)',
  700:  'hsl(36, 97%, 38%)',
  800:  'hsl(36, 97%, 29%)',
  900:  'hsl(36, 97%, 21%)',
  950:  'hsl(36, 97%, 6%)',
},

success: {
  50:  'hsl(145, 87%, 97%)',
  100: 'hsl(145, 87%, 92%)',
  200: 'hsl(145, 87%, 88%)',
  300: 'hsl(145, 87%, 77%)',
  400: 'hsl(145, 87%, 67%)',
  500: 'hsl(145, 87%, 53%)',
  600: 'hsl(145, 87%, 44%)',
  700: 'hsl(145, 87%, 37%)',
  800: 'hsl(145, 87%, 28%)',
  900: 'hsl(145, 87%, 22%)',
  950: 'hsl(145, 87%, 7%)',
},
  background: 'hsl(300, 15%, 97%)',
}
