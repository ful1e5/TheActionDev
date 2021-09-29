export const parseAsArray = (input: string): string[] => {
  return input
    .split(",")
    .map(t => decodeURIComponent(t.trim()))
    .filter(t => t !== "");
};
