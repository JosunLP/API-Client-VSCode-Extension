import React from "react";
import { shallow } from "zustand/shallow";

import Button from "../../../components/Button";
import useStore from "../../../store/useStore";

const RequestButton = () => {
  const { requestInProcess, requestMethod, socketConnected } = useStore(
    (state) => ({
      requestInProcess: state.requestInProcess,
      requestMethod: state.requestMethod,
      socketConnected: state.socketConnected,
    }),
    shallow,
  );

  const getButtonText = () => {
    if (["SOCKET", "WEBSOCKET", "SERIAL"].includes(requestMethod)) {
      return socketConnected ? "Disconnect" : "Connect";
    }
    return "Send";
  };

  return (
    <Button primary buttonType="submit" buttonStatus={requestInProcess}>
      {getButtonText()}
    </Button>
  );
};

export default RequestButton;
