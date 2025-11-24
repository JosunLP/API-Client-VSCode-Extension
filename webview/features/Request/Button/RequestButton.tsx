import React from "react";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";

import Button from "../../../components/Button";
import useStore from "../../../store/useStore";

interface RequestButtonProps {
  onDisconnect?: () => void;
}

const RequestButton = ({ onDisconnect }: RequestButtonProps) => {
  const { requestInProcess, requestMethod, socketConnected } = useStore(
    useShallow((state) => ({
      requestInProcess: state.requestInProcess,
      requestMethod: state.requestMethod,
      socketConnected: state.socketConnected,
    })),
  );

  if (["WEBSOCKET"].includes(requestMethod) && socketConnected) {
    return (
      <ButtonGroup>
        <Button
          primary={false}
          buttonType="button"
          buttonStatus={requestInProcess}
          handleButtonClick={onDisconnect}
        >
          Disconnect
        </Button>
        <Button primary buttonType="submit" buttonStatus={requestInProcess}>
          Send
        </Button>
      </ButtonGroup>
    );
  }

  const getButtonText = () => {
    if (["WEBSOCKET"].includes(requestMethod)) {
      return "Connect";
    }
    return "Send";
  };

  return (
    <Button primary buttonType="submit" buttonStatus={requestInProcess}>
      {getButtonText()}
    </Button>
  );
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export default RequestButton;
