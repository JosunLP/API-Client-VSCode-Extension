import React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import styled from "styled-components";

interface IProjectGroupProps {
  projectId: string;
  projectName: string;
  collapsed: boolean;
  itemCount: number;
  onToggleCollapse: () => void;
  onRename: () => void;
  onDelete: () => void;
}

const ProjectGroup: React.FC<IProjectGroupProps> = ({
  projectName,
  collapsed,
  itemCount,
  onToggleCollapse,
  onRename,
  onDelete,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <ProjectGroupWrapper>
      <ProjectHeader>
        <ProjectTitleSection
          onClick={onToggleCollapse}
          onKeyDown={(e) => handleKeyDown(e, onToggleCollapse)}
          role="button"
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? "Expand" : "Collapse"} project ${projectName}`}
          tabIndex={0}
        >
          {collapsed ? <AiFillFolder /> : <AiFillFolderOpen />}
          <h4>{projectName}</h4>
          <span className="item-count">({itemCount})</span>
        </ProjectTitleSection>
        <ProjectActions>
          <MdEdit
            className="action-icon"
            onClick={onRename}
            onKeyDown={(e) => handleKeyDown(e, onRename)}
            role="button"
            aria-label="Rename project"
            tabIndex={0}
            title="Rename project"
          />
          <FaTrashAlt
            className="action-icon"
            onClick={onDelete}
            onKeyDown={(e) => handleKeyDown(e, onDelete)}
            role="button"
            aria-label="Delete project"
            tabIndex={0}
            title="Delete project"
          />
        </ProjectActions>
      </ProjectHeader>
    </ProjectGroupWrapper>
  );
};

const ProjectGroupWrapper = styled.div`
  margin: 0.5rem 0;
  border-top: 0.1rem solid rgba(255, 255, 255, 0.1);
  padding-top: 0.5rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ProjectTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  cursor: pointer;

  &:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: 2px;
  }

  svg {
    font-size: 1.2rem;
    color: var(--vscode-icon-foreground);
  }

  h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--vscode-foreground);
  }

  .item-count {
    font-size: 0.85rem;
    color: var(--vscode-descriptionForeground);
  }
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${ProjectHeader}:hover & {
    opacity: 1;
  }

  .action-icon {
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--vscode-icon-foreground);
    transition: color 0.2s;

    &:hover {
      color: var(--vscode-foreground);
    }

    &:focus {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 2px;
    }
  }
`;

export default ProjectGroup;
