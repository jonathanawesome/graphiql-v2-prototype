import { useEffect, useState } from 'react';
import {
  FieldNode,
  GraphQLObjectType,
  OperationTypeNode,
  SelectionSetNode,
} from 'graphql';

// hooks
import { useEditor } from '@graphiql-prototype/use-editor';

// components
import { Field, ListItem } from '../index';
import { Message } from '@graphiql-prototype/ui-library';

// styles
import { StyledRootOperation } from './styles';

export const RootOperation = ({
  operationType,
  rootType,
}: {
  operationType: OperationTypeNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootType: GraphQLObjectType<any, any> | null;
}) => {
  const [selectionSet, setSelectionSet] = useState<SelectionSetNode | undefined>(
    undefined
  );

  const activeEditorTab = useEditor().getActiveTab();

  const operationDefinition = activeEditorTab?.operationDefinition;

  // console.log('rendering RootOperation', {
  //   operationDefinition,
  //   // activeEditorTab,
  //   // editorTabs,
  // });

  useEffect(() => {
    const activeOperationType = operationDefinition?.operation;
    if (!activeOperationType || activeOperationType === operationType) {
      return setSelectionSet(operationDefinition?.selectionSet);
    }
    return setSelectionSet(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationDefinition]);

  const fields = rootType?.getFields();

  if (!fields) {
    return (
      <StyledRootOperation>
        <Message
          message={
            <>{`The active schema doesn’t provide a ${operationType} root operation type.`}</>
          }
          variant="WARNING"
        />
      </StyledRootOperation>
    );
  }

  return (
    <StyledRootOperation>
      {Object.keys(fields)
        .sort()
        .map((field) => (
          <Field
            key={field}
            ancestors={
              new Map([
                [
                  `${fields[field].name}`,
                  {
                    field: fields[field],
                    selectionSet,
                    selection:
                      operationDefinition?.selectionSet?.selections.find(
                        (selection) =>
                          (selection as FieldNode).name.value === fields[field].name
                      ) || null,
                  },
                ],
              ])
            }
            operationType={operationType}
          />
        ))}
    </StyledRootOperation>
  );
};
