import React, { useMemo, useState } from "react";
import { FaFolder, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";

import ConfirmDialog from "../../../components/ConfirmDialog";
import Information from "../../../components/Information";
import MoreInformation from "../../../components/MoreInformation";
import { IProject, IUserRequestSidebarState } from "../../../store/slices/type";
import { calculateCollectionTime, generateMethodColor } from "../../../utils";
import SidebarDeleteAllButton from "../Button/SidebarDeleteAllButton";
import SibebarEmptyCollectionMenu from "../Menu/SidebarEmptyCollectionMenu";
import EmptySearchResultMessage from "../Message/EmptySearchResultMessage";
import ProjectAssignMenu from "./ProjectAssignMenu";
import ProjectGroup from "./ProjectGroup";

interface ISidebarFavoritesCollectionProps {
  sidebarOption: string | null;
  userFavorites: IUserRequestSidebarState[];
  projects: IProject[];
  handleUrlClick: (id: string) => void;
  handleDeleteButton: (id: string) => void;
  handleDeleteAllButton: () => void;
  handleSidebarFavoriteIcon?: (stringValue: string, id: string) => void;
  onAddProject: () => void;
  onRenameProject: (id: string, newName: string) => void;
  onDeleteProject: (id: string) => void;
  onToggleProjectCollapse: (id: string) => void;
  onAssignToProject: (favoriteId: string, projectId: string | null) => void;
}

const SidebarFavoritesCollection: React.FC<ISidebarFavoritesCollectionProps> = ({
  sidebarOption,
  userFavorites,
  projects,
  handleUrlClick,
  handleDeleteButton,
  handleDeleteAllButton,
  onAddProject,
  onRenameProject,
  onDeleteProject,
  onToggleProjectCollapse,
  onAssignToProject,
}) => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [assigningFavoriteId, setAssigningFavoriteId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Group favorites by project - memoized for performance
  const { groupedFavorites, ungroupedFavorites, filteredFavoritesCount } = useMemo(() => {
    const grouped: Record<string, IUserRequestSidebarState[]> = {};
    const ungrouped: IUserRequestSidebarState[] = [];

    userFavorites
      .filter((favorite) =>
        favorite.url.toLowerCase().includes(searchInputValue.toLowerCase())
      )
      .forEach((favorite) => {
        if (favorite.projectId) {
          if (!grouped[favorite.projectId]) {
            grouped[favorite.projectId] = [];
          }
          grouped[favorite.projectId].push(favorite);
        } else {
          ungrouped.push(favorite);
        }
      });

    const count = Object.values(grouped).reduce((sum, items) => sum + items.length, 0) + ungrouped.length;

    return {
      groupedFavorites: grouped,
      ungroupedFavorites: ungrouped,
      filteredFavoritesCount: count,
    };
  }, [userFavorites, searchInputValue]);

  const handleRenameProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setRenamingProjectId(projectId);
      setNewProjectName(project.name);
    }
  };

  const confirmRenameProject = () => {
    if (renamingProjectId && newProjectName.trim()) {
      onRenameProject(renamingProjectId, newProjectName.trim());
      setRenamingProjectId(null);
      setNewProjectName("");
    }
  };

  const cancelRenameProject = () => {
    setRenamingProjectId(null);
    setNewProjectName("");
  };

  const renderFavoriteItem = (favorite: IUserRequestSidebarState) => {
    const methodColor = generateMethodColor(favorite.method.toLowerCase());
    const favoriteListedTime = calculateCollectionTime(favorite.favoritedTime || 0);

    return (
      <HistoryListWrapper key={favorite.id}>
        <Information textColor={methodColor}>
          <div className="methodContainer">
            <h4>{favorite.method}</h4>
          </div>
          <div>
            <p onClick={() => handleUrlClick(favorite.id)}>{favorite.url}</p>
          </div>
        </Information>
        <MoreInformation>
          <div>
            <p>Added {favoriteListedTime}</p>
          </div>
          <div role="iconWrapper">
            <FaFolder
              className="sidebarIcon"
              onClick={() => setAssigningFavoriteId(favorite.id)}
              title="Assign to project"
            />
            <FaTrashAlt
              className="sidebarIcon"
              onClick={() => handleDeleteButton(favorite.id)}
              data-testid="delete-button"
            />
          </div>
        </MoreInformation>
      </HistoryListWrapper>
    );
  };

  const deletingProject = projects.find((p) => p.id === deletingProjectId);

  return (
    <>
      {assigningFavoriteId && (
        <ProjectAssignMenu
          projects={projects}
          currentProjectId={
            userFavorites.find((f) => f.id === assigningFavoriteId)?.projectId
          }
          onAssign={(projectId) => {
            onAssignToProject(assigningFavoriteId, projectId);
            setAssigningFavoriteId(null);
          }}
          onClose={() => setAssigningFavoriteId(null)}
        />
      )}
      {deletingProjectId && deletingProject && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete the project "${deletingProject.name}"? Favorites in this project will be moved to ungrouped.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => {
            onDeleteProject(deletingProjectId);
            setDeletingProjectId(null);
          }}
          onCancel={() => setDeletingProjectId(null)}
        />
      )}
      {userFavorites?.length ? (
        <UtilitySectionWrapper>
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchInputValue}
            onChange={(event) => setSearchInputValue(event.target.value)}
          />
          <AddProjectButton onClick={onAddProject}>+ Add Project</AddProjectButton>
        </UtilitySectionWrapper>
      ) : null}
      <CollectionWrapper>
        {userFavorites?.length ? (
          filteredFavoritesCount !== 0 ? (
            <>
              <SidebarDeleteAllButton clickHandler={handleDeleteAllButton} />
              <CollectionDetailWrapper>
                {/* Render projects with their favorites */}
                {projects.map((project) => {
                  const projectFavorites = groupedFavorites[project.id] || [];
                  if (projectFavorites.length === 0) return null;

                  return (
                    <div key={project.id}>
                      {renamingProjectId === project.id ? (
                        <RenameProjectWrapper>
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmRenameProject();
                              if (e.key === "Escape") cancelRenameProject();
                            }}
                            autoFocus
                            aria-label="Project name"
                          />
                          <button onClick={confirmRenameProject} aria-label="Confirm rename">✓</button>
                          <button onClick={cancelRenameProject} aria-label="Cancel rename">✗</button>
                        </RenameProjectWrapper>
                      ) : (
                        <ProjectGroup
                          projectId={project.id}
                          projectName={project.name}
                          collapsed={project.collapsed || false}
                          itemCount={projectFavorites.length}
                          onToggleCollapse={() => onToggleProjectCollapse(project.id)}
                          onRename={() => handleRenameProject(project.id)}
                          onDelete={() => setDeletingProjectId(project.id)}
                        />
                      )}
                      {!project.collapsed && (
                        <ProjectItemsWrapper>
                          {projectFavorites.map((favorite) => renderFavoriteItem(favorite))}
                        </ProjectItemsWrapper>
                      )}
                    </div>
                  );
                })}

                {/* Render ungrouped favorites */}
                {ungroupedFavorites.length > 0 && (
                  <>
                    {projects.length > 0 && (
                      <UngroupedHeader>
                        <h4>Ungrouped</h4>
                      </UngroupedHeader>
                    )}
                    {ungroupedFavorites.map((favorite) => renderFavoriteItem(favorite))}
                  </>
                )}
              </CollectionDetailWrapper>
            </>
          ) : (
            <EmptySearchResultMessage value={searchInputValue} />
          )
        ) : (
          <SibebarEmptyCollectionMenu currentSidebarOption={sidebarOption} />
        )}
      </CollectionWrapper>
    </>
  );
};

