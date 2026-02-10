
import { NextResponse } from 'next/server';
import { encryptCaptcha } from '@/lib/captcha';

export const dynamic = 'force-dynamic';

function generateMathCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    const operator = Math.random() > 0.5 ? '+' : 'x'; // simple addition or multiplication

    let answer = 0;
    let text = '';

    if (operator === '+') {
        answer = num1 + num2;
        text = `${num1} + ${num2} = ?`;
    } else {
        answer = num1 * num2;
        text = `${num1} x ${num2} = ?`;
    }

    // Create a simple SVG with the text
    // No external fonts required, uses system sans-serif
    const width = 150;
    const height = 50;

    // Randomize colors slightly
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    const color = `rgb(${r},${g},${b})`;

    // Add some noise lines
    let noise = '';
    for (let i = 0; i < 5; i++) {
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = Math.random() * width;
        const y2 = Math.random() * height;
        const stroke = `rgba(${r},${g},${b},0.5)`;
        noise += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1" />`;
    }

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      ${noise}
      <text x="50%" y="50%" font-family="sans-serif" font-size="24" font-weight="bold" fill="${color}" dominant-baseline="middle" text-anchor="middle">${text}</text>
    </svg>
  `.trim();

    return {
        svg,
        text: answer.toString()
    };
}

export async function GET() {
    try {
        const captcha = generateMathCaptcha();
        const token = await encryptCaptcha(captcha.text);

        // Set headers to prevent caching
        const headers = new Headers();
        headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');

        return NextResponse.json({
            svg: captcha.svg,
            token: token
        }, { headers });
    } catch (error) {
        console.error('Error generating captcha:', error);
        return NextResponse.json(
            { error: 'Failed to generate captcha' },
            { status: 500 }
        );
    }
}
