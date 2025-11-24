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
  return (
    <ProjectGroupWrapper>
      <ProjectHeader>
        <ProjectTitleSection onClick={onToggleCollapse}>
          {collapsed ? <AiFillFolder /> : <AiFillFolderOpen />}
          <h4>{projectName}</h4>
          <span className="item-count">({itemCount})</span>
        </ProjectTitleSection>
        <ProjectActions>
          <MdEdit className="action-icon" onClick={onRename} title="Rename project" />
          <FaTrashAlt className="action-icon" onClick={onDelete} title="Delete project" />
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
  }
`;

export default ProjectGroup;
