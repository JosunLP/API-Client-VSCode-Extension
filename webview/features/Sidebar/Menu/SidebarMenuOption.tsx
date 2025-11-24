import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import InputDialog from "../../../components/InputDialog";
import { REQUEST, SIDEBAR } from "../../../constants";
import { ISidebarSliceList } from "../../../store/slices/type";
import useStore from "../../../store/useStore";
import SidebarCollection from "../Collection/SidebarCollection";
import SidebarFavoritesCollection from "../Collection/SidebarFavoritesCollection";

const SidebarMenuOption = () => {
  const {
    projects,
    userFavorites,
    sidebarOption,
    userRequestHistory,
    handleUserDeleteIcon,
    handleUserFavoriteIcon,
    addCollectionToFavorites,
    removeFromFavoriteCollection,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectCollapse,
    assignToProject,
  } = useStore(
    useShallow((state) => ({
      projects: state.projects,
      sidebarOption: state.sidebarOption,
      userFavorites: state.userFavorites,
      userRequestHistory: state.userRequestHistory,
      handleUserDeleteIcon: state.handleUserDeleteIcon,
      handleUserFavoriteIcon: state.handleUserFavoriteIcon,
      addCollectionToFavorites: state.addCollectionToFavorites,
      removeFromFavoriteCollection: state.removeFromFavoriteCollection,
      addProject: state.addProject,
      updateProject: state.updateProject,
      deleteProject: state.deleteProject,
      toggleProjectCollapse: state.toggleProjectCollapse,
      assignToProject: state.assignToProject,
    })),
  );

  console.log("SidebarMenuOption render", {
    sidebarOption,
    historyCount: userRequestHistory?.length,
    favoritesCount: userFavorites?.length,
  });

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

  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);

  const handleAddProject = () => {
    setShowAddProjectDialog(true);
  };

  const confirmAddProject = (projectName: string) => {
    addProject(projectName);
    // Persist to backend
    vscode.postMessage({
      command: "ADD_PROJECT",
      name: projectName,
    });
    setShowAddProjectDialog(false);
  };

  const handleRenameProject = (id: string, newName: string) => {
    updateProject(id, newName);
    // Persist to backend
    vscode.postMessage({
      command: "UPDATE_PROJECT",
      id,
      name: newName,
    });
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    // Persist to backend
    vscode.postMessage({
      command: "DELETE_PROJECT",
      id,
    });
  };

  const handleToggleProjectCollapse = (id: string) => {
    toggleProjectCollapse(id);
    // Persist to backend
    vscode.postMessage({
      command: "TOGGLE_PROJECT_COLLAPSE",
      id,
    });
  };

  const handleAssignToProject = (favoriteId: string, projectId: string | null) => {
    assignToProject(favoriteId, projectId);
    // Persist to backend
    vscode.postMessage({
      command: "ASSIGN_TO_PROJECT",
      favoriteId,
      projectId,
    });
  };

  switch (sidebarOption) {
    case SIDEBAR.FAVORITES:
      return (
        <>
          {showAddProjectDialog && (
            <InputDialog
              title="Add New Project"
              placeholder="Enter project name"
              onConfirm={confirmAddProject}
              onCancel={() => setShowAddProjectDialog(false)}
            />
          )}
          <SidebarFavoritesCollection
            userFavorites={userFavorites}
            projects={projects}
            onAddProject={handleAddProject}
            onRenameProject={handleRenameProject}
            onDeleteProject={handleDeleteProject}
            onToggleProjectCollapse={handleToggleProjectCollapse}
            onAssignToProject={handleAssignToProject}
            {...sidebarCollectionProps}
          />
        </>
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
