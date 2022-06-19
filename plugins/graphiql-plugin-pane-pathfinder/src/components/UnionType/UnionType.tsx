import { useState } from 'react';
import cuid from 'cuid';

import {
  FieldNode,
  GraphQLObjectType,
  GraphQLUnionType,
  InlineFragmentNode,
  Kind,
} from 'graphql';

/** components */
import { Collapser, Column, Describe, ObjectType } from '../index';

/** types */
import type { AncestorMap } from '../../hooks';

type UnionTypeProps = {
  ancestors: AncestorMap;
  selection: FieldNode | InlineFragmentNode | undefined;
  unionType: GraphQLUnionType;
};

export const UnionType = ({ ancestors, selection, unionType }: UnionTypeProps) => {
  const unionMembers = unionType.getTypes();

  // console.log('rendering UnionType', { unionMembers });

  return (
    <Column>
      {unionMembers.map((o) => (
        <UnionMember
          key={o.name}
          ancestors={ancestors}
          objectMember={o}
          selection={selection}
        />
      ))}
    </Column>
  );
};

const UnionMember = ({
  ancestors,
  objectMember,
  selection,
}: {
  ancestors: AncestorMap;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objectMember: GraphQLObjectType<any, any>;
  selection: FieldNode | InlineFragmentNode | undefined;
}) => {
  const hash = cuid.slug();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const inlineFragmentNode = selection?.selectionSet?.selections?.find(
    (s) =>
      s.kind === Kind.INLINE_FRAGMENT && s.typeCondition?.name.value === objectMember.name
  ) as InlineFragmentNode | undefined;

  return (
    <Collapser
      content={
        <ObjectType
          ancestors={
            new Map([
              // set inline fragment ancestor
              [
                // hash = safety first!
                `${objectMember.name}-${hash}`,
                {
                  onType: objectMember.name,
                  selectionSet: selection?.selectionSet,
                  selection: inlineFragmentNode || null,
                },
              ],
              ...ancestors,
            ])
          }
          fields={objectMember.getFields()}
          selection={inlineFragmentNode}
        />
      }
      leadContent={
        <Describe
          name={`... on`}
          description={objectMember.description || null}
          isSelected={!!inlineFragmentNode}
          type={objectMember}
          variant="INLINE_FRAGMENT"
        />
      }
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  );
};