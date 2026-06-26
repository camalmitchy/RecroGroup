export class AuthApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(
    message: string,
    fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "AuthApiError";
    this.fieldErrors = fieldErrors;
  }
}
