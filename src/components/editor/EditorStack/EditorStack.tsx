import { useEffect, useRef, useState } from 'react';

/** components */
import { Editor, EditorActions } from '@/components';
import { VariablesAndHeaders } from '../VariablesAndHeaders';

/** constants */
import { defaultOperation } from '@/constants';

/** hooks */
import { useOperation } from '@/hooks';

/** styles */
import {
  EditorActionsWrap,
  EditorStackContainer,
  OperationsEditor,
  VariablesAndHeadersWrap,
} from './styles';

export const EditorStack = () => {
  const { operationAction, operation, setOperation } = useOperation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const operationsEditorRef = useRef<HTMLDivElement | null>(null);
  const bottomPaneRef = useRef<HTMLDivElement | null>(null);

  const [operationsEditorHeight, setOperationsEditorHeight] = useState<null | number>(
    null
  );

  useEffect(() => {
    setHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationsEditorHeight]);

  const setHeight = () => {
    if (operationsEditorRef.current && bottomPaneRef.current && containerRef.current) {
      if (!operationsEditorHeight) {
        return setOperationsEditorHeight(operationsEditorRef.current.clientHeight);
      }
      operationsEditorRef.current.style.height = `${
        containerRef.current.clientHeight - bottomPaneRef.current.clientHeight
      }px`;
    }
    return undefined;
  };

  return (
    <EditorStackContainer ref={containerRef}>
      <OperationsEditor ref={operationsEditorRef}>
        <Editor
          action={operationAction()}
          defaultValue={defaultOperation}
          language="graphql"
          uri="OPERATIONS_EDITOR_URI"
          value={operation}
          valueSetter={setOperation}
        />
        <EditorActionsWrap>
          <EditorActions />
        </EditorActionsWrap>
      </OperationsEditor>
      <VariablesAndHeadersWrap ref={bottomPaneRef}>
        <VariablesAndHeaders setHeight={setHeight} />
      </VariablesAndHeadersWrap>
    </EditorStackContainer>
  );
};