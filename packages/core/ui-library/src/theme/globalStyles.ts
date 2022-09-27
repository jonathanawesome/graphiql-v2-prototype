import { globalCss } from '@stitches/react';
import { theme } from './stitches.config';

export const globalStyles = globalCss({
  // begin mini reset
  '*, *:before, *:after': {
    boxSizing: 'border-box',
  },
  'html, body, #root, #ladle-root': {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  // end mini reset
  // begin global css
  button: {
    all: 'unset',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  'a, button': {
    '&:focus': {
      outline: '1px dotted $gray100',
      outlineOffset: -1,
    },
  },
  // end global css
  // begin set fonts
  html: {
    fontFamily: '$stack',
    fontSmooth: 'always',
    textRendering: 'optimizeLegibility',
  },
  // end set fonts

  '*': {
    // FF
    scrollbarWidth: `thin`,
    scrollbarColor: `${theme.colors.surface3} transparent`,

    // Chrome, Edge, and Safari
    '&::-webkit-scrollbar': {
      width: 12,
    },
    '&::-webkit-scrollbar-track': {
      background: `transparent`,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.surface3,
      borderRadius: 20,
      border: `3px solid ${theme.colors.surface1}`,

      '&:hover': {
        backgroundColor: theme.colors.text4,
      },
    },
  },
});
