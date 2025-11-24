import React from "react";
import styled from "styled-components";

import RequestPanel from "../features/Request/Panel/RequestPanel";
import ResizeBar from "../features/ResizeBar/ResizeBar";
import ResponsePanel from "../features/Response/Panel/ResponsePanel";

const MainPage = () => {
  return (
    <MainContainer>
      <RequestPanel />
      <ResizeBar />
      <ResponsePanel />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export default MainPage;
