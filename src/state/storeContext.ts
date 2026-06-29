import { createContext } from "react";
import type React from "react";
import type { AppAction, AppState } from "./types";

export const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);
