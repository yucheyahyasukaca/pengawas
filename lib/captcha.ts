import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Gunakan environment variable untuk secret key jika ada, atau generate random untuk fallback
// Note: Jika menggunakan random fallback, captcha akan invalid setiap kali server restart
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || 'fallback-secret-key-change-this-in-env';
const ALGORITHM = 'aes-256-cbc';

// Helper to get a consistent key from the secret
function getKey() {
    return createHash('sha256').update(CAPTCHA_SECRET).digest();
}

export interface CaptchaData {
    text: string;
    expiresAt: number;
}

export async function encryptCaptcha(text: string, expiresInSeconds: number = 300): Promise<string> {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const data: CaptchaData = { text, expiresAt };
    const json = JSON.stringify(data);

    const iv = randomBytes(16);
    const key = getKey();
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(json, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return IV + Encrypted Data
    return `${iv.toString('hex')}:${encrypted}`;
}

export async function verifyCaptcha(token: string, answer: string): Promise<{ valid: boolean; message?: string }> {
    try {
        const [ivHex, encryptedHex] = token.split(':');
        if (!ivHex || !encryptedHex) {
            return { valid: false, message: 'Invalid token format' };
        }

        const iv = Buffer.from(ivHex, 'hex');
        const key = getKey();
        const decipher = createDecipheriv(ALGORITHM, key, iv);

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        const data: CaptchaData = JSON.parse(decrypted);

        // Check expiration
        if (Date.now() > data.expiresAt) {
            return { valid: false, message: 'Captcha expired' };
        }

        // Check answer (case insensitive)
        if (data.text.toLowerCase() !== answer.trim().toLowerCase()) {
            return { valid: false, message: 'Incorrect answer' };
        }

        return { valid: true };
    } catch (error) {
        console.error('Captcha verification error:', error);
        return { valid: false, message: 'Invalid captcha token' };
    }
}
