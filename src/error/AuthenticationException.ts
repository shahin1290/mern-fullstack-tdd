export function AuthenticationException(message?: string) {
    this.status = 401;
    this.message = message || 'Authentication Failure';
}
