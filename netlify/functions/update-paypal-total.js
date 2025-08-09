import { supabase } from '../../src/supabaseClient';

export default async function handler(event, context) {
  try {
    // First get current total from PayPal API
    const auth = Buffer.from(`${process.env.VITE_PAYPAL_CLIENT_ID}:${process.env.VITE_PAYPAL_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });
    const { access_token } = await tokenRes.json();

    const now = new Date();
    const start = new Date('2025-03-01T00:00:00-0700');
    const start_date = formatDate(start);
    const end_date = formatDate(now);

    const txnRes = await fetch(`https://api-m.paypal.com/v1/reporting/transactions?start_date=${start_date}&end_date=${end_date}`, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    const data = await txnRes.json();

    let total = 0;
    let lastTransactionDate = null;

    if (data.transaction_details) {
      total = data.transaction_details
        .filter(txn => {
          const amount = parseFloat(txn.transaction_info.transaction_amount.value);
          return amount > 0 && txn.transaction_info.transaction_status === 'S';
        })
        .reduce((sum, txn) => {
          const amount = parseFloat(txn.transaction_info.transaction_amount.value);
          const fee = txn.transaction_info.fee_amount ? parseFloat(txn.transaction_info.fee_amount.value) : 0;
          return sum + (amount + fee);
        }, 0);

      // Find the latest transaction date
      for (const txn of data.transaction_details) {
        if (txn.transaction_info.transaction_status === 'S') {
          const txnDate = new Date(txn.transaction_info.transaction_initiation_date);
          if (!lastTransactionDate || txnDate > lastTransactionDate) {
            lastTransactionDate = txnDate;
          }
        }
      }
    }

    // Update Supabase
    const { error } = await supabase
      .from('paypal_totals')
      .upsert({
        id: 1, // Single row with ID 1
        total: Number(total.toFixed(2)),
        last_transaction_date: lastTransactionDate ? lastTransactionDate.toISOString() : null,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Scheduled function error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function formatDate(date) {
  const pad = n => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}-0700`;
}
