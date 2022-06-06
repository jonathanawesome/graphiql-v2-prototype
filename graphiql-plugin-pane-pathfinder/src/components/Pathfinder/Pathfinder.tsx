import { Command, useGraphiQL } from '@graphiql-v2-prototype/graphiql-v2';

/** components */
import { Options, Search, RootType } from '../index';

/** styles */
import {
  ContainRight,
  PathfinderContent,
  PathfinderLead,
  PathfinderStyled,
  FakeSearch,
} from './styles';

export const Pathfinder = () => {
  const { schema } = useGraphiQL();

  if (!schema) {
    //TODO: some loading skeleton
    return <p>loading schema...</p>;
  }

  const queryType = schema.getQueryType();
  // const mutationType = schema.getMutationType();

  return (
    <PathfinderStyled>
      <PathfinderLead>
        <h2>Pathfinder</h2>
        <ContainRight>
          <FakeSearch>
            <Search />
            <span>Search</span>
            <Command />
            <span>K</span>
          </FakeSearch>
          <Options />
        </ContainRight>
      </PathfinderLead>
      <PathfinderContent>
        {queryType ? <RootType rootType={queryType} /> : null}
        {/* // TODO */}
        {/* {mutationType ? <RootType rootType={mutationType} /> : null} */}
      </PathfinderContent>
    </PathfinderStyled>
  );
};