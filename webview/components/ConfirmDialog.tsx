import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface IConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the confirm button when dialog opens
    confirmButtonRef.current?.focus();
  }, []);

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
      return;
    }

    // Trap Tab key within dialog
    if (e.key === "Tab") {
      const focusableElements = e.currentTarget.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <DialogContent onClick={(e) => e.stopPropagation()} onKeyDown={handleDialogKeyDown}>
        <DialogHeader>
          <h4 id="dialog-title">{title}</h4>
          <CloseButton onClick={onCancel} aria-label="Close dialog">
            ✕
          </CloseButton>
        </DialogHeader>
        <DialogBody>
          <p>{message}</p>
        </DialogBody>
        <DialogFooter>
          <Button type="button" onClick={onCancel} $secondary>
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            $danger={variant === "danger"}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Overlay>
  );
};

const Overlay = styled.div`
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

const DialogContent = styled.div`
  background-color: var(--vscode-menu-background);
  border: 1px solid var(--vscode-menu-border);
  border-radius: 0.5rem;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const DialogHeader = styled.div`
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

const DialogBody = styled.div`
  padding: 1rem;

  p {
    margin: 0;
    color: var(--vscode-foreground);
    line-height: 1.5;
  }
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--vscode-menu-separatorBackground);
`;

const Button = styled.button<{ $secondary?: boolean; $danger?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s;
  background-color: ${(props) => {
    if (props.$danger) return "var(--vscode-errorForeground, #f44336)";
    if (props.$secondary) return "var(--vscode-button-secondaryBackground)";
    return "var(--vscode-button-background)";
  }};
  color: ${(props) =>
    props.$secondary
      ? "var(--vscode-button-secondaryForeground)"
      : "var(--vscode-button-foreground)"};

  &:hover {
    opacity: 0.9;
  }
`;

export default ConfirmDialog;
