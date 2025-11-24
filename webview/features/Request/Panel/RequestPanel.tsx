import React, { FormEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";

import { COMMON } from "../../../constants";
import useStore from "../../../store/useStore";
import RequestButton from "../Button/RequestButton";
import RequestDetailOption from "../Menu/RequestMenu";
import RequestMethod from "../Method/RequestMethod";
import RequestUrl from "../Url/RequestUrl";

const RequestPanel = () => {
  const requestMenuRef = useRef<HTMLDivElement | null>(null);
  const {
    authData,
    requestUrl,
    authOption,
    bodyOption,
    bodyRawData,
    bodyRawOption,
    requestMethod,
    keyValueTableData,
    requestMenuHeight,
    handleRequestProcessStatus,
    socketConnected,
  } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      requestUrl: state.requestUrl,
      authOption: state.authOption,
      bodyOption: state.bodyOption,
      bodyRawData: state.bodyRawData,
      bodyRawOption: state.bodyRawOption,
      requestMethod: state.requestMethod,
      keyValueTableData: state.keyValueTableData,
      requestMenuHeight: state.requestMenuHeight,
      handleRequestProcessStatus: state.handleRequestProcessStatus,
      socketConnected: state.socketConnected,
    })),
  );

  const requestData = {
    authData,
    requestUrl,
    authOption,
    bodyOption,
    bodyRawData,
    bodyRawOption,
    requestMethod,
    keyValueTableData,
  };

  const handleDisconnect = () => {
    vscode.postMessage({
      command: COMMON.SOCKET_DISCONNECT,
      requestMethod: requestData.requestMethod,
    });
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (["WEBSOCKET"].includes(requestData.requestMethod)) {
      if (socketConnected) {
        let socketData = "";
        if (requestData.bodyOption === "Raw") {
          switch (requestData.bodyRawOption) {
            case "JSON":
              socketData = requestData.bodyRawData.json;
              break;
            case "Text":
              socketData = requestData.bodyRawData.text;
              break;
            case "JavaScript":
              socketData = requestData.bodyRawData.javascript;
              break;
            case "HTML":
              socketData = requestData.bodyRawData.html;
              break;
            default:
              socketData = requestData.bodyRawData.text;
          }
        }

        vscode.postMessage({
          command: COMMON.SOCKET_EMIT,
          requestMethod: requestData.requestMethod,
          socketData: socketData,
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
        <RequestButton onDisconnect={handleDisconnect} />
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
