import { useGraphiQLEditor } from '@graphiql-v2-prototype/graphiql-editor';
import { Command } from '@graphiql-v2-prototype/graphiql-ui-library';
import { usePathfinder } from '../../hooks';

/** components */
import { BreadcrumbOverlay, Options, Search, RootType } from '../index';

/** styles */
import {
  ContainRight,
  PathfinderContent,
  PathfinderContentWrap,
  PathfinderLead,
  PathfinderWrap,
  FakeSearch,
} from './styles';

export const Pathfinder = () => {
  const { schema } = useGraphiQLEditor();
  const { overlayVisible } = usePathfinder();

  if (!schema) {
    //TODO: some loading skeleton
    return <p>loading schema...</p>;
  }
  if ('error' in schema) {
    //TODO: some error skeleton
    return <p>error loading schema.</p>;
  }

  const queryType = schema.getQueryType();
  // const mutationType = schema.getMutationType();

  return (
    <PathfinderWrap>
      <PathfinderLead>
        <h2>Docs</h2>
        <ContainRight>
          <FakeSearch>
            <div>
              <Search />
              <span>Search</span>
            </div>
            <div>
              <Command />
              <span>K</span>
            </div>
          </FakeSearch>
          <Options />
        </ContainRight>
      </PathfinderLead>
      <PathfinderContentWrap>
        <PathfinderContent>
          {queryType ? <RootType rootType={queryType} /> : null}
          {/* // TODO */}
          {/* {mutationType ? <RootType rootType={mutationType} /> : null} */}
        </PathfinderContent>
        {overlayVisible && <BreadcrumbOverlay />}
      </PathfinderContentWrap>
    </PathfinderWrap>
  );
};
