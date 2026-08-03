# SkyDesk — Air Ticketing Frontend

React (Vite) frontend for the **AirTicketingSystem** API. Covers every endpoint in your
OpenAPI spec: auth + OTP/2FA, flight search & booking, payments (card/bKash/bank transfer),
refunds, and a full admin console (airlines, flights, users, payments, refunds, reports,
settings, audit logs).

Design: a "boarding pass" visual language — navy/amber palette, monospace flight codes,
ticket-stub cards with a perforated edge used throughout for flights and bookings.

## 1. Run it

```bash
cd air-ticketing-frontend
npm install
cp .env.example .env      # then set VITE_API_BASE_URL to your backend URL
npm run dev
```

Open http://localhost:5173. Make sure your FastAPI backend allows CORS from that origin.

## 2. Project structure

```
src/
  api/         one file per resource, thin axios wrappers matching each OpenAPI path
  context/     AuthContext — holds user, tokens, login/logout, isAdmin flag
  components/  Navbar, ProtectedRoute, AdminRoute, FlightCard (ticket UI), Pagination, Loader
  pages/customer/   Home (search), Login, Register, email/login OTP, flight details,
                     booking form, payment, my bookings, profile, notifications
  pages/admin/      dashboard, airlines, flights, users, payments, refunds, reports,
                     settings, audit logs — each with search/filter/pagination
```

Auth tokens are stored in `localStorage` (`access_token`, `refresh_token`, `user`).
Axios automatically attaches the bearer token and refreshes it once on a 401.

---

## 3. আপডেট — এই ৩টা এখন করা হয়েছে ✅

1. **আসল Stripe কার্ড পেমেন্ট (3D-Secure)** — `@stripe/stripe-js` + `@stripe/react-stripe-js` যোগ করা
   হয়েছে। `src/components/CardPaymentForm.jsx` real `CardElement` দেখায় এবং
   `stripe.confirmCardPayment(client_secret)` কল করে। ব্যবহার করতে `.env`-এ
   `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` বসান — Stripe Dashboard → Developers → API keys
   থেকে পাবেন। Key না দিলে ফর্মটি একটা সেটআপ-মেসেজ দেখাবে, ভেঙে পড়বে না।
   Dev-only test-card বাটনটা (`/payments/{id}/confirm-test`) শুধু `npm run dev`-এ দেখা যাবে
   (`import.meta.env.DEV` চেক করে), production build-এ নিজে থেকেই লুকিয়ে যায়।

2. **bKash callback/result page** — `src/pages/customer/PaymentResult.jsx` এবং রুট
   `/payment-result` যোগ করা হয়েছে। এটা query string থেকে `payment_id` (বা `id`) পড়ে
   `getPayment()` দিয়ে backend থেকে canonical status আনে, তারপর success/pending/failed
   অনুযায়ী দেখায়। **অনুমান (backend-এর সাথে কনফার্ম করা দরকার):** আপনার backend-এর
   `/payments/bkash/callback` হ্যান্ডলার bKash approve করার পর ইউজারকে
   `<FRONTEND_URL>/payment-result?payment_id=<id>` — এই প্যাটার্নে redirect করবে। যদি
   backend অন্য param name বা path ব্যবহার করে, `PaymentResult.jsx`-এর
   `paymentId` লাইন আর `App.jsx`-এর রুট বদলে দিন।

3. **Reports/Dashboard চার্ট** — `recharts` যোগ করা হয়েছে। `src/components/ReportCharts.jsx`
   response-এর shape auto-detect করে (প্রথম numeric ফিল্ড → value, প্রথম string/date ফিল্ড →
   label) — তাই backend-এর exact field name না জেনেও কাজ করে। Revenue → line chart,
   bookings-by-status → pie chart, top airlines/routes/users → bar chart। শেপ মিলাতে না
   পারলে (ফাঁকা ডেটা বা অপ্রত্যাশিত shape) আগের টেবিলে fallback করে — কখনো ভেঙে পড়ে না।
   Dashboard-এও `/dashboard/revenue` এখন একটা লাইন চার্ট হিসেবে দেখানো হচ্ছে।
   backend থেকে exact field নাম (`total_revenue`, `date` ইত্যাদি) কনফার্ম হলে auto-detection
   সরিয়ে সরাসরি সেই নাম বসিয়ে আরও নিশ্চিতভাবে রেন্ডার করা যাবে।

