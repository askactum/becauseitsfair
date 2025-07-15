const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

export default async function handler(event, context) {
  try {
    const auth = Buffer.from(`${process.env.VITE_PAYPAL_CLIENT_ID}:${process.env.VITE_PAYPAL_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });
    const { access_token } = await tokenRes.json();

    let total = 0;
    let lastTransactionDate = null;
    let start = new Date('2025-07-01T00:00:00-0700');
    const now = new Date();
    while (start < now) {
      let end = new Date(start);
      end.setDate(end.getDate() + 30); // 31-day window
      if (end > now) end.setTime(now.getTime());

      const start_date = formatDate(start);
      const end_date = formatDate(end);

      const txnRes = await fetch(`https://api-m.paypal.com/v1/reporting/transactions?start_date=${start_date}&end_date=${end_date}`, {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      const data = await txnRes.json();

      if (data.transaction_details) {
        total += data.transaction_details
          .filter(txn => txn.transaction_info.transaction_status === 'S')
          .reduce((sum, txn) => sum + parseFloat(txn.transaction_info.transaction_amount.value), 0);

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

      // Move start to the next day after end
      start = new Date(end);
      start.setSeconds(start.getSeconds() + 1);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        total,
        last_transaction_date: lastTransactionDate ? lastTransactionDate.toISOString() : null
      })
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}