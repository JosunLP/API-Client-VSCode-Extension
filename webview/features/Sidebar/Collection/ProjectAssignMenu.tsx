import React from "react";
import styled from "styled-components";

import { IProject } from "../../../store/slices/type";

interface IProjectAssignMenuProps {
  projects: IProject[];
  currentProjectId?: string;
  onAssign: (projectId: string | null) => void;
  onClose: () => void;
}

const ProjectAssignMenu: React.FC<IProjectAssignMenuProps> = ({
  projects,
  currentProjectId,
  onAssign,
  onClose,
}) => {
  const handleAssign = (projectId: string | null) => {
    onAssign(projectId);
    onClose();
  };

  return (
    <MenuOverlay onClick={onClose}>
      <MenuContent onClick={(e) => e.stopPropagation()}>
        <MenuHeader>
          <h4>Assign to Project</h4>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </MenuHeader>
        <MenuBody>
          <MenuItem
            onClick={() => handleAssign(null)}
            $isSelected={!currentProjectId}
          >
            <span>No Project</span>
            {!currentProjectId && <CheckMark>✓</CheckMark>}
          </MenuItem>
          {projects.map((project) => (
            <MenuItem
              key={project.id}
              onClick={() => handleAssign(project.id)}
              $isSelected={currentProjectId === project.id}
            >
              <span>{project.name}</span>
              {currentProjectId === project.id && <CheckMark>✓</CheckMark>}
            </MenuItem>
          ))}
        </MenuBody>
      </MenuContent>
    </MenuOverlay>
  );
};

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const MenuContent = styled.div`
  background-color: var(--vscode-menu-background);
  border: 1px solid var(--vscode-menu-border);
  border-radius: 0.5rem;
  min-width: 250px;
  max-width: 400px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vscode-menu-separatorBackground);

  h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--vscode-foreground);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const MenuBody = styled.div`
  overflow-y: auto;
  padding: 0.5rem 0;
`;

const MenuItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected
      ? "var(--vscode-list-activeSelectionBackground)"
      : "transparent"};
  color: ${(props) =>
    props.$isSelected
      ? "var(--vscode-list-activeSelectionForeground)"
      : "var(--vscode-foreground)"};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$isSelected
        ? "var(--vscode-list-activeSelectionBackground)"
        : "var(--vscode-list-hoverBackground)"};
  }

  span {
    font-size: 0.9rem;
  }
`;

const CheckMark = styled.span`
  color: var(--vscode-list-activeSelectionForeground);
  font-weight: bold;
`;

export default ProjectAssignMenu;
