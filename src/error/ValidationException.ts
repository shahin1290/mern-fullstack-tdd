export function ValidationException(errors: any[]) {
    this.status = 400;
    this.errors = errors;
    this.message = 'Validation Failure';
}
