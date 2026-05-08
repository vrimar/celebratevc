import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL')!;

const ENTREE_LABELS: Record<string, string> = {
  beef: 'Filetto di Manzo',
  veal: 'Vitello',
  chicken: 'Pollo con Funghi',
  salmon: 'Salmone con Limone',
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let payload: { type: string; record: Record<string, unknown> };

  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const row = payload.record;
  const attending = row.attending as boolean;
  const guestCount = (row.guest_count as number | null) ?? 1;

  const guests = (row.guests as { name: string; entree: string | null; allergies: string | null }[] | null) ?? [];

  const guestRows = attending
    ? Array.from({ length: guestCount }, (_, i) => {
        const guest = guests[i];
        const entreeKey = guest?.entree ?? null;
        const entree = entreeKey ? ENTREE_LABELS[entreeKey] ?? entreeKey : '—';
        const allergy = guest?.allergies || null;
        const guestName = guest?.name || (i === 0 ? (row.full_name as string) : `Guest ${i + 1}`);
        return `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e8ddd3;color:#5a4a3a;">
              ${guestName}
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #e8ddd3;color:#5a4a3a;">${entree}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e8ddd3;color:#5a4a3a;">${allergy ?? '—'}</td>
          </tr>`;
      }).join('')
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf7f4;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #e8ddd3;border-radius:4px;overflow:hidden;">
    <div style="background:#1a0d08;padding:28px 32px;text-align:center;">
      <p style="margin:0;color:#B08D57;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Victoria &amp; Christopher</p>
      <h1 style="margin:8px 0 0;color:#f5e6d3;font-size:22px;font-weight:400;">New RSVP Received</h1>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 12px;background:#faf7f4;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a7a;width:40%;">Name</td>
          <td style="padding:8px 12px;background:#faf7f4;color:#1a0d08;font-size:15px;">${row.full_name}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a7a;">Email</td>
          <td style="padding:8px 12px;color:#1a0d08;font-size:15px;">${row.email}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#faf7f4;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a7a;">Attending</td>
          <td style="padding:8px 12px;background:#faf7f4;font-size:15px;font-weight:bold;color:${attending ? '#2d7a4f' : '#b84040'};">
            ${attending ? '✓ Accepts' : '✗ Declines'}
          </td>
        </tr>
        ${attending ? `
        <tr>
          <td style="padding:8px 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a7a;">Guests</td>
          <td style="padding:8px 12px;color:#1a0d08;font-size:15px;">${guestCount}</td>
        </tr>` : ''}
      </table>

      ${attending ? `
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8a7a;">Entrée Selections</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border:1px solid #e8ddd3;">
        <thead>
          <tr style="background:#faf7f4;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#9a8a7a;font-weight:400;">Guest</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#9a8a7a;font-weight:400;">Entrée</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#9a8a7a;font-weight:400;">Dietary Notes</th>
          </tr>
        </thead>
        <tbody>${guestRows}</tbody>
      </table>` : ''}

      <p style="margin:0;font-size:11px;color:#b0a090;text-align:right;">
        Submitted ${new Date(row.created_at as string).toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  </div>
</body>
</html>`;

  const subject = attending
    ? `✓ RSVP: ${row.full_name} is coming (${guestCount} guest${guestCount > 1 ? 's' : ''})`
    : `✗ RSVP: ${row.full_name} has declined`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'RSVP <rsvp@celebratevc.ca>',
      to: NOTIFY_EMAIL.split(',').map(e => e.trim()),
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return new Response('Failed to send email', { status: 500 });
  }

  return new Response(JSON.stringify({ sent: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
