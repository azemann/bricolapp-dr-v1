export type ModuleValidation = {
  ok: boolean;
  errors: { message: string }[];
};

export const getValidationMessages = (validation: ModuleValidation) =>
  validation.errors.map((error) => error.message);
