import create from 'zustand';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { editor as MONACO_EDITOR } from 'monaco-editor/esm/vs/editor/editor.api';
import cuid from 'cuid';
import { ExecutableDefinitionNode, isExecutableDefinitionNode, Kind } from 'graphql';

// constants
import {
  defaultOperation,
  defaultResults,
  defaultVariables,
  editorOptions,
  editorTheme,
} from '../../constants';

// hooks
import { useSchema } from '@graphiql-prototype/use-schema';

// types
import { EditorTab, EditorStore } from './types';

// utils
import { getOrCreateModel, pushEditOperationsToModel } from '../../utils';
import { parseQuery } from '@graphiql-prototype/utils';

export const useEditor = create<EditorStore>((set, get) => ({
  initMonacoEditor: ({ monacoEditorType, monacoEditorRef, optionOverrides }) => {
    const monacoEditors = get().monacoEditors;
    const activeTab = get().getActiveTab();

    const updateOperationDefinitionFromModelValue =
      get().updateOperationDefinitionFromModelValue;

    const runOperationAction = useSchema.getState().runOperationAction;

    MONACO_EDITOR.defineTheme('graphiql-default', editorTheme);

    const editor = MONACO_EDITOR.create(monacoEditorRef, {
      language: monacoEditorType === 'operations' ? 'graphql' : 'json',
      ...editorOptions, // spread our base options
      ...(optionOverrides && optionOverrides), // spread any option overrides that were passed in
      fixedOverflowWidgets: true,
      model: activeTab[`${monacoEditorType}Model`],
    });

    // add this editor to our editors state array
    set({
      monacoEditors: {
        ...monacoEditors,
        [monacoEditorType]: editor,
      },
    });

    // add the runOperationAction to the operation and variables editors
    if (monacoEditorType !== 'results') {
      editor.addAction(runOperationAction());
      // when our operation or variables editor models change, update the operationDefinition
      editor.onDidChangeModelContent(() => {
        updateOperationDefinitionFromModelValue({ value: editor.getValue() });
      });
    }

    editor.onDidContentSizeChange(() => {
      const contentHeight = Math.min(1000, editor.getContentHeight());
      if (monacoEditorRef && monacoEditorRef) {
        monacoEditorRef.style.height = `${contentHeight}px`;
      }
    });
  },
  setModelsForAllEditorsWithinTab: ({ destinationTab }) => {
    // get our array of editors
    const monacoEditors = get().monacoEditors;

    // find each editor
    // TODO: there's probably a better way to do this 👇
    const operationsEditor = monacoEditors.operations;
    const variablesEditor = monacoEditors.variables;
    const headersEditor = monacoEditors.headers;
    const resultsEditor = monacoEditors.results;

    // set the model for each of our editors
    operationsEditor?.setModel(destinationTab.operationsModel);
    variablesEditor?.setModel(destinationTab.variablesModel);
    headersEditor?.setModel(destinationTab.headersModel);
    resultsEditor?.setModel(destinationTab.resultsModel);

    console.log('setModelsForAllEditorsWithinTab', {
      destination: destinationTab.operationsModel,
      operationsEditor,
    });
  },
  initEditorTab: () => {
    // grab our array of existing editorTabs
    const editorTabs = get().editorTabs;

    const setModelsForAllEditorsWithinTab = get().setModelsForAllEditorsWithinTab;
    const switchEditorTab = get().switchEditorTab;

    // generate a unique id for our new editorTab
    const newEditorTabId = cuid.slug();

    // create all of the necessary models for our new editorTab
    const operationsModel = getOrCreateModel({
      uri: `${newEditorTabId}-operations.graphql`,
      value: defaultOperation,
    });
    const variablesModel = getOrCreateModel({
      uri: `${newEditorTabId}-variables.json`,
      value: defaultVariables,
    });
    const headersModel = getOrCreateModel({
      uri: `${newEditorTabId}-headers.json`,
      value: defaultVariables,
    });
    const resultsModel = getOrCreateModel({
      uri: `${newEditorTabId}-results.json`,
      value: defaultResults,
    });

    // build our new editorTab shape
    const newEditorTab: EditorTab = {
      editorTabId: newEditorTabId,
      editorTabName: `Tab${editorTabs.length > 0 ? editorTabs.length + 1 : 1}`,
      operationsModel,
      variablesModel,
      headersModel,
      resultsModel,
      operationDefinition: null,
    };

    setModelsForAllEditorsWithinTab({ destinationTab: newEditorTab });

    // set the activeEditorTabId to our new editorTab and spread our new editorTab into our array of editorTabs
    set({ activeEditorTabId: newEditorTabId, editorTabs: [...editorTabs, newEditorTab] });
    switchEditorTab({ editorTabId: newEditorTabId });
  },
  monacoGraphQLAPI: initializeMode({
    formattingOptions: {
      prettierConfig: {
        // TODO: this could use some tweaking
        printWidth: 40,
      },
    },
  }),
  activeEditorTabId: null,
  setActiveEditorTabId: ({ editorTabId }) => {
    set({ activeEditorTabId: editorTabId });
  },
  getActiveTab: () => {
    const activeEditorTabId = get().activeEditorTabId;
    const editorTabs = get().editorTabs;
    const activeTab = editorTabs.find(
      (editorTab) => editorTab.editorTabId === activeEditorTabId
    );

    return activeTab as EditorTab;
  },
  editorTabs: [],
  resetEditorTabs: () => {
    const initEditorTab = get().initEditorTab;

    // reset
    set({ editorTabs: [] });

    // init new tab1
    initEditorTab();
  },
  removeEditorTab: ({ editorTabId }) => {
    const editorTabs = get().editorTabs;
    const switchEditorTab = get().switchEditorTab;
    // filter the tab we're removing from our editorTabs array
    const remainingEditors = editorTabs.filter((t) => t.editorTabId !== editorTabId);

    set({
      // replace our editorTabs array with our remaining editors
      editorTabs: remainingEditors,
      // set the new active tab to the first tab
      activeEditorTabId: remainingEditors[0].editorTabId,
    });

    // replace the models within our editors
    switchEditorTab({ editorTabId: remainingEditors[0].editorTabId });
  },
  switchEditorTab: ({ editorTabId }) => {
    // const monacoGraphQLAPI = get().monacoGraphQLAPI;
    // const monacoEditors = get().monacoEditors;
    const editorTabs = get().editorTabs;
    const editorTab = editorTabs.find((t) => t.editorTabId === editorTabId);
    const setModelsForAllEditorsWithinTab = get().setModelsForAllEditorsWithinTab;

    if (editorTab) {
      // explicitly set the activeEditorTabId
      set({ activeEditorTabId: editorTabId });

      setModelsForAllEditorsWithinTab({ destinationTab: editorTab });

      //TODO there's an uncaught promise in the DiagnosticsAdapter
      // languageFeatures.ts:124 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'doValidation') at DiagnosticsAdapter._doValidate (languageFeatures.ts:124:38)
      // monacoGraphQLAPI.setDiagnosticSettings({
      //   validateVariablesJSON: {
      //     [editorTab.operationsModel.uri.toString()]: [
      //       editorTab.variablesModel.uri.toString(),
      //     ],
      //   },
      //   jsonDiagnosticSettings: {
      //     // jsonc tip!
      //     allowComments: true,
      //     schemaValidation: 'error',
      //     // this is nice too
      //     trailingCommas: 'warning',
      //   },
      // });
    }
  },
  // removeVariables: ({ variableNames }) => {
  //   const activeEditorTab = getActiveEditorTab();

  //   if (activeEditorTab) {
  //     // 1. parse the existing variables string to an object
  //     const parsedVariables = JSON.parse(activeEditorTab.variablesModel.getValue());
  //     // 2. remove the variables
  //     variableNames.forEach((v) => {
  //       delete parsedVariables[v];
  //     });
  //     // 3. return to string
  //     const newVariablesString = JSON.stringify(parsedVariables, null, ' ');
  //     // 4. update the model
  //     pushEditOperationsToModel({
  //       model: activeEditorTab.variablesModel,
  //       text: newVariablesString,
  //     });
  //   } else {
  //     console.log("editorTab doesn't exist ☠️");
  //   }
  // },
  updateVariable: ({ variableName, variableValue }) => {
    const activeEditorTab = get().getActiveTab();
    // console.log('running updateVariable', {
    //   variableName,
    //   variableValue,
    // });
    if (activeEditorTab) {
      // 1. parse the existing variables string to an object
      // if the current variables model is undefined, use an empty object string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parsedVariables: Record<any, any> = {};
      try {
        parsedVariables = JSON.parse(activeEditorTab.variablesModel.getValue() || '{}');
      } catch (error) {
        console.warn('error parsing variables in updateVariable');
      }
      // 2. set the variableName and/or variableValue
      parsedVariables[variableName] = variableValue;
      // 3. return to string
      const newVariablesString = JSON.stringify(parsedVariables, null, ' ');
      // 4. update the model
      // console.log('updateVariable, pushEditOperationsToModel', { newVariablesString });
      pushEditOperationsToModel({
        model: activeEditorTab.variablesModel,
        text: newVariablesString,
      });
    } else {
      console.log("editorTab doesn't exist ☠️");
    }
  },
  updateModel: ({ modelType, newValue }) => {
    const editorTabs = get().editorTabs;
    const activeEditorTabId = get().activeEditorTabId;

    const activeEditorTab = editorTabs.find(
      (editorTab) => editorTab.editorTabId === activeEditorTabId
    );

    if (activeEditorTab) {
      const model = activeEditorTab[modelType];
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: newValue,
          },
        ],
        () => []
      );
    }
  },
  updateOperationDefinition: ({ newDefinition }) => {
    const editorTabs = get().editorTabs;
    const activeEditorTabId = get().activeEditorTabId;

    // 👇 safety first
    const editorTabsCopy = [...editorTabs];
    const existingEditorTabIndex = editorTabsCopy.findIndex(
      (editorTab) => editorTab.editorTabId === activeEditorTabId
    );

    if (existingEditorTabIndex !== -1) {
      if (!newDefinition) {
        // if we're here,  user has either manually cleared the operations editor or user has toggled OFF all fields in Pathfinder
        editorTabsCopy[existingEditorTabIndex] = {
          ...editorTabsCopy[existingEditorTabIndex],
          operationDefinition: null,
        };
      } else if (isExecutableDefinitionNode(newDefinition)) {
        // TODO: do we want to populate the variables editor here?
        // const variableDefinitions = newDefinition.variableDefinitions;
        // console.log('variableDefinitions', { variableDefinitions });
        // if (variableDefinitions && variableDefinitions?.length > 0) {
        //   const activeEditorTab = editorTabsCopy.find(
        //     (eT) => eT.editorTabId === activeEditorTabId
        //   );

        //   const variablesString = activeEditorTab?.variablesModel.getValue();

        //   let parsed: Record<any, any> = {};
        //   if (variablesString) {
        //     parsed = JSON.parse(variablesString);
        //     // we have an object with our existing variables
        //   }
        // }

        editorTabsCopy[existingEditorTabIndex] = {
          ...editorTabsCopy[existingEditorTabIndex],
          // let's ensure we're covering situations where user is explicitly naming their operation
          // this is the only way, currently, to provide a name for a tab
          editorTabName:
            newDefinition.name?.value ||
            editorTabsCopy[existingEditorTabIndex].editorTabName,
          operationDefinition: newDefinition,
        };
      }
      set({ editorTabs: editorTabsCopy });
    }
  },
  updateOperationDefinitionFromModelValue: ({ value }) => {
    const updateOperationDefinition = get().updateOperationDefinition;
    // console.log('updateOperationDefinitionFromModelValue', { value });

    const parsedQuery = parseQuery(value);
    if (!(parsedQuery instanceof Error)) {
      // console.log('parsedQuery', { parsedQuery });
      const operationDefinition = (): ExecutableDefinitionNode | null => {
        const firstDefinition = parsedQuery?.definitions[0];

        if (!firstDefinition) {
          return null;
        }

        if (isExecutableDefinitionNode(firstDefinition)) {
          return firstDefinition;
        }

        return null;
      };

      const newDefinition = operationDefinition();

      if (newDefinition?.kind === Kind.OPERATION_DEFINITION) {
        updateOperationDefinition({ newDefinition });
      }
    }
  },

  monacoEditors: {
    operations: null,
    variables: null,
    results: null,
    headers: null,
  },
  addMonacoEditor: ({ editor, name }) => {
    // console.log('running addMonacoEditor', { editor, name });

    MONACO_EDITOR.defineTheme('graphiql-default', editorTheme);

    const monacoEditors = get().monacoEditors;

    set({
      monacoEditors: {
        ...monacoEditors,
        ...(!monacoEditors[name] && { [name]: editor }),
      },
    });
    // console.log('running addMonacoEditor after', { editors: get().monacoEditors });

    // const existingEditor = monacoEditors.find((e) => e.name === name);
    // if (!existingEditor) {
    //   set({ monacoEditors: [...monacoEditors, { editor, name }] });
    // }
  },
}));
