import React, { ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";

import Button from "../../../components/Button";
import useStore from "../../../store/useStore";

interface ILoadJSONFileButtonProps {
  optionsType: string;
  replaceValues: boolean;
}

const LoadJSONFileButton = ({
  optionsType,
  replaceValues = false,
}: ILoadJSONFileButtonProps) => {
  const { handleFileUpload } = useStore(
    useShallow((state) => ({ handleFileUpload: state.handleFileUpload })),
  );

  async function loadSettingsFromJSONFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFiles = event.target.files;

    if (!selectedFiles) return;

    const config = await readFileJSON(selectedFiles.item(0));

    handleFileUpload(config, optionsType, replaceValues);
  }

  async function readFileJSON(file: File | null) {
    if (!file) return;

    return JSON.parse(await file.text());
  }

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const fileInput = document.createElement("input");
    const inputAttrs = {
      type: "file",
      accept: ".json",
    };

    for (const attr in inputAttrs) {
      fileInput.setAttribute(
        attr,
        inputAttrs[attr as keyof { type: string; accept: string }],
      );
    }

    const handleChange = (event: Event) => {
      loadSettingsFromJSONFile(
        event as unknown as ChangeEvent<HTMLInputElement>,
      );
    };

    fileInput.addEventListener("change", handleChange);
    fileInputRef.current = fileInput;

    return () => {
      fileInput.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Button
      buttonType="submit"
      primary={false}
      handleButtonClick={() => fileInputRef.current?.click()}
    >
      {replaceValues ? "Set data from file" : "Add data from file"}
    </Button>
  );
};

export default LoadJSONFileButton;
