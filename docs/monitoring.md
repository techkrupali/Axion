# Uptime, errors, SSL and domain (Fix Brief Part 10, T-03)

Alerts go to **Nitin (nitin@axionindex.org)** and the **tech lead**. Record each account in the tracker's Access tab, in Axion's name (X-01, X-02).

## 1. Uptime alerts (free, about 10 minutes)

1. Create a free account at https://uptimerobot.com with an Axion address (support@axionindex.org).
2. Add two HTTP(s) monitors, checked every 5 minutes:
   - `https://axionindex.org/` (the homepage);
   - `https://axionindex.org/api/health` (answers 200 only when the site **and** its database work; 503 otherwise).
3. Alert contacts: nitin@axionindex.org and the tech lead's email. Alert after 2 failed checks, so a short restart doesn't page anyone.
4. Under each monitor, also turn on **SSL expiry** alerts (30 and 7 days before) and **domain expiry** alerts.

## 2. Error alerts

The site runs under pm2 on the VPS. pm2 restarts it if it crashes; the uptime monitor tells you if it stays down.

- Recent errors: `pm2 logs axion --err --lines 100`.
- Keep the logs from filling the disk (once):
  ```bash
  pm2 install pm2-logrotate
  ```
- Form emails that fail to send are logged as `[MAILER]` lines in the same log. The visitor's submission is still saved in the database and in the leads sheet.

## 3. SSL certificate (check once, then monthly)

If the certificate is from Let's Encrypt (certbot) on the VPS, it renews by itself. To check that renewal works:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

Both should succeed / show a timer. The uptime monitor's SSL alert is the safety net.

## 4. Domain auto-renew

At the registrar (Namecheap), open **axionindex.org** and check that **Auto-Renew** is on and the card on file is Axion's, not a developer's. Note the renewal date in the Access tab.

## Monthly check

Add to the monthly date check (`docs/updates.md`): uptime report for the month (UptimeRobot dashboard), SSL days left, domain renewal date.
