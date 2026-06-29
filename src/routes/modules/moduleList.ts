export const MODULES = [
  { id: "carrelage", label: "Carrelage" },
  { id: "peinture", label: "Peinture" },
  { id: "placo", label: "Placo" },
  { id: "bardage", label: "Bardage" },
  { id: "plomberie", label: "Plomberie" },
  { id: "electricite", label: "Électricité" },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];
