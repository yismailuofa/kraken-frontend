import { createContext } from "react";
import { createClientWithToken } from "../client";
import { components } from "../client/api";

export type MaybeUser = components["schemas"]["User"] | null;
export type MaybeProject = components["schemas"]["ProjectView"] | null;
export type Task = components["schemas"]["Task"];


interface ApiContextProps {
  client: ReturnType<typeof createClientWithToken>;
  user: MaybeUser;
  project: MaybeProject;
}

export const ApiContext = createContext<ApiContextProps>({
  client: createClientWithToken(null),
  user: null,
  project: null,
});
