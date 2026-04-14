# Schedule weekly ingest (RSS)

**Goal:** Run **`run-weekly-intel-fetch.sh`** on a fixed schedule so newsletter RSS lands in the vault before you run **`/weekly-exec-intel`**.

**Prerequisites:** Venv at `.scripts/market-intelligence/.venv` with `requirements.txt` installed; **`intel_feeds.json`** populated (see `06-Resources/Market_intelligence/intel_feeds.example.json`).

---

## cron (macOS / Linux)

Edit crontab: `crontab -e`

Example: every **Monday 07:30** (adjust path to your vault):

```cron
30 7 * * 1 cd /Users/you/Documents/Blueprint/Dex && /bin/bash .scripts/market-intelligence/run-weekly-intel-fetch.sh >> /Users/you/Library/Logs/dex-weekly-intel.log 2>&1
```

Use an **absolute** path to the vault for `cd`.

---

## launchd (macOS)

1. Replace `VAULT_PATH` and `YOUR_USER` below.
2. Save as `~/Library/LaunchAgents/com.dex.weekly-intel-fetch.plist`.
3. `launchctl load ~/Library/LaunchAgents/com.dex.weekly-intel-fetch.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.dex.weekly-intel-fetch</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>VAULT_PATH/.scripts/market-intelligence/run-weekly-intel-fetch.sh</string>
  </array>
  <key>WorkingDirectory</key>
  <string>VAULT_PATH</string>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key>
    <integer>1</integer>
    <key>Hour</key>
    <integer>7</integer>
    <key>Minute</key>
    <integer>30</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/Users/YOUR_USER/Library/Logs/dex-weekly-intel.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/YOUR_USER/Library/Logs/dex-weekly-intel.log</string>
</dict>
</plist>
```

`Weekday`: `1` = Monday. Change day/time as needed.

**TLS (corporate CA):** If RSS fetch fails with certificate errors, add an `EnvironmentVariables` dict to the plist so `SSL_CERT_FILE` points at your PEM bundle (same as interactive shell). Example:

```xml
  <key>EnvironmentVariables</key>
  <dict>
    <key>SSL_CERT_FILE</key>
    <string>/path/to/your/ca-bundle.pem</string>
  </dict>
```

Optional: `INTEL_FEEDS_FILE` → path to a **private** feeds JSON (not in git). Do not commit secrets into tracked `intel_feeds.json`.

---

## After the job runs

Open Dex and run **`/weekly-exec-intel`** to synthesize **`synthesis/weekly/YYYY-MM-DD_weekly_exec_brief.md`**. The shell job does not run Claude — it only fetches RSS.
