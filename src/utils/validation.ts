import { REGEX_PATTERNS, VALIDATION_RULES } from '@/constants/validation';


export function isValidEmail(email: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(email);
}


export function isValidGitHubUrl(url: string): boolean {
  return REGEX_PATTERNS.GITHUB_URL.test(url);
}


export function isValidGitHubToken(token: string): boolean {
  return REGEX_PATTERNS.GITHUB_TOKEN.test(token);
}


export function isValidUrl(url: string): boolean {
  return REGEX_PATTERNS.URL.test(url);
}


export function isAlphanumeric(str: string): boolean {
  return REGEX_PATTERNS.ALPHANUMERIC.test(str);
}

export function isAlphanumericWithDashes(str: string): boolean {
  return REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES.test(str);
}


export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`);
  }

  if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
    errors.push(`Password must be less than ${VALIDATION_RULES.MAX_PASSWORD_LENGTH} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


export function validateProjectName(name: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (name.length < VALIDATION_RULES.MIN_PROJECT_NAME_LENGTH) {
    errors.push(`Project name must be at least ${VALIDATION_RULES.MIN_PROJECT_NAME_LENGTH} character`);
  }

  if (name.length > VALIDATION_RULES.MAX_PROJECT_NAME_LENGTH) {
    errors.push(`Project name must be less than ${VALIDATION_RULES.MAX_PROJECT_NAME_LENGTH} characters`);
  }

  if (!isAlphanumericWithDashes(name)) {
    errors.push('Project name can only contain letters, numbers, and dashes');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


export function validateCommitMessage(message: string): boolean {
  return message.length <= VALIDATION_RULES.MAX_COMMIT_MESSAGE_LENGTH;
}


export function validatePullRequestTitle(title: string): boolean {
  return title.length <= VALIDATION_RULES.MAX_PULL_REQUEST_TITLE_LENGTH;
}


export function validatePullRequestBody(body: string): boolean {
  return body.length <= VALIDATION_RULES.MAX_PULL_REQUEST_BODY_LENGTH;
} 