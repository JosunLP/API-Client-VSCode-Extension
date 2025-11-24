import React, { Fragment, MouseEvent } from "react";
import { useShallow } from "zustand/react/shallow";

import DetailOption from "../../../components/DetailOption";
import MenuOption from "../../../components/MenuOption";
import { COMMON, OPTION, REQUEST } from "../../../constants";
import useStore from "../../../store/useStore";
import RequestMenuOption from "./RequestMenuOption";

const RequestMenu = () => {
  const {
    requestOption,
    requestMethod,
    keyValueTableData,
    changeRequestOption,
  } = useStore(
    useShallow((state) => ({
      requestOption: state.requestOption,
      requestMethod: state.requestMethod,
      keyValueTableData: state.keyValueTableData,
      changeRequestOption: state.handleRequestOptionChange,
    })),
  );

  const headersCount = keyValueTableData.filter(
    (data) => data.optionType === COMMON.HEADERS && data.isChecked,
  ).length;

  const handleOptionChange = (event: MouseEvent<HTMLHeadElement>) => {
    const clickedTarget = event.target as HTMLHeadElement;
    const optionText = clickedTarget.innerText;

    if (optionText === "Message") {
      changeRequestOption(COMMON.BODY);
    } else {
      changeRequestOption(optionText);
    }
  };

  const getMenuOptionLabel = (option: string) => {
    if (requestMethod === "WEBSOCKET" && option === COMMON.BODY) {
      return "Message";
    }
    return option;
  };

  return (
    <>
      <DetailOption requestMenu>
        {OPTION.REQUEST_MENU_OPTIONS.map((requestMenuOption, index) => (
          <Fragment key={REQUEST.REQUEST + index}>
            <MenuOption
              currentOption={
                requestOption === COMMON.BODY && requestMethod === "WEBSOCKET"
                  ? "Message"
                  : requestOption
              }
              menuOption={getMenuOptionLabel(requestMenuOption)}
            >
              <h3 onClick={handleOptionChange}>
                {getMenuOptionLabel(requestMenuOption)}
              </h3>
            </MenuOption>
            {requestMenuOption === COMMON.HEADERS && <p>({headersCount})</p>}
          </Fragment>
        ))}
      </DetailOption>
      <RequestMenuOption />
    </>
  );
};

export default RequestMenu;
