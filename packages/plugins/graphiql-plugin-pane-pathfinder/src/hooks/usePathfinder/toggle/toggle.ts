import { FieldNode, Location } from 'graphql';
import { IRange } from 'monaco-editor';

// helpers
import { insertNewOperation } from './insertNewOperation';

// hooks
import { useEditor } from '@graphiql-prototype/store';

// types
import { AncestorField, AncestorRoot, AncestorsArray } from '../types';

import {
  rangeInsertAfterField,
  rangeInsertBeforeClosingBracket,
  rangeRemoveForAllSelectionsOfField,
  rangeRemoveForFieldWithSelections,
  rangeRemoveForSingleLine,
} from './range';

const targetModel = 'operationsModel';

export const toggle = ({
  ancestors,
}: {
  ancestors: AncestorsArray;
  // eslint-disable-next-line consistent-return
}) => {
  const activeEditorTab = useEditor.getState().getActiveTab();
  const updateModel = useEditor.getState().updateModel;

  const target = ancestors[ancestors.length - 1];
  const index = ancestors.findIndex((a) => a === target);

  const previousAncestor = ancestors[index - 1];
  const countPreviousAncestorSelections = (): number => {
    if (
      'field' in previousAncestor &&
      previousAncestor.selection &&
      'selectionSet' in previousAncestor.selection &&
      previousAncestor.selection.selectionSet
    ) {
      return previousAncestor.selection.selectionSet.selections.length;
    }
    if (
      'operationType' in previousAncestor &&
      previousAncestor.operationDefinition &&
      'selectionSet' in previousAncestor.operationDefinition &&
      previousAncestor.operationDefinition.selectionSet
    ) {
      return previousAncestor.operationDefinition.selectionSet.selections.length;
    }
    return 0;
  };

  const previousAncestorSelectionsCount = countPreviousAncestorSelections();

  console.log('toggle', {
    ancestors,
  });

  // 👇 short-circuit this process and build a brand new operation if we don't have an active operation definition
  if ((ancestors[0] as AncestorRoot).operationDefinition === null) {
    return insertNewOperation({ ancestors });
  }

  const isNestedField = 'field' in previousAncestor;
  const isField = 'field' in target;

  if (isField) {
    const isSelected = !!target.selection;

    if (isSelected) {
      // this is a REMOVE action

      const location = target.selection?.loc as Location;

      if (!isNestedField) {
        if (previousAncestorSelectionsCount === 1) {
          // console.log('REMOVE: this is a top level field and is the only selection', {});
          return updateModel({
            range: activeEditorTab.operationsModel.getFullModelRange(),
            targetModel,
            text: null,
          });
        }

        if (previousAncestorSelectionsCount > 0) {
          // console.log(
          //   'REMOVE: this is a top level field but there are other top level selections'
          // );

          if (
            target.selection &&
            'selectionSet' in target.selection &&
            target.selection.selectionSet
          ) {
            // if this field has existing selections, we use an expanded range
            return updateModel({
              range: rangeRemoveForFieldWithSelections({ location }),
              targetModel,
              text: null,
            });
          } else {
            // if this field does not have selections, we just remove the field
            return updateModel({
              range: rangeRemoveForSingleLine({ location }),
              targetModel,
              text: null,
            });
          }
        }
      }

      if (isNestedField) {
        if (previousAncestorSelectionsCount === 1) {
          // console.log('REMOVE: this is not a top level field and is the only selection');
          return updateModel({
            range: rangeRemoveForAllSelectionsOfField({ location }),
            targetModel,
            text: null,
          });
        }

        // 4. this is not a top level field but there are other selections
        if (previousAncestorSelectionsCount > 1) {
          // console.log(
          //   'REMOVE: this is not a top level field but there are other selections'
          // );
          if ((target.selection as FieldNode).selectionSet) {
            // if this field has existing selections, we use an expanded range
            return updateModel({
              range: rangeRemoveForFieldWithSelections({ location }),
              targetModel,
              text: null,
            });
          } else {
            // if this field does not have selections, we just remove the field
            return updateModel({
              range: rangeRemoveForSingleLine({ location }),
              targetModel,
              text: null,
            });
          }
        }
      }
    }

    if (!isSelected) {
      // this is an INSERT action
      if (!isNestedField && previousAncestorSelectionsCount > 0) {
        // console.log(
        //   'INSERT: this is a top level field and there are existing top level selections',
        // );
        const location = (previousAncestor as AncestorRoot).operationDefinition
          ?.loc as Location;

        return updateModel({
          range: rangeInsertBeforeClosingBracket({ location }),
          targetModel,
          text: `${' '.repeat(location.startToken.column + 1)}${target.field.name}\n`,
        });
      }

      if (isNestedField && previousAncestor.selection) {
        // console.log(`INSERT: this is not a top level field and it's parent is selected`);

        const location = previousAncestor.selection.loc as Location;

        // if the parent has more than one selection, our range is one thing
        if (previousAncestorSelectionsCount > 0) {
          return updateModel({
            range: rangeInsertBeforeClosingBracket({ location }),
            targetModel,
            text: `${' '.repeat(location.startToken.column + 1)}${target.field.name}\n`,
          });
        } else {
          // if the parent does not have any selections, our range is another
          const calculatedWrite = `${previousAncestor.field.name} {\n${' '.repeat(
            location.startToken.column + 1
          )}${target.field.name}\n${' '.repeat(location.startToken.column - 1)}}`;

          return updateModel({
            range: rangeInsertAfterField({
              endColumn:
                location.startToken.column + previousAncestor.field.name.length + 2,
              location,
            }),
            targetModel,
            text: calculatedWrite,
          });
        }
      }

      // this is the most complicated case to reckon...reader beware ☠️
      // our target is a nested field and the previous ancestor is not selected
      if (isNestedField && !previousAncestor.selection) {
        // console.log(
        //   'field, is not selected, is target, setting actionMode to INSERT --- CHALLENGE'
        // );

        // capture all ancestors except the first, which is always the root operation type
        const fieldAncestors = [...ancestors.slice(1)] as AncestorField[];

        // from those ancestors, capture all that are not selected
        // we'll use this array to build our new selection
        const allUnselectedAncestors = fieldAncestors.filter((a) => !a.selection);

        // capture the nearest ancestor that is selected
        // used for location/range and determining if our new selection should be wrapped in brackets
        const nearestSelectedAncestor = [...fieldAncestors]
          .reverse()
          .find((a) => a.selection);

        // a boolean indicating whether our nearest selected ancestor has selections of it's own
        // also used for location/range and determining if our new selection should be wrapped in brackets
        const nearestSelectedAncestorHasSelections = !!(
          nearestSelectedAncestor?.selection &&
          'selectionSet' in nearestSelectedAncestor?.selection &&
          nearestSelectedAncestor?.selection.selectionSet
        );

        // the location of our insert action is either the nearest selected ancestor or the root operation type
        const location = nearestSelectedAncestor
          ? (nearestSelectedAncestor.selection?.loc as Location)
          : ((ancestors[0] as AncestorRoot).operationDefinition?.loc as Location);

        const calculatedText = () => {
          const arr = allUnselectedAncestors;
          const indentSize = 2;

          // if we have a nearest selected ancestor (meaning we're adding to a selected field, not to the root operation)
          // and that ancestor does not have selections, we should add wrapping brackets
          const shouldAddWrappingBrackets =
            !!nearestSelectedAncestor && !nearestSelectedAncestorHasSelections;

          let fieldText = '';
          let bracketText = '';

          if (shouldAddWrappingBrackets) {
            fieldText += ` {\n`;
          }

          // a variable to hold the count of the number of spaces to indent each of our fields
          // we increment this for every field
          let fieldIndentCount = (ancestors.length - arr.length) * indentSize;

          // a variable to hold the count of the number of spaces to indent the closing brackets on each of our fields (where necessary)
          // we decrement this for every field/bracket
          let bracketIndentCount = (ancestors.length - 2) * indentSize;

          arr.forEach((a, index) => {
            const fieldIndent = ' '.repeat(fieldIndentCount);
            fieldText += fieldIndent;
            fieldText += a.field.name;
            // this space is critical, so i'm calling it out here
            fieldText += ' ';
            fieldText += `${index < arr.length - 1 ? '{\n' : '\n'}`;
            fieldIndentCount += 2;

            const bracketIndent = `${' '.repeat(bracketIndentCount)}}\n`;
            bracketText += `${index < arr.length - 1 ? bracketIndent : ''}`;
            bracketIndentCount -= 2;
          });

          if (shouldAddWrappingBrackets) {
            bracketText += `${' '.repeat(bracketIndentCount + 2)}}`;
          }
          const text = fieldText + bracketText;

          return text;
        };

        let range: IRange | null = null;

        if (!nearestSelectedAncestor) {
          range = rangeInsertBeforeClosingBracket({ location });
        } else {
          if (nearestSelectedAncestorHasSelections) {
            range = rangeInsertBeforeClosingBracket({ location });
          } else {
            range = {
              startLineNumber: location.startToken.line,
              startColumn: (location.startToken.column +
                nearestSelectedAncestor?.field.name.length) as number,
              endLineNumber: location.startToken.line,
              endColumn:
                ((location.startToken.column +
                  nearestSelectedAncestor?.field.name.length) as number) + 1,
            };
          }
        }

        return updateModel({
          range,
          targetModel,
          text: calculatedText(),
        });
      }
    }
  } // isField
};
