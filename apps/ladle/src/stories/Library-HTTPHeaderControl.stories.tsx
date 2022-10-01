// ladle helper components
import { FlexCol } from '../components/FlexCol';
import { FlexRow } from '../components/FlexRow';

import { HTTPHeaderControl } from '@graphiql-prototype/ui-library';

//hooks
import { useHTTPHeaders } from '@graphiql-prototype/use-http-headers';

export const HTTPHeaderControlStory = () => {
  const { globalHeaders } = useHTTPHeaders();

  return (
    <FlexCol>
      <FlexRow name="HTTP Header Control">
        <HTTPHeaderControl placement="ACTIVE_TAB" values={globalHeaders} />
      </FlexRow>
    </FlexCol>
  );
};
