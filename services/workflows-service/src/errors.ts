import * as common from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorObject } from 'ajv';
import startCase from 'lodash/startCase';
import lowerCase from 'lodash/lowerCase';
import { ZodError } from 'zod';
import { ValidationError as ClassValidatorValidationError } from 'class-validator';

export class ForbiddenException extends common.ForbiddenException {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  timestamp!: string;

  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.message = message;
  }
}

export class NotFoundException extends common.NotFoundException {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  timestamp!: string;

  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.message = message;
  }
}

export class SessionExpiredException extends common.UnauthorizedException {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  timestamp!: string;

  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.message = message;
  }
}

class DetailedValidationError {
  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;
}

export const exceptionValidationFactory = (errors: ClassValidatorValidationError[]) => {
  return ValidationError.fromClassValidator(errors);
};

export class ValidationError extends common.BadRequestException {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  static message = 'Validation error';

  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  timestamp!: string;

  @ApiProperty({ type: DetailedValidationError })
  errors?: Array<{ message: string; path: string }>;

  constructor(errors: Array<{ message: string; path: string }>) {
    super(
      {
        statusCode: common.HttpStatus.BAD_REQUEST,
        message: ValidationError.message,
        errors,
      },
      'Validation error',
    );
  }

  getErrors() {
    return (this.getResponse() as ValidationError).errors;
  }

  static fromAjvError(error: Array<ErrorObject<string, Record<string, any>, unknown>>) {
    const errors = error.map(({ instancePath, message }) => ({
      message: `${startCase(lowerCase(instancePath)).replace('/', '.')} ${message}.`,
      path: instancePath,
    }));

    return new ValidationError(errors);
  }

  static fromZodError(error: ZodError) {
    const errors = error.errors.map(zodIssue => ({
      message: zodIssue.message,
      path: zodIssue.path.join('.'), // Backwards compatibility - Legacy code message excepts array
    }));

    return new ValidationError(errors);
  }

  static fromClassValidator(error: ClassValidatorValidationError[]) {
    const flattenedErrors = flattenValidationErrors(error);

    return new ValidationError(
      flattenedErrors.map(({ property, constraints = {} }) => ({
        message: `${Object.values(constraints).join(', ')}.`,
        path: property,
      })),
    );
  }
}

const flattenValidationErrors = (
  errors: ClassValidatorValidationError[],
): ClassValidatorValidationError[] => {
  const flattenedErrors: ClassValidatorValidationError[] = [];

  for (const error of errors) {
    flattenedErrors.push(error);

    if (error.children) {
      for (const child of error.children) {
        flattenedErrors.push(...flattenValidationErrors([child]));
      }
    }
  }

  return flattenedErrors;
};
