import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function NoWhitespace(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'noWhitespace',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && !/\s/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not contain whitespace`;
        },
      },
    });
  };
}