const CollectionWrapper = styled.div`
  width: 100%;
`;

const CollectionDetailWrapper = styled.div`
  overflow-y: scroll;
  height: 62vh;
`;

const UtilitySectionWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  input {
    flex: 1;
    padding: 0.4rem 0.6rem;
    border-radius: 0.35rem;
    color: var(--default-text);
    opacity: 0.78;
  }
`;

const AddProjectButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.35rem;
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;

  &:hover {
    background-color: var(--vscode-button-hoverBackground);
  }
`;

const HistoryListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.35rem 0.15rem 0.5rem 0;
  padding: 0.55rem 0.1rem 0 0.25rem;
  border-bottom: 0.07rem solid #404040;
  overflow: hidden;

  p {
    font-size: 0.92rem;
  }
`;

const ProjectItemsWrapper = styled.div`
  padding-left: 1rem;
  border-left: 0.15rem solid rgba(255, 255, 255, 0.1);
  margin-left: 0.5rem;
`;

const UngroupedHeader = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  border-top: 0.1rem solid rgba(255, 255, 255, 0.1);

  h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
  }
`;

const RenameProjectWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  align-items: center;

  input {
    flex: 1;
    padding: 0.3rem 0.5rem;
    border-radius: 0.25rem;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
  }

  button {
    padding: 0.3rem 0.6rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);

    &:hover {
      background-color: var(--vscode-button-hoverBackground);
    }
  }
`;

export default SidebarFavoritesCollection;
