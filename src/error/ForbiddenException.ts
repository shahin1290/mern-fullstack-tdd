export function ForbiddenException(message: string) {
    this.status = 403;
    this.message = message || 'authentication_failure';
}
