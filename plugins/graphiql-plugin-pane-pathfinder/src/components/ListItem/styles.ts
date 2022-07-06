import { styled } from '@graphiql-v2-prototype/graphiql-ui-library';
import * as Collapsible from '@radix-ui/react-collapsible';

export const ListItemStyled = styled('li', {
  all: 'unset',
});

export const Layout = styled('div', {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr',
  alignItems: 'start',
  gap: 12,

  variants: {
    hasToggler: {
      true: {
        gridTemplateColumns: '15px 1fr',
        gap: 6,
      },
    },
    isCollapsible: {
      true: {
        gridTemplateColumns: '15px 1fr',
        gap: 6,
      },
    },
  },

  compoundVariants: [
    {
      hasToggler: true,
      isCollapsible: true,
      css: {
        gridTemplateColumns: '15px 15px 1fr',
        gap: 6,
      },
    },
  ],
});

export const CollapsibleRoot = styled(Collapsible.Root, {
  position: 'relative',
});

export const CollapsibleTrigger = styled(Collapsible.Trigger, {
  height: 15,
  width: 15,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    height: 7,
    width: 7,
  },

  variants: {
    isExpanded: {
      true: {
        svg: {
          transform: 'rotate(90deg)',
          fill: '$secondary060',
        },
      },
      false: {
        svg: {
          fill: '$gray040',
        },
      },
    },
  },
});

export const CollapsibleContent = styled(Collapsible.Content, {
  marginTop: 16,
});

export const Arguments = styled('ul', {
  paddingLeft: 14,
  marginLeft: 7,
  marginBottom: 8,
});

export const ChildFields = styled('ul', {
  paddingLeft: 12,
  marginLeft: 7,
  variants: {
    variant: {
      FIELD: {
        marginLeft: 27,
        borderLeft: '1px solid $gray015',
      },
      INLINE_FRAGMENT: {
        paddingLeft: 0,
        marginLeft: 0,
      },
      ARGUMENT: {
        borderLeft: '1px solid $primary100',
      },
      INPUT_OBJECT: {},
      ROOT: {
        borderLeft: '1px solid $gray015',
      },
      WHOOPS: {},
    },
  },
});
