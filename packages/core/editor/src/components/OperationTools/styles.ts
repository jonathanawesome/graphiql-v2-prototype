import { styled, theme } from '@graphiql-prototype/ui-library';

export const StyledVariablesWrap = styled('div', {
  padding: theme.space[4],
  // maxHeight: 300,
  // minHeight: 120,
  // overflowY: `auto`,
  // height: '100%',
  width: '100%',
});

export const StyledPerTabHeaders = styled('div', {
  display: `flex`,
  flexDirection: `column`,
  gap: theme.space[6],
  paddingTop: theme.space[6],
  paddingRight: theme.space[4],
  paddingBottom: theme.space[6],
  paddingLeft: theme.space[4],
});
