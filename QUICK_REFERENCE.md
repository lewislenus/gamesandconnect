# 🚀 DCM Payment - Quick Reference Card

## 📌 Essential Commands

### Deploy Edge Functions
```bash
supabase functions deploy pay --no-verify-jwt
supabase functions deploy verify-payment --no-verify-jwt
```

### Set Environment Secrets
```bash
supabase secrets set DCM_PARTNER_CODE=testDCM
supabase secrets set DCM_COLLECTION_URL=https://dcmapitest.dcm-gh.com/Transaction/Collection
supabase secrets set DCM_NAME_ENQUIRY_URL=https://dcmapisandbox.dcm-gh.com/Transaction/NameEnquiry
```

### Push Database Changes
```bash
supabase db push
```

### View Function Logs
```bash
supabase functions logs pay
supabase functions logs verify-payment
```

---

## 🔗 Important URLs

### Development
- **Checkout Page:** `http://localhost:5173/checkout/:eventId`
- **Local Supabase Studio:** `http://127.0.0.1:54323`
- **Edge Functions:** `http://127.0.0.1:54321/functions/v1/`

### Production  
- **Checkout Page:** `https://yoursite.com/checkout/:eventId`
- **Supabase Project:** `https://fxqzihpsasuerpfjzwfr.supabase.co`

---

## 💻 Code Snippets

### Navigate to Checkout
```tsx
navigate(`/checkout/${eventId}`)
```

### With Registration Data
```tsx
navigate(`/checkout/${eventId}`, {
  state: {
    registrationId: registration.id,
    name: registration.name,
    email: registration.email,
    phone: registration.phone
  }
});
```

### Check Payment Status
```tsx
const { data } = await supabase
  .from('payments')
  .select('*')
  .eq('transaction_id', transactionId)
  .single();
```

### Format Phone Number
```typescript
let phone = phoneNumber.replace(/\s/g, '');
if (phone.startsWith('0')) {
  phone = '233' + phone.substring(1);
}
```

---

## 🏦 Bank Codes

| Provider | Code |
|----------|------|
| MTN Mobile Money | 300592 |
| Vodafone Cash | 300591 |
| AirtelTigo Money | 300593 |

---

## 📊 Useful SQL Queries

### Recent Payments
```sql
SELECT * FROM payments 
ORDER BY created_at DESC 
LIMIT 10;
```

### Failed Payments
```sql
SELECT * FROM payments 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

### Payment Summary
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(amount) as total
FROM payments
GROUP BY status;
```

### Payments by Event
```sql
SELECT * FROM payment_statistics;
```

---

## ⚡ Payment Status Flow

```
pending → processing → completed ✅
                    → failed ❌
```

---

## 🧪 Test Data (Sandbox)

- **Test Phone:** `233244000000`
- **Test PIN:** `0000`
- **Test Amount:** `1.00` (minimum)

---

## 🚨 Quick Troubleshooting

### Payment not initiating?
1. Check DCM credentials
2. Verify phone format (233XXXXXXXXX)
3. Check Edge Function logs

### Payment stuck in processing?
1. Wait 30 seconds
2. Check user's phone for prompt
3. Manually verify transaction

### User not receiving prompt?
1. Verify phone number
2. Check mobile network
3. Ensure sufficient balance

---

## 📞 Support Contacts

- **DCM Support:** support@dcm-gh.com
- **Tech Issues:** Check `DCM_PAYMENT_SETUP.md`

---

## 🔐 Security Reminders

⚠️ Never commit `.env` files  
⚠️ Use environment variables for credentials  
⚠️ Rotate keys regularly  
⚠️ Monitor payment logs  
⚠️ Test in sandbox before production  

---

## 📁 File Locations

```
├── supabase/
│   ├── functions/
│   │   ├── pay/index.ts
│   │   └── verify-payment/index.ts
│   └── migrations/
│       └── 20251027202553_create_payments_table.sql
├── src/
│   ├── pages/
│   │   └── Checkout.tsx
│   └── App.tsx
├── DCM_PAYMENT_SETUP.md
├── INTEGRATION_GUIDE.md
└── PAYMENT_IMPLEMENTATION_SUMMARY.md
```

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0

**Keep this handy! 📌**

