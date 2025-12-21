export const joinPath = (base: string, path: string) => {
  if (!base.endsWith("/") && !path.startsWith("/")) {
    return `${base}/${path}`;
  }
  if (base.endsWith("/") && path.startsWith("/")) {
    return `${base}${path.slice(1)}`;
  }
  return `${base}${path}`;
};

export const sleep = (ms: number) => {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

