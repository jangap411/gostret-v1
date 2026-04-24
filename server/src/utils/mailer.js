import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a GoStret ride receipt email to the user using Resend.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Recipient name
 * @param {Object} options.ride - The ride object from the database
 */
export const sendReceiptEmail = async ({ to, name, ride }) => {
  const rideDate = new Date(ride.created_at).toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; background: #131313; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #1C1B1B; border-radius: 24px; overflow: hidden; color: #E5E2E1; }
        .header { background: #1C1B1B; padding: 40px 32px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .header h1 { margin: 0; color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -1.5px; }
        .header span { color: #46F1C5; }
        .header p { color: #85948D; margin: 8px 0 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; }
        .body { padding: 40px 32px; }
        .greeting { font-size: 16px; color: #ffffff; margin-bottom: 32px; font-weight: 600; }
        .card { background: #201F1F; border-radius: 20px; padding: 28px; margin-bottom: 32px; }
        .card-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .card-row:last-child { border-bottom: none; }
        .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #85948D; }
        .value { font-size: 14px; font-weight: 700; color: #ffffff; text-align: right; max-width: 65%; }
        .fare-box { background: #46F1C5; border-radius: 16px; padding: 24px; text-align: center; margin-top: 40px; }
        .fare-label { color: #131313; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.7; }
        .fare-value { color: #131313; font-size: 32px; font-weight: 900; margin-top: 4px; display: block; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(70,241,197,0.1); color: #46F1C5; border: 1px solid rgba(70,241,197,0.2); }
        .footer { text-align: center; padding: 32px; background: rgba(0,0,0,0.2); color: #85948D; font-size: 11px; font-weight: 600; line-height: 1.6; }
        .footer strong { color: #ffffff; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span>Go</span>Stret</h1>
          <p>Electronic Receipt</p>
        </div>
        <div class="body">
          <p class="greeting">Hi ${name}, thank you for choosing GoStret.</p>

          <div class="card">
            <div class="card-row">
              <span class="label">Trip Date</span>
              <span class="value">${rideDate}</span>
            </div>
            <div class="card-row">
              <span class="label">Status</span>
              <span class="value"><span class="status-pill">${ride.status.replace('_', ' ')}</span></span>
            </div>
            <div class="card-row">
              <span class="label">Pickup</span>
              <span class="value">${ride.pickup_address}</span>
            </div>
            <div class="card-row">
              <span class="label">Destination</span>
              <span class="value">${ride.destination_address}</span>
            </div>
            ${ride.distance ? `<div class="card-row"><span class="label">Distance</span><span class="value">${ride.distance}</span></div>` : ''}
            ${ride.duration ? `<div class="card-row"><span class="label">Duration</span><span class="value">${ride.duration}</span></div>` : ''}
          </div>

          <div class="fare-box">
            <span class="fare-label">Total Amount</span>
            <span class="fare-value">PGK ${ride.fare}</span>
          </div>
        </div>
        <div class="footer">
          <strong>GoStret Papua New Guinea</strong><br />
          Modern Mobility for a Connected Nation<br />
          support@gostret.com.pg
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `GoStret <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [to],
      subject: `GoStret Receipt – PGK ${ride.fare}`,
      html,
    });

    if (error) {
      console.error('Error sending receipt email with Resend:', error);
      console.log(error)
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error sending receipt email:', err);
    return { success: false, error: err };
  }
};
