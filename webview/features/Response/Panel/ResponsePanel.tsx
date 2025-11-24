import React, { useEffect } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";

import Loader from "../../../components/Loader";
import { COMMON, RESPONSE } from "../../../constants";
import useStore from "../../../store/useStore";
import ResponseEmptyMenu from "../Empty/ResponseEmptyMenu";
import ResponseErrorMenu from "../Error/ResponseErrorMenu";
import ResponseMenu from "../Menu/ResponseMenu";

const ResponsePanel = () => {
  const {
    responseData,
    requestInProcess,
    handleResponseData,
    handleRequestProcessStatus,
    handleSidebarCollectionHeaders,
    handleSidebarCollectionClick,
    handleSocketConnection,
  } = useStore(
    useShallow((state) => ({
      responseData: state.responseData,
      requestInProcess: state.requestInProcess,
      handleResponseData: state.handleResponseData,
      handleRequestProcessStatus: state.handleRequestProcessStatus,
      handleSidebarCollectionClick: state.handleSidebarCollectionClick,
      handleSidebarCollectionHeaders: state.handleSidebarCollectionHeaders,
      handleSocketConnection: state.handleSocketConnection,
    })),
  );

  const handleExtensionMessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === "socket-connected") {
      handleSocketConnection(true);
      handleResponseData({
        type: RESPONSE.RESPONSE,
        data: JSON.stringify(
          { message: "Connected to socket", id: payload?.id },
          null,
          2,
        ),
        headers: [],
        headersLength: 0,
        statusCode: 101,
        statusText: "Switching Protocols",
        requestTime: 0,
        responseSize: 0,
      });
      handleRequestProcessStatus(COMMON.FINISHED);
    } else if (type === "socket-disconnected") {
      handleSocketConnection(false);
      handleResponseData({
        type: RESPONSE.RESPONSE,
        data: JSON.stringify({ message: "Disconnected from socket" }, null, 2),
        headers: [],
        headersLength: 0,
        statusCode: 200,
        statusText: "OK",
        requestTime: 0,
        responseSize: 0,
      });
    } else if (type === "socket-event") {
      // Append or show event data
      // For now, just replace response data to show the latest event
      handleResponseData({
        type: RESPONSE.RESPONSE,
        data: JSON.stringify(payload, null, 2),
        headers: [],
        headersLength: 0,
        statusCode: 200,
        statusText: "Event Received",
        requestTime: 0,
        responseSize: 0,
      });
    } else if (type === "socket-error") {
      handleSocketConnection(false);
      handleResponseData({
        type: RESPONSE.ERROR,
        message: payload?.message || "Socket Error",
        data: "",
        headers: [],
        headersLength: 0,
        statusCode: 500,
        statusText: "Error",
        requestTime: 0,
        responseSize: 0,
      });
      handleRequestProcessStatus(RESPONSE.ERROR);
    } else if (event.data.type === RESPONSE.RESPONSE) {
      handleResponseData(event.data);
      handleRequestProcessStatus(COMMON.FINISHED);
    } else if (event.data.type === RESPONSE.ERROR) {
      handleResponseData(event.data);
      handleRequestProcessStatus(RESPONSE.ERROR);
    } else if (event.data.type === RESPONSE.COLLECTION_REQUEST) {
      handleRequestProcessStatus(COMMON.LOADING);
    } else if (event.data.type === RESPONSE.SIDE_BAR_DATA) {
      const {
        keyValueTableData,
        authData,
        authOption,
        requestUrl,
        requestMethod,
        bodyOption,
        bodyRawOption,
      } = event.data;

      handleSidebarCollectionClick({
        authData,
        authOption,
        requestUrl,
        requestMethod,
        bodyOption,
        bodyRawOption,
      });

      handleSidebarCollectionHeaders(keyValueTableData);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);

    return () => {
      window.removeEventListener("message", handleExtensionMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (requestInProcess) {
    case COMMON.LOADING:
      return <Loader />;
    case COMMON.FINISHED:
      return (
        <ResponsePanelWrapper>
          <ResponseMenu />
        </ResponsePanelWrapper>
      );
    case RESPONSE.ERROR:
      return (
        <ResponsePanelWrapper>
          <ResponseErrorMenu {...responseData} />
        </ResponsePanelWrapper>
      );
    default:
      return (
        <ResponsePanelWrapper>
          <ResponseEmptyMenu />
        </ResponsePanelWrapper>
      );
  }
};

const ResponsePanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.1rem 4.5rem 1.5rem 4.5rem;
`;

export default ResponsePanel;
