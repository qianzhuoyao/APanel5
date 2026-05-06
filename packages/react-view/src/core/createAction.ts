import { instructions } from "./instructions";

export const createAction = (name: string, callback: () => void) => {
  instructions.register(name, callback);
};
