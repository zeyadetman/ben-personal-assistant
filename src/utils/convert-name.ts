export const convertTitleToFileName = (title: string) => {
  return title.replace(/ /g, "-").toLowerCase();
};
