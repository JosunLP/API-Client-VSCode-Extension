import React from "react";
import { useShallow } from "zustand/react/shallow";

import InputWrapper from "../../../components/InputWrapper";
import Wrapper from "../../../components/Wrapper";
import { REQUEST } from "../../../constants";
import useStore from "../../../store/useStore";

const RequestBasicAuth = () => {
  const {
    authData,
    shouldShowPassword,
    handleRequestAuthData,
    handleShouldShowPassword,
  } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      shouldShowPassword: state.shouldShowPassword,
      handleRequestAuthData: state.handleRequestAuthData,
      handleShouldShowPassword: state.handleShouldShowPassword,
    })),
  );

  return (
    <Wrapper>
      <InputWrapper>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="authInputBox"
          value={authData.username}
          onChange={(event) =>
            handleRequestAuthData(REQUEST.USERNAME, event.target.value)
          }
        />
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="password">Password:</label>
        <input
          type={shouldShowPassword ? "text" : "password"}
          name="password"
          placeholder="password"
          className="authInputBox"
          value={authData.password}
          onChange={(event) =>
            handleRequestAuthData(REQUEST.PASSWORD, event.target.value)
          }
        />
      </InputWrapper>
      <InputWrapper>
        <input
          type="checkbox"
          checked={shouldShowPassword}
          onChange={handleShouldShowPassword}
          title="Show Password"
        />
        <label>Show Password</label>
      </InputWrapper>
    </Wrapper>
  );
};

export default RequestBasicAuth;
