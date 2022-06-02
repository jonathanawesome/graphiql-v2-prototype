import { useState } from 'react';
import cuid from 'cuid';

import {
  GraphQLInputField,
  GraphQLInputObjectType,
  isInputObjectType,
  isRequiredArgument,
  isRequiredInputField,
  ObjectValueNode,
} from 'graphql';

/** components */
import { Caret, FieldDetails, InputField } from '../index';

/** hooks */
import {
  AncestorArgument,
  AncestorInputField,
  AncestorInputObject,
  AncestorMap,
} from '../../hooks';

/** styles */
import { Content, Root, Trigger, TriggerWrap, InputFields } from './styles';

/** utils */
import { capitalize, generateVariableNameFromAncestorMap } from '../../utils';

export const InputObject = ({
  ancestors,
  renderingInputField,
  inputType,
}: {
  ancestors: AncestorMap;
  renderingInputField: GraphQLInputField;
  inputType: GraphQLInputObjectType;
}) => {
  const hash = cuid.slug();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const fields = inputType.getFields();

  const previousAncestor = ancestors.values().next().value as
    | AncestorArgument
    | AncestorInputObject;

  // console.log('rendering InputObject', {
  //   // inputType and previousAncestor.inputObject are the same
  //   inputType,
  //   ancestors,
  //   renderingInputField,
  //   previousAncestor,
  // });

  return (
    <Root open={isExpanded} onOpenChange={setIsExpanded}>
      <TriggerWrap>
        <Trigger>
          <Caret isExpanded={isExpanded} />
        </Trigger>
        <FieldDetails
          name={`${renderingInputField.name}${
            isRequiredArgument(renderingInputField) ||
            isRequiredInputField(renderingInputField)
              ? `*`
              : ''
          }`}
          description={inputType.description || null}
          typeName={inputType.name}
          variant="INPUT_TYPE"
          isSelected={!!previousAncestor.selection}
        />
      </TriggerWrap>
      <Content>
        {isExpanded && (
          <InputFields>
            {Object.keys(fields).map((f) => {
              if (isInputObjectType(fields[f].type)) {
                // rendering nested InputObject
                return (
                  <InputObject
                    key={fields[f].name}
                    ancestors={
                      new Map([
                        [
                          // hash = safety first!
                          `${fields[f].name}-${hash}`,
                          {
                            inputObject: fields[f].type,
                            name: fields[f].name,
                            parentType: 'INPUT_OBJECT',
                            selection: previousAncestor.selection
                              ? (
                                  previousAncestor.selection.value as ObjectValueNode
                                ).fields.find((x) => x.name.value === fields[f].name)
                              : null,
                          } as AncestorInputObject,
                        ],
                        ...ancestors,
                      ])
                    }
                    inputType={fields[f].type as GraphQLInputObjectType}
                    renderingInputField={fields[f]}
                  />
                );
              } else {
                return (
                  <InputField
                    key={fields[f].name}
                    ancestors={
                      new Map([
                        [
                          `${fields[f].name}-${hash}`,
                          {
                            inputField: fields[f],
                            parentInputObject: inputType,
                            selection: previousAncestor.selection
                              ? (
                                  previousAncestor.selection?.value as ObjectValueNode
                                ).fields?.find((x) => x.name.value === f)
                              : null,
                            variableName: `${generateVariableNameFromAncestorMap({
                              ancestors,
                            })}${capitalize(fields[f].name)}`,
                          } as AncestorInputField,
                        ],
                        ...ancestors,
                      ])
                    }
                    inputField={fields[f]}
                  />
                );
              }
            })}
          </InputFields>
        )}
      </Content>
    </Root>
  );
};
