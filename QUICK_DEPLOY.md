# ⚡ Quick Railway Deployment Guide

## 🎯 One-Click Deploy (If Available)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?template=https://github.com/mesh057/MESH-TECH-MD-BOT)

## 📋 Manual Deployment (5 Minutes)

### Step 1: Go to Railway
- Visit https://railway.app
- Sign in with GitHub

### Step 2: Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Search for `MESH-TECH-MD-BOT`
- Click deploy
- ⏳ Wait for build (2-3 minutes)

### Step 3: Add Volumes (CRITICAL!)
In Railway Dashboard:
1. Click your bot service
2. Go to **Settings** tab
3. Scroll to **Volumes**
4. Add Volume 1:
   - Mount Path: `/app/sessions`
   - Size: `1 GB`
5. Add Volume 2:
   - Mount Path: `/app/data`
   - Size: `1 GB`

### Step 4: Set Variables
In **Variables** tab, add:

```
OWNER_NUMBER = 254700000000
```

Replace with your WhatsApp number (country code + number, no + sign)

### Step 5: Get Pairing Link
- Go to **Settings** → **Networking**
- Copy the public URL (e.g., `your-bot-production.up.railway.app`)

### Step 6: Pair Your Bot
1. Open the URL in browser
2. Enter your WhatsApp number
3. Get pairing code
4. Go to WhatsApp → Settings → Linked Devices → Link with phone number
5. Enter the code
6. ✅ Bot is paired!

### Step 7: Test
Send these commands in WhatsApp:
- `.ping` - Should show latency (e.g., `<1ms`)
- `.menu` - Should show all commands
- `.alive` - Should confirm bot is online

## ✅ Verification Checklist

- [ ] Repository deployed
- [ ] Build completed successfully
- [ ] Volumes added (`/app/sessions` and `/app/data`)
- [ ] `OWNER_NUMBER` variable set
- [ ] Public URL generated
- [ ] Bot paired successfully
- [ ] `.ping` command shows latency
- [ ] `.menu` command works
- [ ] Bot persists after restart

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot offline | Check volumes exist, restart service |
| Duplicate responses | Pull latest code, restart |
| No latency shown | Update code from GitHub, restart |
| Re-pairing needed | Verify `/app/sessions` volume exists |
| Build fails | Check logs, ensure Node 20+ |

## 📞 Support

- GitHub Issues: https://github.com/mesh057/MESH-TECH-MD-BOT/issues
- Railway Docs: https://docs.railway.app

---

**Deployment Time**: ~5 minutes ⏱️
**Status**: Ready to Deploy ✅
