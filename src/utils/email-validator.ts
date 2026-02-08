import validate from 'deep-email-validator';

export interface ValidationResult {
    isValid: boolean;
    reason?: string;
}

export async function validateEmail(email: string, senderEmail: string = 'fabri@launch.clura.dev'): Promise<ValidationResult> {
    if (!email || !email.includes('@')) {
        return { isValid: false, reason: 'malformed_email' };
    }

    try {
        const res = await validate({
            email: email,
            sender: senderEmail,
            validateRegex: true,
            validateMx: true,
            validateTypo: true,
            validateDisposable: true,
            validateSMTP: true, // This is the slow part, but requested
        });

        if (!res.valid) {
            return { isValid: false, reason: res.reason || 'unknown' };
        }

        return { isValid: true };
    } catch (err) {
        console.error(`Validation error for ${email}:`, err);
        // Fail open or closed? 
        // If validation fails due to network, we might skip sending to be safe (fail closed).
        return { isValid: false, reason: 'validation_error' };
    }
}
