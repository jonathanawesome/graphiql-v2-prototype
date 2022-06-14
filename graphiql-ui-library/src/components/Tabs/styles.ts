import { styled } from '../../theme';

import * as TabsPrimitive from '@radix-ui/react-tabs';

export const TabsRoot = styled(TabsPrimitive.Root, {
  height: '100%',
});

export const TabsList = styled(TabsPrimitive.List, {
  display: 'flex',
  gap: 8,
});

export const TabsTrigger = styled(TabsPrimitive.Trigger, {
  cursor: 'pointer',
  fontSize: '$body',
  lineHeight: '$body',
  fontWeight: '$medium',
  padding: '10px',
  color: '$scale700',

  '&:hover': { color: '$scale800' },
  '&[data-state="active"]': {
    fontWeight: '$semiBold',
    color: '$scale800',
  },

  span: {
    padding: '2px 4px',
    marginLeft: '4px',
    borderRadius: '2px',
    fontSize: '$mini',
    backgroundColor: '$scale300',
    color: '$scale700',
  },
});

export const TabsContent = styled(TabsPrimitive.Content, {
  padding: '0 16px 16px 16px',
  height: '100%',
});
