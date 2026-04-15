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
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1D3557, #141414); padding: 32px 32px 28px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .header span { color: #D9483E; }
        .header p { color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 32px; }
        .greeting { font-size: 16px; color: #141414; margin-bottom: 24px; }
        .card { background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #efefef; }
        .card-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #efefef; }
        .card-row:last-child { border-bottom: none; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; }
        .value { font-size: 14px; font-weight: 600; color: #141414; text-align: right; max-width: 60%; }
        .fare-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding: 16px; background: #1D3557; border-radius: 10px; }
        .fare-label { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        .fare-value { color: #D9483E; font-size: 24px; font-weight: 800; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: #e6f4ea; color: #2e7d32; }
        .footer { text-align: center; padding: 24px 32px; border-top: 1px solid #efefef; color: #aaa; font-size: 12px; }
        .footer strong { color: #141414; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span>Go</span>Stret 🥎</h1>
          <p>Your ride receipt</p>
        </div>
        <div class="body">
          <p class="greeting">Hi <strong>${name}</strong>, thanks for riding with GoStret! Here's your trip summary.</p>

          <div class="card">
            <div class="card-row">
              <span class="label">Date</span>
              <span class="value">${rideDate}</span>
            </div>
            <div class="card-row">
              <span class="label">Status</span>
              <span class="value"><span class="status-pill">${ride.status}</span></span>
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

          <div class="fare-row">
            <span class="fare-label">Total Fare</span>
            <span class="fare-value">PGK ${ride.fare}</span>
          </div>
        </div>
        <div class="footer">
          <strong>GoStret Ride-Sharing</strong><br />
          Papua New Guinea · support@gostret.com.pg<br /><br />
          This is an automated receipt. Please do not reply to this email.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `GoStret 🥎 <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [to],
      subject: `Your GoStret Receipt – PGK ${ride.fare}`,
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
