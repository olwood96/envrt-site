// Run this with: node scripts/get-resend-audience-id.js YOUR_RESEND_API_KEY
// Or set RESEND_API_KEY as an environment variable first

const key = process.argv[2] || process.env.RESEND_API_KEY;

if (!key) {
  console.log("Usage: node scripts/get-resend-audience-id.js re_YOUR_API_KEY");
  process.exit(1);
}

fetch("https://api.resend.com/audiences", {
  headers: { Authorization: `Bearer ${key}` },
})
  .then((r) => r.json())
  .then((res) => {
    if (!res.data || res.data.length === 0) {
      console.log("No audiences found. Create one at https://resend.com/audience");
      return;
    }
    console.log("\nYour Resend audiences:\n");
    res.data.forEach((a) => {
      console.log(`  Name: ${a.name}`);
      console.log(`  ID:   ${a.id}`);
      console.log();
    });
    console.log("Add this to your Vercel env vars:");
    console.log(`  RESEND_NEWSLETTER_AUDIENCE_ID=${res.data[0].id}`);
  })
  .catch((err) => console.error("Error:", err.message));
