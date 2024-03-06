import { createContext } from "react";
import { createClientWithToken } from "../client";
import { components } from "../client/api";

export type MaybeUser = components["schemas"]["User"] | null;

interface ApiContextProps {
  client: ReturnType<typeof createClientWithToken>;
  user: MaybeUser;
}

export const ApiContext = createContext<ApiContextProps>({
  client: createClientWithToken(null),
  user: null,
});
