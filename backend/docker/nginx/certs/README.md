# SSL certificates

Place here:
- `fullchain.pem` — the server certificate (+ intermediates if any)
- `privkey.pem`   — the private key

Nginx is configured to read these paths (see `../nginx.conf`).

## Option A — Self-signed certificate (dev / test on IP)

Run from the `backend/` directory:

```bash
mkdir -p docker/nginx/certs
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout docker/nginx/certs/privkey.pem \
  -out    docker/nginx/certs/fullchain.pem \
  -subj "/C=MA/ST=Casablanca/L=Casablanca/O=AutoHistorique/CN=102.50.247.101" \
  -addext "subjectAltName=IP:102.50.247.101,DNS:localhost"
```

> ⚠️ Self-signed certs are rejected by Android/iOS by default.
> You must either install this cert on each test device, or embed it in the app
> (see `frontend/android/app/src/main/res/xml/network_security_config.xml`).

## Option B — Let's Encrypt (prod, requires a domain)

If you point a domain (e.g. `api.autohistorique.ma` or a free one like
`autohistorique.duckdns.org`) to `102.50.247.101`, you can get a real cert:

```bash
# On the server, stop nginx temporarily if using standalone mode
sudo certbot certonly --standalone -d api.autohistorique.ma

# Symlink (or copy) the certs into this folder:
sudo cp /etc/letsencrypt/live/api.autohistorique.ma/fullchain.pem docker/nginx/certs/
sudo cp /etc/letsencrypt/live/api.autohistorique.ma/privkey.pem   docker/nginx/certs/

# Reload nginx
docker compose exec nginx nginx -s reload
```

Set up a cron job to renew every 60 days:
```
0 3 * * * certbot renew --quiet && docker compose -f /path/to/docker-compose.yml exec nginx nginx -s reload
```

## File permissions

The private key should not be world-readable:
```bash
chmod 600 docker/nginx/certs/privkey.pem
chmod 644 docker/nginx/certs/fullchain.pem
```
