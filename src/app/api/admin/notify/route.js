import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId, customerName, total, phoneNumber } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram credentials not found');
      return NextResponse.json({ message: 'Notification skipped' }, { status: 200 });
    }

    const message = `
📦 *New Order Received!*
Order ID: #${orderId}
Customer: ${customerName}
Phone: ${phoneNumber}
Total: ֏${total.toLocaleString()}

Check admin panel for details.
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
