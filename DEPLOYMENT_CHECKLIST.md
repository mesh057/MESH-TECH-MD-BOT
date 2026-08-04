# MESH-TECH-MD-BOT Deployment Checklist for Railway

This checklist ensures your bot is properly configured on Railway with persistent storage and working credentials.

---

## Phase 1: Pre-Deployment Verification

- [ ] **GitHub Repository Connected**: Verify that your Railway project is connected to `mesh057/MESH-TECH-MD-BOT`
- [ ] **Latest Code Pulled**: Confirm the latest commit is deployed (check the Deployments tab)
- [ ] **No Build Errors**: Verify the build completed successfully with a green checkmark
- [ ] **Service Status**: Confirm the service shows "Online" or "Running"

---

## Phase 2: Persistent Volume Setup (Critical for Credentials)

### Volume 1: Session Data (`/app/sessions`)
This volume stores your WhatsApp session credentials. **Without this, you must re-pair after every restart.**

**Steps:**
1. Open your **MESH-TECH-MD-BOT** service in Railway
2. Click the **Settings** tab
3. Scroll to **Volumes** section
4. Click **+ Add Volume**
5. Set **Mount Path**: `/app/sessions`
6. Set **Size**: 1 GB (minimum)
7. Click **Create**

**Verification:**
- After adding, you should see a green checkmark next to the volume
- The volume persists even if the service restarts

### Volume 2: Bot Data (`/app/data`)
This volume stores bot configuration, user data, and settings.

**Steps:**
1. In the same **Volumes** section, click **+ Add Volume** again
2. Set **Mount Path**: `/app/data`
3. Set **Size**: 1 GB (minimum)
4. Click **Create**

**Verification:**
- Confirm both volumes are listed and show green status
- Both should display their mount paths clearly

---

## Phase 3: Environment Variables Setup

### Required Variables

| Variable Name | Example Value | Purpose |
| :--- | :--- | :--- |
| `OWNER_NUMBER` | `254700000000` | Your WhatsApp number (country code + number, no `+` or spaces) |
| `MONITOR_URL` | `https://mesh-tech-md-monitor.up.railway.app` | Dashboard URL to track bot usage (optional) |
| `ADMIN_PASSWORD` | `MeshTech2026` | Password for monitor dashboard (if using monitor) |

### How to Add Variables in Railway

1. Open your **MESH-TECH-MD-BOT** service
2. Click the **Variables** tab
3. For each variable below, click **+ New Variable**:

**Variable 1: OWNER_NUMBER**
- **Key**: `OWNER_NUMBER`
- **Value**: Your WhatsApp number with country code (e.g., `254700000000`)
- Click **Add**

**Variable 2: MONITOR_URL** (Optional)
- **Key**: `MONITOR_URL`
- **Value**: Your monitor dashboard URL (e.g., `https://mesh-tech-md-monitor.up.railway.app`)
- Click **Add**

**Variable 3: ADMIN_PASSWORD** (Optional, only if using monitor)
- **Key**: `ADMIN_PASSWORD`
- **Value**: Your chosen password (e.g., `MeshTech2026`)
- Click **Add**

---

## Phase 4: Credential Persistence Test

### Test 1: Verify Volumes Are Mounted
1. Go to your service's **Deployments** tab
2. Click the latest deployment
3. Open **Logs**
4. Look for a line like: `[System] Data directory: /app/data` or `[System] Sessions directory: /app/sessions`
5. If you see these lines, volumes are correctly mounted ✅

### Test 2: Verify Baileys Credentials Survive Restart
1. **Pair your bot** using the pairing site (go through the QR code process)
2. **Send a test command** to the bot (e.g., `.ping`)
3. **Restart the service**:
   - In Railway, click the **⋮** (three dots) menu on your service
   - Select **Restart**
   - Wait 30-60 seconds for the bot to come back online
4. **Send another test command** (e.g., `.ping`)
5. **If the bot responds without re-pairing, credentials persisted** ✅

### Test 3: Verify Data Persistence
1. Create a test setting (e.g., enable antilink in a group)
2. Restart the service
3. Check if the setting is still active after restart ✅

---

## Phase 5: Performance & Speed Optimization

- [ ] **Disable Chatbot Auto-Reply** if not needed (it can slow down response times)
- [ ] **Monitor Dashboard Linked** (optional): Ensure `MONITOR_URL` is set for real-time tracking
- [ ] **Command Response Time**: Test a command like `.menu` — should respond within 2-3 seconds
- [ ] **Group Commands**: Test group commands (`.kick`, `.antilink`) — should respond within 3-5 seconds

---

## Phase 6: Monitoring & Logging

### Check Bot Logs for Errors
1. Open your service's **Deployments** tab
2. Click the latest deployment
3. Click **View Logs**
4. Look for any `[ERROR]` or `[WARN]` messages
5. If you see monitor errors like `[Monitor] Failed to send log`, it's safe to ignore (non-critical)

### Expected Log Messages
```
[System] Bot initialized successfully
[System] Sessions directory: /app/sessions
[System] Data directory: /app/data
[Monitor] Sending log to https://...
[Monitor] Log sent successfully
```

---

## Phase 7: Troubleshooting

### Problem: Bot goes offline after restart
**Solution**: Verify volumes are mounted (see Phase 4, Test 1)

### Problem: "Please re-pair your bot"
**Solution**: 
- Check if `/app/sessions` volume exists
- Restart the service to ensure volume is mounted
- Re-pair the bot

### Problem: Monitor not showing data
**Solution**:
- Verify `MONITOR_URL` is set correctly (no trailing slash)
- Check if monitor service is online on Railway
- Monitor errors are non-blocking; bot still works

### Problem: Bot is slow
**Solution**:
- Ensure volumes are mounted (reduces I/O delays)
- Check Railway service logs for errors
- Disable chatbot auto-reply if enabled

---

## Phase 8: Final Verification Checklist

- [ ] Both volumes (`/app/sessions` and `/app/data`) are created and mounted
- [ ] All required variables are set (`OWNER_NUMBER` at minimum)
- [ ] Bot is paired and responding to commands
- [ ] Bot survives a restart without re-pairing
- [ ] Monitor (if enabled) is showing activity
- [ ] No critical errors in logs
- [ ] Commands respond within 2-5 seconds

---

## Quick Reference: Railway Variable Setup

**Copy-paste this format when adding variables:**

```
Key: OWNER_NUMBER
Value: 254700000000

Key: MONITOR_URL
Value: https://mesh-tech-md-monitor.up.railway.app

Key: ADMIN_PASSWORD
Value: MeshTech2026
```

Replace the values with your own!

---

## Support

If you encounter issues:
1. Check the **Logs** in Railway (Deployments tab)
2. Verify volumes are mounted (Settings → Volumes)
3. Verify variables are set correctly (Variables tab)
4. Restart the service and test again

Good luck! 🚀
