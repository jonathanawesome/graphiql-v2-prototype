import { styled } from '@graphiql-v2-prototype/graphiql-ui-library';

export const PlayButtonStyled = styled('button', {
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  margin: 0,
  padding: 0,
  width: 'min-content',
  display: 'flex',

  '&:hover': {
    opacity: 0.9,
  },

  '& svg': {
    height: 40,
    width: 40,
  },
});
