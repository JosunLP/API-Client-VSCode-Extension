import React, { FormEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import { shallow } from "zustand/shallow";

import { COMMON } from "../../../constants";
import useStore from "../../../store/useStore";
import RequestButton from "../Button/RequestButton";
import RequestDetailOption from "../Menu/RequestMenu";
import RequestMethod from "../Method/RequestMethod";
import RequestUrl from "../Url/RequestUrl";

const RequestPanel = () => {
  const requestMenuRef = useRef<HTMLDivElement | null>(null);
  const {
    requestData,
    requestMenuHeight,
    handleRequestProcessStatus,
    socketConnected,
  } = useStore(
    (state) => ({
      requestData: {
        authData: state.authData,
        requestUrl: state.requestUrl,
        authOption: state.authOption,
        bodyOption: state.bodyOption,
        bodyRawData: state.bodyRawData,
        bodyRawOption: state.bodyRawOption,
        requestMethod: state.requestMethod,
        keyValueTableData: state.keyValueTableData,
      },
      requestMenuHeight: state.requestMenuHeight,
      handleRequestProcessStatus: state.handleRequestProcessStatus,
      socketConnected: state.socketConnected,
    }),
    shallow,
  );

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (["SOCKET", "WEBSOCKET", "SERIAL"].includes(requestData.requestMethod)) {
      if (socketConnected) {
        vscode.postMessage({
          command: COMMON.SOCKET_DISCONNECT,
        });
      } else {
        if (requestData.requestUrl.length !== 0) {
          vscode.postMessage({
            command: COMMON.SOCKET_CONNECT,
            ...requestData,
          });
        }
      }
      return;
    }

    if (requestData.requestUrl.length !== 0) {
      handleRequestProcessStatus(COMMON.LOADING);
    }

    vscode.postMessage({
      ...requestData,
    });
  };

  useEffect(() => {
    if (requestMenuRef.current) {
      requestMenuRef.current.style.height = requestMenuHeight;
    }
  }, [requestMenuHeight]);

  return (
    <RequestPanelWrapper ref={requestMenuRef}>
      <RequestMainForm onSubmit={handleFormSubmit}>
        <RequestMethod />
        <RequestUrl />
        <RequestButton />
      </RequestMainForm>
      <RequestDetailOption />
    </RequestPanelWrapper>
  );
};

const RequestPanelWrapper = styled.div`
  margin: 5.5rem 5rem 1.5rem 5rem;
  overflow: hidden;
`;

const RequestMainForm = styled.form`
  display: flex;
`;

export default RequestPanel;