## 4. যা যা এখনো বাকি (backend/infra-নির্ভর কাজ)

আমি আপনার OpenAPI স্পেক অনুযায়ী পুরো ফ্রন্টএন্ড বানিয়ে দিয়েছি — সব endpoint কভার করা আছে।
কিন্তু কিছু জিনিস আছে যেগুলো **backend-এর আসল ডেটা/কনফিগ ছাড়া নিশ্চিত করা যায় না**,
সেগুলো এখানে স্পষ্ট করে দিচ্ছি যাতে আপনি নিজে বা অন্য কাউকে দিয়ে ঠিক করিয়ে নিতে পারেন:

1. **Admin role চেনার নিয়ম** — `AuthContext.jsx`-এ আমি ধরে নিয়েছি `role_name` হবে
   `admin` / `staff` / `super_admin`-এর একটা। আপনার backend-এ role-এর আসল নামগুলো যদি
   ভিন্ন হয় (যেমন শুধু `"admin"` বা `"ops"`), তাহলে ওই একটা লাইন বদলে দিতে হবে:
   `src/context/AuthContext.jsx` → `isAdmin` ভ্যারিয়েবল।

2. **Untyped response schema-গুলো** — spec-এ এই endpoint-গুলোর response body
   কোনো নির্দিষ্ট schema ছাড়া (`{}`) দেওয়া আছে:
   `/dashboard/summary`, `/reports/*`, `/notifications/*`, `/audit-logs/*`। এগুলো এখনো
   **defensively** রেন্ডার করা (object হলে key-value grid/auto-detected chart, array হলে
   generic table) — শেপ না মিললে ভেঙে পড়ে না, কিন্তু backend থেকে exact field নাম
   (যেমন `total_revenue`, `date`, `count`) জানালে auto-detection সরিয়ে আরও নিশ্চিতভাবে
   কাস্টমাইজ করে দেওয়া যাবে।

3. **প্রথম Admin ইউজার তৈরি** — `/auth/register` দিয়ে যে কেউ সাইন আপ করলে সাধারণত
   default role (customer) পায়। প্রথম admin ইউজার backend থেকে সরাসরি ডাটাবেসে বা
   কোনো seed script দিয়ে বানাতে হবে — এই ফ্রন্টএন্ডে সেটার কোনো UI নেই (নিরাপত্তার জন্য
   ইচ্ছাকৃতভাবে রাখা হয়নি)।

4. **Deployment** — এই README শুধু local dev-এর জন্য। Production build করতে
   `npm run build` চালিয়ে `dist/` ফোল্ডার যেকোনো static host-এ (Vercel, Netlify,
   Nginx) দিতে হবে, আর `VITE_API_BASE_URL` (ও `VITE_STRIPE_PUBLISHABLE_KEY`) production
   ভ্যালুতে সেট করতে হবে। backend-এ CORS-এ frontend-এর domain allow করতে ভুলবেন না।

5. **Testing** — কোনো automated test (unit/e2e) লেখা হয়নি, শুধু ম্যানুয়াল কোড রিভিউ ও
   `npm run build` দিয়ে ভ্যালিডেট করা হয়েছে (build সফল হয়েছে, কোনো error নেই)।

এই ৫টা পয়েন্ট ছাড়া বাকি সব কিছু — auth flow (register/login/OTP/2FA/refresh),
flight search ও CRUD, booking, cancel, refund request, payment initiation (real Stripe +
bKash সহ), profile, notifications, এবং পুরো admin panel (airlines/flights/users/payments/
refunds/reports+charts/settings/audit-logs, সব pagination+search সহ) — সম্পূর্ণ কাজ করার
মতো করে বানানো এবং build-validated।
