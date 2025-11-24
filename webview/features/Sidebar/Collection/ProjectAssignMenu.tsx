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
  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    currentProjectId ? projects.findIndex(p => p.id === currentProjectId) + 1 : 0
  );

  const allOptions = [{ id: null, name: "No Project" }, ...projects];

  const handleAssign = (projectId: string | null) => {
    onAssign(projectId);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allOptions.length) % allOptions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = allOptions[selectedIndex];
      handleAssign(option.id);
    } else if (e.key === "Tab") {
      // Focus trap
      e.preventDefault();
      const focusableElements = e.currentTarget.querySelectorAll(
        'button, [role="menuitem"]'
      );
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);
      const nextIndex = e.shiftKey 
        ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
        : (currentIndex + 1) % focusableElements.length;
      (focusableElements[nextIndex] as HTMLElement)?.focus();
    }
  };

  React.useEffect(() => {
    // Focus the selected item when menu opens
    const selectedElement = document.querySelector('[data-selected="true"]') as HTMLElement;
    selectedElement?.focus();
  }, []);

  return (
    <MenuOverlay onClick={onClose}>
      <MenuContent onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <MenuHeader>
          <h4 id="menu-label">Assign to Project</h4>
          <CloseButton onClick={onClose} aria-label="Close menu">✕</CloseButton>
        </MenuHeader>
        <MenuBody role="menu" aria-labelledby="menu-label">
          {allOptions.map((option, index) => {
            const isSelected = option.id === currentProjectId;
            const isFocused = index === selectedIndex;
            return (
              <MenuItem
                key={option.id || "none"}
                onClick={() => handleAssign(option.id)}
                onMouseEnter={() => setSelectedIndex(index)}
                $isSelected={isSelected}
                $isFocused={isFocused}
                role="menuitem"
                tabIndex={isFocused ? 0 : -1}
                aria-selected={isSelected}
                data-selected={isFocused}
              >
                <span>{option.name}</span>
                {isSelected && <CheckMark>✓</CheckMark>}
              </MenuItem>
            );
          })}
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

const MenuItem = styled.div<{ $isSelected: boolean; $isFocused: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  cursor: pointer;
  background-color: ${(props) => {
    if (props.$isFocused) return "var(--vscode-list-hoverBackground)";
    if (props.$isSelected) return "var(--vscode-list-activeSelectionBackground)";
    return "transparent";
  }};
  color: ${(props) =>
    props.$isSelected
      ? "var(--vscode-list-activeSelectionForeground)"
      : "var(--vscode-foreground)"};
  transition: background-color 0.2s;
  outline: ${(props) =>
    props.$isFocused ? "1px solid var(--vscode-focusBorder)" : "none"};
  outline-offset: -1px;

  &:hover {
    background-color: var(--vscode-list-hoverBackground);
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
