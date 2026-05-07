import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: {
    recaptchaToken: string;
    full_name: string;
    email: string;
    attending: boolean;
    guest_count: number | null;
    guests: { name: string; entree: string | null; allergies: string | null }[] | null;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { recaptchaToken, ...rsvpData } = body;

  // Verify reCAPTCHA token with Google
  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: recaptchaToken,
    }),
  });

  const verifyData = await verifyRes.json();
  console.log('reCAPTCHA verify response:', JSON.stringify(verifyData));

  if (!verifyData.success || verifyData.score < 0.5) {
    return new Response(JSON.stringify({
      error: 'reCAPTCHA verification failed',
      detail: verifyData['error-codes'] ?? null,
      score: verifyData.score ?? null,
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Insert using service role key (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { error } = await supabase.from('rsvps').insert(rsvpData);

  if (error) {
    console.error('Supabase insert error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to save RSVP' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
