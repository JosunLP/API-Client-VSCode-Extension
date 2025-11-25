import React, { useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { IEnvironment, IEnvironmentVariable } from "../../../store/slices/type";

interface ISidebarEnvironmentProps {
  environments: IEnvironment[];
  handleSaveEnvironment: (env: IEnvironment) => void;
  handleDeleteEnvironment: (id: string) => void;
  handleSetActiveEnvironment: (id: string) => void;
}

const SidebarEnvironment = ({
  environments,
  handleSaveEnvironment,
  handleDeleteEnvironment,
  handleSetActiveEnvironment,
}: ISidebarEnvironmentProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editVariables, setEditVariables] = useState<IEnvironmentVariable[]>(
    [],
  );

  const handleAddNew = () => {
    const newEnv: IEnvironment = {
      id: uuidv4(),
      name: "New Environment",
      variables: [],
      isActive: false,
    };
    handleSaveEnvironment(newEnv);
    startEditing(newEnv);
  };

  const startEditing = (env: IEnvironment) => {
    setEditingId(env.id);
    setEditName(env.name);
    setEditVariables(env.variables.map(v => v.id ? v : { ...v, id: uuidv4() }));
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = () => {
    if (editingId) {
      const env = environments.find((e) => e.id === editingId);
      if (env) {
        handleSaveEnvironment({
          ...env,
          name: editName,
          variables: editVariables,
        });
      }
      setEditingId(null);
    }
  };

  const addVariable = () => {
    setEditVariables([...editVariables, { id: uuidv4(), key: "", value: "", enabled: true }]);
  };

  const updateVariable = (
    index: number,
    field: keyof IEnvironmentVariable,
    value: string | boolean,
  ) => {
    const newVars = [...editVariables];
    if (field === "key" || field === "value") {
      newVars[index][field] = value as string;
    } else if (field === "enabled") {
      newVars[index][field] = value as boolean;
    }
    setEditVariables(newVars);
  };

  const removeVariable = (index: number) => {
    const newVars = editVariables.filter((_, i) => i !== index);
    setEditVariables(newVars);
  };

  const toggleActive = (env: IEnvironment) => {
    handleSetActiveEnvironment(env.id);
  };

  return (
    <Container>
      <Header>
        <h3>Environments</h3>
        <FaPlus onClick={handleAddNew} style={{ cursor: "pointer" }} />
      </Header>
      <List>
        {environments.map((env) => (
          <EnvItem key={env.id}>
            {editingId === env.id ? (
              <EditForm>
                <input
                  value={editName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditName(e.target.value)
                  }
                  placeholder="Environment Name"
                />
                <VariablesList>
                  {editVariables.map((v, i) => (
                    <VariableRow key={v.id}>
                      <input
                        value={v.key}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateVariable(i, "key", e.target.value)
                        }
                        placeholder="Key"
                      />
                      <input
                        value={v.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateVariable(i, "value", e.target.value)
                        }
                        placeholder="Value"
                      />
                      <FaTrashAlt onClick={() => removeVariable(i)} />
                    </VariableRow>
                  ))}
                </VariablesList>
                <ButtonRow>
                  <button onClick={addVariable}>Add Var</button>
                  <button onClick={saveEditing} aria-label="Save">
                    <FaSave />
                  </button>
                  <button onClick={cancelEditing} aria-label="Cancel">
                    <FaTimes />
                  </button>
                </ButtonRow>
              </EditForm>
            ) : (
              <ViewMode>
                <NameSection>
                  <input
                    type="checkbox"
                    checked={env.isActive}
                    onChange={() => toggleActive(env)}
                    aria-label="Activate Environment"
                  />
                  <span onClick={() => startEditing(env)}>{env.name}</span>
                </NameSection>
                <Actions>
                  <FaEdit onClick={() => startEditing(env)} />
                  <FaTrashAlt onClick={() => handleDeleteEnvironment(env.id)} />
                </Actions>
              </ViewMode>
            )}
          </EnvItem>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  color: var(--vscode-foreground);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EnvItem = styled.div`
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-input-border);
  padding: 8px;
  border-radius: 4px;
`;

const ViewMode = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameSection = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  cursor: pointer;
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    padding: 4px;
  }
`;

const VariablesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const VariableRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export default SidebarEnvironment;
