import React, { MouseEvent, useEffect } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";

import MenuOption from "../../../components/MenuOption";
import SelectWrapper from "../../../components/SelectWrapper";
import { OPTION, SIDEBAR } from "../../../constants";
import useStore from "../../../store/useStore";
import SidebarMenuOption from "./SidebarMenuOption";

type OnClickCallback = (event: MouseEvent<HTMLHeadingElement>) => void;

const SidebarMenu = () => {
  const {
    sidebarOption,
    deleteCollection,
    handleSidebarOption,
    resetFavoriteIconState,
    handleUserHistoryCollection,
    handleUserFavoritesCollection,
    handleProjects,
  } = useStore(
    useShallow((state) => ({
      sidebarOption: state.sidebarOption,
      deleteCollection: state.deleteCollection,
      handleSidebarOption: state.handleSidebarOption,
      resetFavoriteIconState: state.resetFavoriteIconState,
      handleUserHistoryCollection: state.handleUserHistoryCollection,
      handleUserFavoritesCollection: state.handleUserFavoritesCollection,
      handleProjects: state.handleProjects,
    })),
  );

  const handleHeadingTextClick: OnClickCallback = (
    event: MouseEvent<HTMLHeadingElement>,
  ) => {
    const clickedHeading = event.currentTarget;

    handleSidebarOption(clickedHeading.innerText);
  };

  useEffect(() => {
    console.log("SidebarMenu mounted and setting up message listener");
    const handleMessage = (message: MessageEvent) => {
      const { messageCategory, history, favorites, projects, target } = message.data;

      if (messageCategory === SIDEBAR.COLLECTION_DATA) {
        console.log("SidebarMenu received collection data", {
          history,
          favorites,
          projects,
        });
        if (history?.userRequestHistory) {
          handleUserHistoryCollection(history.userRequestHistory);
        }
        if (favorites?.userRequestHistory) {
          handleUserFavoritesCollection(favorites.userRequestHistory);
        }
        if (projects?.userRequestHistory) {
          handleProjects(projects.userRequestHistory);
        }
      } else if (messageCategory === SIDEBAR.DELETE_COMPLETE) {
        deleteCollection(target);
        resetFavoriteIconState();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <SidebarMenuWrapper>
        <SelectWrapper secondary>
          {OPTION.SIDEBAR_MENU_OPTIONS.map((option, index) => (
            <MenuOption
              key={index}
              currentOption={sidebarOption}
              menuOption={option}
            >
              <h3 onClick={handleHeadingTextClick}>{option}</h3>
            </MenuOption>
          ))}
        </SelectWrapper>
      </SidebarMenuWrapper>
      <SidebarMenuOption />
    </>
  );
};

const SidebarMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  padding-bottom: 0.7rem;
  border-bottom: 0.07rem dashed #404040;

  h3 {
    font-size: 1.25rem;
    font-weight: 200;
  }
`;

export default SidebarMenu;
