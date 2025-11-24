import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface IInputDialogProps {
  title: string;
  placeholder?: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const InputDialog: React.FC<IInputDialogProps> = ({
  title,
  placeholder,
  initialValue = "",
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when dialog opens
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <h4 id="dialog-title">{title}</h4>
          <CloseButton onClick={onCancel} aria-label="Close dialog">
            ✕
          </CloseButton>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              aria-label={placeholder || "Input"}
            />
          </DialogBody>
          <DialogFooter>
            <Button type="button" onClick={onCancel} $secondary>
              Cancel
            </Button>
            <Button type="submit" disabled={!value.trim()}>
              OK
            </Button>
          </DialogFooter>
        </form>
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
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vscode-input-border);
  border-radius: 0.25rem;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-size: 0.9rem;
  font-family: inherit;

  &:focus {
    outline: 1px solid var(--vscode-focusBorder);
  }

  &::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--vscode-menu-separatorBackground);
`;

const Button = styled.button<{ $secondary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s;
  background-color: ${(props) =>
    props.$secondary
      ? "var(--vscode-button-secondaryBackground)"
      : "var(--vscode-button-background)"};
  color: ${(props) =>
    props.$secondary
      ? "var(--vscode-button-secondaryForeground)"
      : "var(--vscode-button-foreground)"};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$secondary
        ? "var(--vscode-button-secondaryHoverBackground)"
        : "var(--vscode-button-hoverBackground)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default InputDialog;
