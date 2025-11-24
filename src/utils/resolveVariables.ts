import { IEnvironmentVariable } from "./type";

export default function resolveVariables(
  text: string,
  variables: IEnvironmentVariable[],
): string {
  if (!text) return text;
  let resolvedText = text;
  variables.forEach((variable) => {
    if (variable.enabled) {
      const regex = new RegExp(`{{${variable.key}}}`, "g");
      resolvedText = resolvedText.replace(regex, variable.value);
    }
  });
  return resolvedText;
}
