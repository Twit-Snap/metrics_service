export class ValidationError extends Error {
  field: string;
  detail: string;
  type: string;

  constructor(field: string, detail: string, type: string) {
    super(`Validation error: ${field}`);
    this.field = field;
    this.detail = detail;
    this.name = 'ValidationError';
    this.type = type;
  }

}