/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldNode, GraphQLField, VariableDefinitionNode } from 'graphql';

export type OnEditSignature = ({ input }: { input: EditFieldAction }) => void;

export interface AddFieldNode {
  type: 'addField';
  payloads: GraphQLField<any, any>;
}

export interface RemoveFieldNode {
  type: 'removeField';
  payloads: { name: string };
}

export interface UpdateFieldNode {
  type: 'updateField';
  payloads: {
    field: FieldNode;
    variableNameToRemove?: string;
    variableDefinitionToAdd?: VariableDefinitionNode;
  };
}

export type EditFieldAction = AddFieldNode | RemoveFieldNode | UpdateFieldNode;
