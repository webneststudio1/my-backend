# 🚀 WebNestStudio Backend — Step-by-Step Deployment Guide

> **Total time:** ~20 minutes | **Cost:** FREE (Render free tier)

---

## What You Have

| File | Purpose |
|------|---------|
| `server.js` | The backend server code |
| `package.json` | Lists the packages the server needs |
| `.env.example` | Template for your secret settings |
| `contact-form-snippet.html` | Copy-paste this into your website |

---

## STEP 1 — Install Node.js on your computer

1. Go to **https://nodejs.org**
2. Download the **LTS version** (the green button)
3. Install it (just click Next → Next → Finish)
4. To verify: open your **Terminal** (Mac) or **Command Prompt** (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.11.0`

---

## STEP 2 — Set up Gmail App Password

> This lets the server send emails FROM your Gmail without using your real password.

1. Go to **https://myaccount.google.com**
2. Click **Security** in the left sidebar
3. Scroll to **"2-Step Verification"** → Turn it **ON** (if not already)
4. Go back to Security → scroll down → click **"App Passwords"**
5. Under "Select app" choose **Mail**
6. Under "Select device" choose **Other (Custom name)**
7. Type `WebNestStudio` and click **Generate**
8. **Copy the 16-character password shown** (looks like: `abcd efgh ijkl mnop`)
9. Save it somewhere safe — you'll need it in Step 4

---

## STEP 3 — Upload the backend to GitHub

> Render deploys from GitHub, so we need to put the code there first.

1. Go to **https://github.com** and create a free account (if you don't have one)
2. Click the **+** icon → **New repository**
3. Name it: `webneststudio-backend`
4. Keep it **Private** (important — don't make it public)
5. Click **Create repository**
6. On your computer, open Terminal/Command Prompt and run these commands:

```bash
# Navigate to the backend folder (adjust path as needed)
cd path/to/webneststudio-backend

# Initialize git
git init

# Add all files EXCEPT .env (we never upload secrets)
echo ".env" > .gitignore
echo "node_modules" >> .gitignore

git add .
git commit -m "Initial backend setup"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/webneststudio-backend.git
git push -u origin main
```

---

## STEP 4 — Deploy on Render (FREE)

1. Go to **https://render.com** and sign up (use your GitHub account)
2. Click **New +** → **Web Service**
3. Connect your GitHub account → select `webneststudio-backend`
4. Fill in the settings:
   - **Name:** `webneststudio-backend`
   - **Region:** Singapore (closest to India)
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
5. Scroll down to **Environment Variables** → click **Add Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `GMAIL_USER` | your-gmail@gmail.com |
   | `GMAIL_PASS` | the 16-char app password from Step 2 |
   | `COMPANY_EMAIL` | email where you want to receive inquiries |

6. Click **Create Web Service**
7. Wait 2–3 minutes for it to deploy
8. You'll get a URL like: `https://webneststudio-backend.onrender.com`
9. Open that URL in your browser — you should see: `✅ WebNestStudio backend is running!`

---

## STEP 5 — Connect your website form

1. Open `contact-form-snippet.html` (provided in this folder)
2. Find this line at the top of the `<script>` section:
   ```javascript
   const BACKEND_URL = "https://YOUR_BACKEND_URL.onrender.com";
   ```
3. Replace `YOUR_BACKEND_URL` with your actual Render URL from Step 4
4. Copy the entire `<form>` and `<script>` block into your website's HTML file where your contact section is
5. Style the form to match your website's design (add your existing CSS classes)

---

## STEP 6 — Test it!

1. Go to your website and fill out the contact form
2. Click Submit
3. You should see a green success message on the form
4. Check your inbox — you should get a nicely formatted email with the details
5. The person who submitted should also get an auto-reply from you!

---

## ⚠️ Important Notes

- **Free tier goes to sleep** after 15 minutes of no traffic on Render. The first request after sleeping may take 30–50 seconds. To avoid this, upgrade to the $7/month plan later.
- **Never share your `.env` file** or upload it to GitHub. It contains your passwords.
- The `.gitignore` file makes sure `.env` is never accidentally uploaded.

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| "Gmail authentication failed" | Double-check your App Password. Make sure 2-Step Verification is ON. |
| Form shows "Could not connect" | Make sure the `BACKEND_URL` in your HTML matches your Render URL exactly |
| Emails going to spam | Ask clients to check their spam folder; add your email to contacts |
| Render shows "Deploy failed" | Check the Logs tab in Render for error details |

---

## 📞 Need Help?

If you get stuck at any step, just ask! The most common issue is the Gmail App Password setup.
