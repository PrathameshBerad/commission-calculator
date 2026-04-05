# 🚀 START HERE — Beginner's Guide to Running CommCalc

> **No developer experience needed.** Follow every step exactly and you'll have CommCalc live on the internet in under 30 minutes.

---

## 📋 What You'll Accomplish

By the end of this guide you will have:
- ✅ CommCalc running on your computer
- ✅ Code pushed to GitHub
- ✅ A live public URL (free, via Vercel)

---

## STEP 1 — Install Required Software

You need three things installed before anything else.

### 1A. Install Node.js

Node.js is what runs the app on your computer.

1. Go to: **https://nodejs.org**
2. Click the big green **"LTS"** button (the recommended version)
3. Download and run the installer
4. Click **Next** through all screens, keep all defaults
5. Click **Finish**

**Verify it worked:** Open a terminal (see below) and type:
```
node --version
```
You should see something like: `v20.11.0`

> **How to open a terminal:**
> - **Windows:** Press `Win + R`, type `cmd`, press Enter
> - **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter

---

### 1B. Install Git

Git is what saves and uploads your code.

1. Go to: **https://git-scm.com/downloads**
2. Click your operating system (Windows / Mac)
3. Download and run the installer
4. Keep ALL default settings — just click Next and Finish

**Verify it worked:**
```
git --version
```
You should see: `git version 2.xx.x`

---

### 1C. Install VS Code (Code Editor)

VS Code is where you can view and edit the code.

1. Go to: **https://code.visualstudio.com**
2. Click the big **Download** button
3. Install it (keep all defaults)

**Recommended VS Code Extensions** (install these inside VS Code):
- Open VS Code → Click the 4-squares icon on the left sidebar
- Search and install each:
  - `ESLint`
  - `Prettier - Code formatter`
  - `Tailwind CSS IntelliSense`
  - `TypeScript Hero`

---

## STEP 2 — Get the Project on Your Computer

### Option A: You Already Downloaded the Files

If you received this project as a ZIP file or folder:

1. Unzip it if needed
2. Open VS Code
3. Go to **File → Open Folder**
4. Select the `commission-calculator` folder
5. Click **Open**

### Option B: Clone from GitHub (if uploaded)

If the code is on GitHub:
```bash
git clone https://github.com/YOURUSERNAME/commission-calculator.git
cd commission-calculator
```

---

## STEP 3 — Install Dependencies & Run

This is where you install all the libraries the project needs.

### 3A. Open Terminal Inside VS Code

In VS Code, go to: **Terminal → New Terminal**

A terminal panel will appear at the bottom of VS Code.

### 3B. Make Sure You're in the Right Folder

Type this and press Enter:
```bash
pwd
```
The output should end with `/commission-calculator`.

If not, navigate there:
```bash
cd commission-calculator
```

### 3C. Install All Dependencies

```bash
npm install
```

> ⏳ This will take 1-3 minutes. You'll see a lot of text scrolling — that's normal!
> 
> If you see `npm warn` messages — that's fine, ignore them.
> 
> If you see `npm error` — check that Node.js was installed correctly (Step 1A).

### 3D. Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Ready in 2.1s
```

### 3E. Open the App

Open your web browser and go to:
```
http://localhost:3000
```

🎉 **CommCalc is now running on your computer!**

> **To stop the server:** Press `Ctrl + C` in the terminal

---

## STEP 4 — Set Up GitHub (Save Your Code Online)

GitHub stores your code safely online and is needed to deploy.

### 4A. Create a GitHub Account

1. Go to: **https://github.com**
2. Click **Sign up**
3. Enter your email, create a password, choose a username
4. Verify your email address

### 4B. Configure Git with Your Details

In your terminal, type these two commands (replace with your actual info):
```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

### 4C. Create a New GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `commission-calculator`
3. Keep it **Public**
4. **Do NOT** check "Add a README" (we already have one)
5. Click **Create repository**

### 4D. Push Your Code to GitHub

Back in your VS Code terminal, run these commands **one by one**:

```bash
git init
```
```bash
git add .
```
```bash
git commit -m "Initial commit: CommCalc v1.0"
```
```bash
git branch -M main
```
```bash
git remote add origin https://github.com/YOURUSERNAME/commission-calculator.git
```
```bash
git push -u origin main
```

> **Replace `YOURUSERNAME`** with your actual GitHub username!

When prompted for username/password:
- Username: your GitHub username
- Password: use a **Personal Access Token** (not your password)

**Create a token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token**
3. Note: "CommCalc deploy"
4. Check: `repo` scope
5. Click **Generate token**
6. Copy the token and use it as your password

✅ Your code is now on GitHub!

---

## STEP 5 — Deploy to Vercel (Go Live!)

Vercel hosts your Next.js app for free.

### 5A. Create a Vercel Account

1. Go to: **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub

### 5B. Import Your Project

1. On the Vercel dashboard, click **"Add New... → Project"**
2. Find `commission-calculator` in the list
3. Click **Import**

### 5C. Configure (Keep All Defaults!)

Vercel auto-detects Next.js. You don't need to change anything:
- Framework Preset: **Next.js** ✅ (auto-detected)
- Root Directory: `./` ✅
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅

Click **Deploy**

### 5D. Wait for Deployment

⏳ Deployment takes 1-3 minutes. You'll see a build log.

When it's done, you'll see: **"Congratulations! Your project has been successfully deployed."**

---

## STEP 6 — Go Live! 🎉

### Your Live URL

Vercel gives you a free URL like:
```
https://commission-calculator-abc123.vercel.app
```

Click it — your CommCalc is live on the internet!

### Share It

Copy your URL and share it with anyone. It works on all devices — phone, tablet, desktop.

---

## Optional: Add a Custom Domain

If you want `www.mysite.com` instead of the Vercel URL:

1. Buy a domain at: **https://namecheap.com** or **https://godaddy.com**
2. In Vercel dashboard → Your project → **Settings → Domains**
3. Click **Add Domain**
4. Type your domain name
5. Follow Vercel's DNS instructions (update records at your domain registrar)
6. Wait up to 48 hours for DNS to propagate

---

## 🔄 Making Changes & Redeploying

After you edit any file:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel will **automatically redeploy** every time you push to GitHub! 

---

## ❓ Troubleshooting

### "npm not found" or "node not found"
→ Node.js wasn't installed properly. Restart your computer and try again.

### "Cannot find module" error
→ Run `npm install` again.

### Port 3000 already in use
→ Run: `npm run dev -- -p 3001` (uses port 3001 instead)

### Build fails on Vercel
→ Check the build log for red text. Common fix: run `npm run build` locally first and fix any errors.

### White screen / blank page
→ Open browser DevTools (F12) → Console tab → Look for red errors.

---

## 📞 Need Help?

- 📖 Next.js docs: https://nextjs.org/docs
- 📖 Vercel docs: https://vercel.com/docs
- 📖 Tailwind docs: https://tailwindcss.com/docs
- 🐛 Report issues: GitHub → Issues → New Issue

---

**You did it! CommCalc is live. 🚀**
