# Railway Setup Guide: Step-by-Step with Variable Examples

This guide shows you exactly how to set up your bot on Railway, including all variables and volumes.

---

## Step 1: Connect Your Repository to Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Search for and select **mesh057/MESH-TECH-MD-BOT**
5. Railway will automatically start building your bot

**Wait for the build to complete** (you'll see a green checkmark).

---

## Step 2: Add Persistent Volumes (Critical!)

### Why Volumes Matter
Without volumes, your WhatsApp session credentials are lost every time the bot restarts. You'll have to re-pair constantly.

### Adding Volume 1: `/app/sessions`

1. Open your **MESH-TECH-MD-BOT** service in Railway
2. Click the **Settings** tab (gear icon)
3. Scroll down to **Volumes**
4. Click the **+ Add Volume** button
5. Fill in:
   - **Mount Path**: `/app/sessions`
   - **Size**: `1 GB`
6. Click **Create**

**Screenshot Reference:**
```
┌─────────────────────────────────────────┐
│ Settings                                │
├─────────────────────────────────────────┤
│ Volumes                                 │
│ ┌─────────────────────────────────────┐ │
│ │ + Add Volume                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Mount Path: /app/sessions               │
│ Size: 1 GB                              │
│                                         │
│ [Create]                                │
└─────────────────────────────────────────┘
```

### Adding Volume 2: `/app/data`

1. Click **+ Add Volume** again
2. Fill in:
   - **Mount Path**: `/app/data`
   - **Size**: `1 GB`
3. Click **Create**

**After both volumes are added, you should see:**
```
Volumes:
✓ /app/sessions (1 GB)
✓ /app/data (1 GB)
```

---

## Step 3: Add Environment Variables

### Where to Find Variables Tab
1. Open your **MESH-TECH-MD-BOT** service
2. Click the **Variables** tab (next to Settings)
3. You'll see an input field that says **"Add a new variable"**

### Variable 1: OWNER_NUMBER (Required)

**This is your WhatsApp number.**

1. Click **+ New Variable**
2. In the **Key** field, type: `OWNER_NUMBER`
3. In the **Value** field, type your number with country code (e.g., `254700000000`)
   - **Format**: Country code + your number, NO `+` sign, NO spaces
   - **Examples**:
     - Kenya: `254700000000`
     - Nigeria: `2348012345678`
     - USA: `12015550123`
     - UK: `442071838750`
4. Click **Add**

**Screenshot Reference:**
```
┌─────────────────────────────────────────┐
│ Variables                               │
├─────────────────────────────────────────┤
│ Key: OWNER_NUMBER                       │
│ Value: 254700000000                     │
│                                         │
│ [Add]                                   │
└─────────────────────────────────────────┘
```

### Variable 2: MONITOR_URL (Optional)

**This links your bot to the monitoring dashboard.**

1. Click **+ New Variable**
2. In the **Key** field, type: `MONITOR_URL`
3. In the **Value** field, type your monitor URL (e.g., `https://mesh-tech-md-monitor.up.railway.app`)
   - **Important**: NO trailing slash at the end!
   - **Correct**: `https://mesh-tech-md-monitor.up.railway.app`
   - **Incorrect**: `https://mesh-tech-md-monitor.up.railway.app/`
4. Click **Add**

**Screenshot Reference:**
```
┌─────────────────────────────────────────┐
│ Variables                               │
├─────────────────────────────────────────┤
│ Key: MONITOR_URL                        │
│ Value: https://mesh-tech-md-monitor... │
│        .up.railway.app                  │
│                                         │
│ [Add]                                   │
└─────────────────────────────────────────┘
```

### Variable 3: ADMIN_PASSWORD (Optional)

**This is the password to log into your monitor dashboard.**

1. Click **+ New Variable**
2. In the **Key** field, type: `ADMIN_PASSWORD`
3. In the **Value** field, type a strong password (e.g., `MeshTech2026`)
   - Use a combination of letters, numbers, and symbols
   - Make it at least 8 characters long
4. Click **Add**

**Screenshot Reference:**
```
┌─────────────────────────────────────────┐
│ Variables                               │
├─────────────────────────────────────────┤
│ Key: ADMIN_PASSWORD                     │
│ Value: MeshTech2026                     │
│                                         │
│ [Add]                                   │
└─────────────────────────────────────────┘
```

---

## Step 4: Verify All Variables Are Set

After adding all variables, you should see:

```
Variables:
✓ OWNER_NUMBER = 254700000000
✓ MONITOR_URL = https://mesh-tech-md-monitor.up.railway.app
✓ ADMIN_PASSWORD = MeshTech2026
```

---

## Step 5: Get Your Bot's Public URL

1. Open your **MESH-TECH-MD-BOT** service
2. Click the **Settings** tab
3. Scroll to **Networking** or **Public Networking**
4. Look for a link that says **"Generate Domain"** or shows a URL like `mesh-tech-md-bot-production.up.railway.app`
5. **Copy this URL** — this is your bot's pairing site

**Screenshot Reference:**
```
┌─────────────────────────────────────────┐
│ Settings → Networking                   │
├─────────────────────────────────────────┤
│ Public URL:                             │
│ mesh-tech-md-bot-production.up.railway  │
│ .app                                    │
│                                         │
│ [Copy]                                  │
└─────────────────────────────────────────┘
```

---

## Step 6: Pair Your Bot

1. Open your bot's public URL in a browser (from Step 5)
2. You'll see a **QR Code** or a form asking for your WhatsApp number
3. If it's a QR code:
   - Open WhatsApp on your phone
   - Go to **Settings → Linked Devices → Link with phone number**
   - Scan the QR code
4. If it's a form:
   - Enter your WhatsApp number (the same one you put in `OWNER_NUMBER`)
   - Click **Get Pairing Code**
   - On your phone, go to **Settings → Linked Devices → Link with phone number**
   - Enter the code shown on the dashboard
5. **Wait for the status to turn green** — your bot is now paired!

---

## Step 7: Test Your Bot

1. Open WhatsApp on your phone
2. Send a message to your bot: `.menu`
3. The bot should respond with a menu of all available commands
4. If it responds, **your bot is working!** ✅

---

## Step 8: Verify Credential Persistence

This is the most important test to ensure your bot survives restarts.

1. **Send a command**: Type `.ping` in WhatsApp
2. **Restart the service**:
   - Go to Railway
   - Click the **⋮** (three dots) on your service
   - Select **Restart**
   - Wait 30-60 seconds
3. **Send another command**: Type `.ping` again
4. **If the bot responds without re-pairing, you're done!** ✅

---

## Complete Variable Reference

Copy and paste this when setting up:

```
OWNER_NUMBER = 254700000000

MONITOR_URL = https://mesh-tech-md-monitor.up.railway.app

ADMIN_PASSWORD = MeshTech2026
```

Replace the values with your own!

---

## Troubleshooting

### "Bot is offline"
- Check if volumes are mounted (Settings → Volumes)
- Restart the service
- Check logs for errors (Deployments → View Logs)

### "Please re-pair your bot"
- Verify `/app/sessions` volume exists
- Restart the service
- Re-pair using the pairing site

### "Monitor not showing data"
- Verify `MONITOR_URL` has no trailing slash
- Check if monitor service is online
- Monitor errors don't affect bot functionality

### "Variables not taking effect"
- After adding/changing variables, Railway automatically redeploys
- Wait 1-2 minutes for the deployment to complete
- Check the Deployments tab for a green checkmark

---

## Next Steps

1. ✅ Volumes added
2. ✅ Variables set
3. ✅ Bot paired
4. ✅ Commands tested
5. ✅ Credentials persist after restart

**Your bot is now production-ready!** 🚀
