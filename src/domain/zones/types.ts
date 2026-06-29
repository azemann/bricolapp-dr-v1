import type { OuvrageInstance } from "../ouvrages/types";

export type Zone = {
  id: string;
  projectId: string;
  label: string;
  description?: string;
  ouvrages: OuvrageInstance[];
};
