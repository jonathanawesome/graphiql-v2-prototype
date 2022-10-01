import { styled, theme } from '@graphiql-prototype/ui-library';
import * as Collapsible from '@radix-ui/react-collapsible';

export const StyledArguments = styled(Collapsible.Root, {
  position: 'relative',
  marginBottom: 8,

  variants: {
    isOpen: {
      true: {
        marginBottom: theme.space[4],
      },
      false: {},
    },
  },
});

export const StyledArgumentsTrigger = styled(Collapsible.Trigger, {
  height: theme.space[5],
  paddingLeft: theme.space[1],
  paddingRight: theme.space[1],
  width: `100%`,
  display: 'flex',
  alignItems: 'center',
  gap: 12,

  span: {
    fontSize: 10,
    textTransform: `uppercase`,
    letterSpacing: 0.5,
    color: theme.colors.text2,
  },

  svg: {
    height: 7,
    width: 7,
  },

  variants: {
    isOpen: {
      true: {
        svg: {
          transform: 'rotate(90deg)',
          fill: theme.colors.pink_default,
        },
      },
      false: {
        svg: {
          fill: theme.colors.text4,
        },
        '&:hover, &:focus': {
          svg: {
            fill: theme.colors.text3,
          },
        },
      },
    },
  },
});

export const StyledArgumentsList = styled('ul', {
  all: 'unset',
  margin: 0,
  overflow: `hidden`,
  display: 'flex',
  flexDirection: 'column',
  position: `relative`,

  variants: {
    isOpen: {
      true: {
        // borderTop: `1px solid ${theme.colors.surface3}`,
      },
      false: {},
    },
  },
});

export const StyledArgumentsContent = styled(Collapsible.Content, {
  paddingLeft: theme.space[4],
  position: `relative`,
  // backgroundColor: theme.colors.pink_lightest,
  // borderRadius: 2,

  // backgroundColor: theme.colors.pink_lightest,
  // borderRadius: 2,
  // borderLeft: `1px solid ${theme.colors.pink_default}`,
  hairlineL: theme.colors.pink_default,
  marginLeft: 7,
  // padding: 12,
  marginTop: 12,

  // '&::after': {
  //   content: '',
  //   position: `absolute`,
  //   top: 0,
  //   left: 7,
  //   height: `100%`,
  //   width: 1,
  //   backgroundColor: theme.colors.pink_default,
  // },

  variants: {
    isOpen: {
      true: {
        // borderTop: `1px solid ${theme.colors.surface3}`,
      },
      false: {},
    },
  },
});
