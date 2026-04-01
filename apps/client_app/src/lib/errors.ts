export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }

  static assert(error: unknown): error is InvalidCredentialsError {
    return error instanceof InvalidCredentialsError;
  }
}

export class SignupError extends Error {
  constructor(message = 'Failed to create account. Please try again.') {
    super(message);
    this.name = 'SignupError';
  }

  static assert(error: unknown): error is SignupError {
    return error instanceof SignupError;
  }
}
