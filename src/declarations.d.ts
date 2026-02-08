declare module 'deep-email-validator' {
    interface ValidateOptions {
        email: string;
        sender?: string;
        validateRegex?: boolean;
        validateMx?: boolean;
        validateTypo?: boolean;
        validateDisposable?: boolean;
        validateSMTP?: boolean;
    }

    interface ValidateResult {
        valid: boolean;
        reason?: string;
        validators: {
            [key: string]: {
                valid: boolean;
                reason?: string;
            };
        };
    }

    export default function validate(options: ValidateOptions | string): Promise<ValidateResult>;
}
