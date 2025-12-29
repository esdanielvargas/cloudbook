export const formatLink = (link) => {
    return link
      .replace(/^https?:\/\//, "")
      .replace(/\?.*$/, "")
      .replace(/\/$/, "");
  };