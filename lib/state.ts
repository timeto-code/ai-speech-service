let globalState = {} as Record<string, any>;

export const getState = (key: string) => globalState[key];
export const setState = (key: string, value: any) => {
  globalState[key] = value;
};
