import React from "react";
import { useShallow } from "zustand/react/shallow";

import InputWrapper from "../../../components/InputWrapper";
import Wrapper from "../../../components/Wrapper";
import { REQUEST } from "../../../constants";
import useStore from "../../../store/useStore";

const RequestAuthBearerToken = () => {
  const { authDataToken, handleRequestAuthData } = useStore(
    useShallow((state) => ({
      authDataToken: state.authData.token,
      handleRequestAuthData: state.handleRequestAuthData,
    })),
  );

  return (
    <Wrapper>
      <InputWrapper>
        <label htmlFor="token">Token:</label>
        <input
          name="token"
          placeholder="token"
          className="authInputBox"
          value={authDataToken}
          onChange={(event) =>
            handleRequestAuthData(REQUEST.TOKEN, event.target.value)
          }
        />
      </InputWrapper>
    </Wrapper>
  );
};

export default RequestAuthBearerToken;
