#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────
# Generates a private CA + server cert signed by it.
# Run from the backend/ directory:
#   chmod +x docker/nginx/certs/generate-ca-and-cert.sh
#   ./docker/nginx/certs/generate-ca-and-cert.sh
# ──────────────────────────────────────────────────────────
set -euo pipefail

# ───── CONFIG — edit as needed ─────────────────────────────
SERVER_IP="10.190.100.176"
SERVER_DNS="localhost"
CA_COMMON_NAME="AutoHistorique Root CA"
SERVER_COMMON_NAME="AutoHistorique API"
COUNTRY="MA"
STATE="Casablanca"
LOCALITY="Casablanca"
ORG="AutoHistorique"
DAYS_CA=3650        # CA valid 10 years
DAYS_SERVER=825     # server cert valid ~2 years (iOS max 825 days)
# ───────────────────────────────────────────────────────────

OUT="$(cd "$(dirname "$0")" && pwd)"
cd "$OUT"
echo "Output dir: $OUT"

# 1. Root CA ------------------------------------------------
if [[ -f ca.key && -f ca.crt ]]; then
  echo "✓ CA already exists (ca.key, ca.crt) — reusing it"
else
  echo "▸ Generating Root CA..."
  openssl genrsa -out ca.key 4096
  openssl req -x509 -new -nodes -sha256 -days "$DAYS_CA" \
    -key ca.key -out ca.crt \
    -subj "/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORG/CN=$CA_COMMON_NAME"
  echo "✓ Root CA created (ca.key, ca.crt)"
fi

# 2. Server key --------------------------------------------
echo "▸ Generating server private key..."
openssl genrsa -out privkey.pem 2048

# 3. Server CSR with SAN extensions -------------------------
echo "▸ Generating server CSR..."
cat > server.ext.cnf <<EOF
[ req ]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = req_ext

[ dn ]
C  = $COUNTRY
ST = $STATE
L  = $LOCALITY
O  = $ORG
CN = $SERVER_COMMON_NAME

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
IP.1  = $SERVER_IP
DNS.1 = $SERVER_DNS
EOF

openssl req -new -key privkey.pem -out server.csr -config server.ext.cnf

# 4. Sign server cert with CA -------------------------------
echo "▸ Signing server cert with CA..."
cat > server.sign.cnf <<EOF
authorityKeyIdentifier = keyid,issuer
basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth
subjectAltName         = @alt_names

[ alt_names ]
IP.1  = $SERVER_IP
DNS.1 = $SERVER_DNS
EOF

openssl x509 -req -in server.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out fullchain.pem -days "$DAYS_SERVER" -sha256 \
  -extfile server.sign.cnf

# Append the CA to fullchain so clients can build the chain
cat ca.crt >> fullchain.pem

# Cleanup intermediate files
rm -f server.csr server.ext.cnf server.sign.cnf ca.srl

# Permissions
chmod 600 privkey.pem ca.key
chmod 644 fullchain.pem ca.crt

echo
echo "─────────────────────────────────────────────"
echo "✅ Done. Files in $OUT :"
echo "   ca.crt         → trust anchor (embed in Android APK)"
echo "   ca.key         → CA private key (KEEP SECRET, backup safely)"
echo "   fullchain.pem  → server cert for nginx (cert + CA chain)"
echo "   privkey.pem    → server private key for nginx"
echo "─────────────────────────────────────────────"
echo "Next steps:"
echo "  1. docker compose restart nginx"
echo "  2. Copy ca.crt to frontend/android/app/src/main/res/raw/server_cert.pem"
echo "  3. cd frontend && npm run build:prod && npx cap sync android"
echo "─────────────────────────────────────────────"
