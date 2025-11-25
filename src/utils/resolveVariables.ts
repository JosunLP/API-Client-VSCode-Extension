import { IEnvironmentVariable } from "./type";

export default function resolveVariables(
  text: string,
  variables: IEnvironmentVariable[],
): string {
  if (!text) return text;
  let resolvedText = text;
  variables.forEach((variable) => {
    if (variable.enabled) {
      // Escape regex special characters in the key to avoid unexpected behavior
      const escapedKey = variable.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`{{${escapedKey}}}`, "g");
      resolvedText = resolvedText.replace(regex, variable.value);
    }
  });
  return resolvedText;
}
