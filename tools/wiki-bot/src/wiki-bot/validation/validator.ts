import { ValidationResult } from './validation-result';

export interface Validator<T extends unknown[]> {
    readonly name: string;
    validate(...args: T): ValidationResult;
}
