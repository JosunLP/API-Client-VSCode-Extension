import React, { useEffect } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";

import { REQUEST } from "../../../constants";
import useStore from "../../../store/useStore";
import { generateParameterString, removeUrlParameter } from "../../../utils";

const RequestUrl = () => {
  const {
    requestUrl,
    requestOption,
    keyValueTableData,
    handleRequestUrlChange,
    socketConnected,
  } = useStore(
    useShallow((state) => ({
      requestUrl: state.requestUrl,
      requestOption: state.requestOption,
      keyValueTableData: state.keyValueTableData,
      handleRequestUrlChange: state.handleRequestUrlChange,
      socketConnected: state.socketConnected,
    })),
  );

  useEffect(() => {
    if (requestOption !== REQUEST.PARAMS) return;

    const filteredData = keyValueTableData.filter(
      (data) => data.optionType === REQUEST.PARAMS && data.isChecked,
    );

    if (filteredData.length === 0) {
      const parameterRemovedUrl = removeUrlParameter(requestUrl);

      if (parameterRemovedUrl) {
        handleRequestUrlChange(parameterRemovedUrl);
      }

      return;
    }

    const parameterString = generateParameterString(filteredData);
    const parameterRemovedUrl = removeUrlParameter(requestUrl);
    const newUrlWithParams = parameterRemovedUrl + parameterString;

    if (newUrlWithParams !== requestUrl) {
      handleRequestUrlChange(newUrlWithParams);
    }
  }, [keyValueTableData]);

  return (
    <InputContainer
      placeholder="Enter Request URL"
      value={requestUrl}
      onChange={(event) => handleRequestUrlChange(event.target.value)}
      readOnly={socketConnected}
      style={{
        opacity: socketConnected ? 0.6 : 1,
        cursor: socketConnected ? "not-allowed" : "text",
      }}
    />
  );
};

const InputContainer = styled.input`
  padding-left: 1.5rem;
  font-size: 1.15rem;
  background-color: var(--vscode-editor-background);
  color: rgba(255, 255, 255, 0.78);
`;

export default RequestUrl;
