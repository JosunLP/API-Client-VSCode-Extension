import React from "react";
import { useShallow } from "zustand/react/shallow";

import { REQUEST, SIDEBAR } from "../../../constants";
import { IEnvironment, ISidebarSliceList } from "../../../store/slices/type";
import useStore from "../../../store/useStore";
import SidebarCollection from "../Collection/SidebarCollection";
import SidebarEnvironment from "../Environment/SidebarEnvironment";

const SidebarMenuOption = () => {
  const {
    userFavorites,
    sidebarOption,
    userEnvironments,
    userRequestHistory,
    handleUserDeleteIcon,
    handleUserFavoriteIcon,
    addCollectionToFavorites,
    removeFromFavoriteCollection,
    updateFavoriteFolder,
  } = useStore(
    useShallow((state) => ({
      sidebarOption: state.sidebarOption,
      userFavorites: state.userFavorites,
      userEnvironments: state.userEnvironments,
      userRequestHistory: state.userRequestHistory,
      handleUserDeleteIcon: state.handleUserDeleteIcon,
      handleUserFavoriteIcon: state.handleUserFavoriteIcon,
      addCollectionToFavorites: state.addCollectionToFavorites,
      removeFromFavoriteCollection: state.removeFromFavoriteCollection,
      updateFavoriteFolder: state.updateFavoriteFolder,
    })),
  );

  console.log("SidebarMenuOption render", {
    sidebarOption,
    historyCount: userRequestHistory?.length,
    favoritesCount: userFavorites?.length,
    environmentsCount: userEnvironments?.length,
  });

  const handleSaveEnvironment = (env: IEnvironment) => {
    vscode.postMessage({
      command: SIDEBAR.SAVE_ENVIRONMENT,
      environment: env,
    });
  };

  const handleDeleteEnvironment = (id: string) => {
    vscode.postMessage({
      command: SIDEBAR.DELETE_ENVIRONMENT,
      id,
    });
  };

  const handleSetActiveEnvironment = (id: string) => {
    vscode.postMessage({
      command: SIDEBAR.SET_ACTIVE_ENVIRONMENT,
      id,
    });
  };

  const sidebarCollectionProps = {
    sidebarOption,
    handleSidebarFavoriteIcon(command: string, id: string) {
      const currentTime = new Date().getTime();

      if (command === SIDEBAR.ADD_TO_FAVORITES) {
        vscode.postMessage({ command, id });

        const selectedCollection = userRequestHistory.filter(
          (collection) => collection.id === id,
        );
        selectedCollection[0].favoritedTime = currentTime;

        handleUserFavoriteIcon(id, currentTime);
        addCollectionToFavorites(selectedCollection);
      } else if (command === SIDEBAR.REMOVE_FROM_FAVORITES) {
        vscode.postMessage({ command, id });

        handleUserFavoriteIcon(id, null);
        removeFromFavoriteCollection(id);
      }
    },
    handleDeleteButton(id: string) {
      switch (sidebarOption) {
        case SIDEBAR.FAVORITES:
          handleUserDeleteIcon(
            SIDEBAR.USER_FAVORITES_COLLECTION as keyof ISidebarSliceList,
            id,
          );
          handleUserFavoriteIcon(id, null);

          return vscode.postMessage({
            command: SIDEBAR.DELETE,
            id,
            target: SIDEBAR.USER_FAVORITES_COLLECTION,
          });
        default:
          handleUserDeleteIcon(
            SIDEBAR.USER_REQUEST_HISTORY_COLLECTION as keyof ISidebarSliceList,
            id,
          );

          return vscode.postMessage({
            command: SIDEBAR.DELETE,
            id,
            target: SIDEBAR.USER_REQUEST_HISTORY_COLLECTION,
          });
      }
    },
    handleDeleteAllButton() {
      switch (sidebarOption) {
        case SIDEBAR.FAVORITES:
          return vscode.postMessage({
            command: SIDEBAR.DELETE_ALL_COLLECTION,
            target: SIDEBAR.USER_FAVORITES_COLLECTION,
          });
        default:
          return vscode.postMessage({
            command: SIDEBAR.DELETE_ALL_COLLECTION,
            target: SIDEBAR.USER_REQUEST_HISTORY_COLLECTION,
          });
      }
    },
    handleUpdateFavoriteFolder(id: string, folder: string) {
      vscode.postMessage({
        command: SIDEBAR.UPDATE_FAVORITE_FOLDER,
        id,
        folder,
      });
      updateFavoriteFolder(id, folder);
    },
    handleUrlClick(id: string) {
      switch (sidebarOption) {
        case SIDEBAR.FAVORITES:
          return vscode.postMessage({
            command: REQUEST.URL_REQUEST,
            id,
            target: SIDEBAR.USER_FAVORITES_COLLECTION,
          });
        default:
          return vscode.postMessage({
            command: REQUEST.URL_REQUEST,
            id,
            target: SIDEBAR.USER_REQUEST_HISTORY_COLLECTION,
          });
      }
    },
  };

  switch (sidebarOption) {
    case SIDEBAR.ENVIRONMENTS:
      return (
        <SidebarEnvironment
          environments={userEnvironments || []}
          handleSaveEnvironment={handleSaveEnvironment}
          handleDeleteEnvironment={handleDeleteEnvironment}
          handleSetActiveEnvironment={handleSetActiveEnvironment}
        />
      );
    case SIDEBAR.FAVORITES:
      return (
        <SidebarCollection
          userCollection={userFavorites}
          {...sidebarCollectionProps}
        />
      );
    default:
      return (
        <SidebarCollection
          userCollection={userRequestHistory}
          {...sidebarCollectionProps}
        />
      );
  }
};

export default SidebarMenuOption;
