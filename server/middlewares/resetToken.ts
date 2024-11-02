import crypto from 'crypto';

// Generate a random reset token
export const generateResetToken = () => {
    const resetToken:number = crypto.randomInt(10000, 99999);

    const passwordResetToken = crypto.createHash('sha256')
                                        .update(resetToken.toString())
                                        .digest('hex');

    const passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;

    return { resetToken, passwordResetToken, passwordResetExpiresAt };
};