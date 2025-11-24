import { Request } from "postman-collection";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "use-debounce";
import { useShallow } from "zustand/react/shallow";

import CopyIcon from "../../../components/CopyIcon";
import SelectWrapper from "../../../components/SelectWrapper";
import { COMMON, HEIGHT, OPTION } from "../../../constants";
import CodeEditor from "../../../shared/CodeEditor";
import useStore from "../../../store/useStore";
import { generateSdkRequestObject } from "../../../utils";

// Lazy load the heavy postman-code-generators module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let codegenModule: any = null;
const loadCodegen = async () => {
  if (!codegenModule) {
    // @ts-expect-error: postman-code-generators lacks types
    codegenModule = await import("postman-code-generators");
  }
  return codegenModule;
};

const RequestCodeSnippet = () => {
  const [isCodegenLoaded, setIsCodegenLoaded] = useState(false);
  const {
    authData,
    requestUrl,
    authOption,
    bodyOption,
    bodyRawData,
    requestMethod,
    bodyRawOption,
    codeSnippetValue,
    keyValueTableData,
    codeSnippetOption,
    setCodeSnippetValue,
    handleCodeSnippetOptionChange,
    handleCodeSnippetVariantChange,
  } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      requestUrl: state.requestUrl,
      authOption: state.authOption,
      bodyOption: state.bodyOption,
      bodyRawData: state.bodyRawData,
      requestMethod: state.requestMethod,
      bodyRawOption: state.bodyRawOption,
      codeSnippetValue: state.codeSnippetValue,
      keyValueTableData: state.keyValueTableData,
      codeSnippetOption: state.codeSnippetOption,
      setCodeSnippetValue: state.setCodeSnippetValue,
      handleCodeSnippetOptionChange: state.handleCodeSnippetOptionChange,
      handleCodeSnippetVariantChange: state.handleCodeSnippetVariantChange,
    })),
  );
  const DEBOUNCE_TIME_VALUE = 800;
  const [debouncedUrlValue] = useDebounce(requestUrl, DEBOUNCE_TIME_VALUE);

  const handleCopyIconClick = (value: string | undefined) => {
    vscode.postMessage({ command: COMMON.ALERT_COPY });

    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  const memoizedSdkRequestObject = useMemo(
    () =>
      generateSdkRequestObject(
        debouncedUrlValue,
        requestMethod,
        keyValueTableData,
        authOption,
        authData,
        bodyOption,
        bodyRawOption,
        bodyRawData,
        Request,
      ),
    [
      debouncedUrlValue,
      requestMethod,
      keyValueTableData,
      authOption,
      authData,
      bodyOption,
      bodyRawOption,
      bodyRawData,
    ],
  );

  const handleCodeSnippetOption = (event: ChangeEvent<HTMLSelectElement>) => {
    const clickedTarget = event.target;

    const targetOption = OPTION.CODE_SNIPPET_OPTIONS.filter(
      (languageData) => languageData.label === clickedTarget.value,
    );

    handleCodeSnippetOptionChange(
      clickedTarget.value,
      targetOption[0].variants[0],
      targetOption[0].editorLanguage,
    );
  };

  // Load codegen module on first render
  useEffect(() => {
    let mounted = true;
    loadCodegen().then(() => {
      if (mounted) {
        setIsCodegenLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isCodegenLoaded || !codegenModule) return;

    codegenModule.default.convert(
      codeSnippetOption.language.toLowerCase(),
      codeSnippetOption.variant,
      memoizedSdkRequestObject,
      {},
      (error: string, snippet: string) => {
        if (error) {
          console.error(error);
        } else {
          setCodeSnippetValue(snippet);
        }
      },
    );
  }, [
    isCodegenLoaded,
    debouncedUrlValue,
    requestMethod,
    codeSnippetOption.language,
    codeSnippetOption.variant,
  ]);

  return (
    <>
      <SelectWrapper primary={false} secondary={false} requestMenu={false}>
        <h3>Language: </h3>
        <SelectOptionWrapper
          onChange={handleCodeSnippetOption}
          value={codeSnippetOption.language}
          disabled={!isCodegenLoaded}
        >
          {OPTION.CODE_SNIPPET_OPTIONS.map(({ label }, index) => (
            <option key={"Code Snippet" + index} value={label}>
              {label === "csharp" ? "C#" : label}
            </option>
          ))}
        </SelectOptionWrapper>
        <h3 className="variantsLabel">Variants: </h3>
        <SelectOptionWrapper
          onChange={(event) =>
            handleCodeSnippetVariantChange(event.target.value)
          }
          value={codeSnippetOption.variant}
          disabled={!isCodegenLoaded}
        >
          {OPTION.CODE_SNIPPET_OPTIONS.map(
            ({ label, variants }, index) =>
              label === codeSnippetOption.language &&
              variants.map((variant) => (
                <option key={variant + index} value={variant}>
                  {variant}
                </option>
              )),
          )}
        </SelectOptionWrapper>
        <CopyIcon handleClick={handleCopyIconClick} value={codeSnippetValue} />
      </SelectWrapper>
      {!isCodegenLoaded && (
        <LoadingMessage>Loading code generator...</LoadingMessage>
      )}
      <CodeEditor
        codeEditorValue={codeSnippetValue}
        editorHeight={HEIGHT.REQUEST_EDITOR_HEIGHT}
        editorOption={OPTION.CODE_SNIPPET_EDITOR_OPTIONS}
        language={codeSnippetOption.editorLanguage.toLowerCase()}
        handleEditorChange={() => undefined}
        handleBeautifyButton={() => undefined}
      />
    </>
  );
};

const SelectOptionWrapper = styled.select`
  width: 9rem;
  height: 2.3rem;
  margin-left: 1rem;
  padding-left: 0.7rem;
  border: 0.1rem solid rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: var(--vscode-editor-background);
  color: rgba(255, 255, 255, 0.78);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--vscode-descriptionForeground);
  font-style: italic;
`;

export default RequestCodeSnippet;
