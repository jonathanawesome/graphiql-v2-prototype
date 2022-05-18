import { styled } from '@stitches/react';

//TODO: this is mostly placeholder styling...just getting something on the screen
export const NavigationStyled = styled('div', {
  height: '100%',
  width: 60,
  minWidth: 60,
  padding: `24px 19px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: 'solid 1px $scale400',
});

export const Links = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

export const Controls = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});
