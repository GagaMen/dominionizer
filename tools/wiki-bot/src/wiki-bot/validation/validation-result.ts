export class ValidationResult {
    static readonly Success: ValidationResult = new ValidationResult();

    static Failure(failureMessage: string): ValidationResult {
        return new ValidationResult(failureMessage);
    }

    private constructor(readonly failureMessage?: string) {}
}
