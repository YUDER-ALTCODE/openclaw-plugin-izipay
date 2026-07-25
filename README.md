# openclaw-plugin-izipay

[![npm version](https://img.shields.io/npm/v/@YUDER-ALTCODE/openclaw-plugin-izipay)](https://www.npmjs.com/package/@YUDER-ALTCODE/openclaw-plugin-izipay)
[![license](https://img.shields.io/npm/l/@YUDER-ALTCODE/openclaw-plugin-izipay)](LICENSE)
[![ClawHub](https://img.shields.io/badge/ClawHub-published-brightgreen)](https://clawhub.openclaw.ai/packages/@YUDER-ALTCODE/openclaw-plugin-izipay)

OpenClaw plugin for **Izipay** payment gateway integration. Provides agent tools to create payments and payment links.

## Features

| Tool | Description |
|------|-------------|
| `izipay_create_payment` | Create a payment request, returns a formToken for the Izipay JavaScript SDK |
| `izipay_create_payment_link` | Create a shareable payment link (WhatsApp, email, SMS, etc.) |

- ✅ Sandbox & Production environments
- ✅ Config via plugin config or env vars
- ✅ Type-safe with TypeBox schemas (runtime validation + metadata)
- ✅ Proper error classes (Auth, Network, API)
- ✅ Ready for [ClawHub Marketplace](https://clawhub.openclaw.ai)

## Installation

### Via OpenClaw CLI (recommended)

```bash
# From npm
openclaw plugins install npm:@YUDER-ALTCODE/openclaw-plugin-izipay

# From ClawHub
openclaw plugins install clawhub:@YUDER-ALTCODE/openclaw-plugin-izipay
```

### Manual (development)

```bash
git clone https://github.com/YUDER-ALTCODE/openclaw-plugin-izipay
cd openclaw-plugin-izipay
pnpm install
pnpm run build
```

## Configuration

### Option 1: Plugin Config (openclaw.json)

```json
{
  "plugins": {
    "entries": {
      "izipay": {
        "enabled": true,
        "config": {
          "username": "YOUR_MERCHANT_CODE",
          "password": "YOUR_SANDBOX_PASSWORD",
          "publicKey": "YOUR_API_KEY",
          "environment": "sandbox"
        }
      }
    }
  }
}
```

### Option 2: Environment Variables

```bash
# .env
IZIPAY_USERNAME=YOUR_MERCHANT_CODE
IZIPAY_PASSWORD=YOUR_SANDBOX_PASSWORD
IZIPAY_PUBLIC_KEY=YOUR_API_KEY
IZIPAY_ENVIRONMENT=sandbox
```

> **Note**: Plugin config takes precedence over env vars.

### Where to Find Your Credentials

1. Login to [Izipay Dashboard](https://dashboard.izipay.pe)
2. Go to **Recursos** → **Credenciales**
3. Copy your:
   - **Usuario** (username)
   - **Contraseña de test** (sandbox password)
   - **Clave API** for Payment Links (format: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

## Usage

Once installed and configured, the tools are available to any OpenClaw agent:

### Create Payment (Form Token)

```typescript
// Agent calls this tool to get a formToken for the Izipay JavaScript SDK
await tools.izipay_create_payment({
  amount: 10000,           // Amount in cents (100.00 PEN)
  currency: "PEN",         // "PEN" or "USD"
  orderId: "ORD-001",      // Your unique order ID
  customerEmail: "cliente@ejemplo.com"
});

// Returns:
{
  status: "SUCCESS",
  formToken: "eyJhbGciOiJIUzI1NiIs..."
}
```

### Create Payment Link

```typescript
// Agent creates a shareable payment link
await tools.izipay_create_payment_link({
  merchantCode: "YOUR_MERCHANT_CODE",
  productDescription: "Camiseta Premium",
  amount: "10.50",
  currency: "PEN",
  expirationDate: "2026-12-31 23:59:00.000",
  wayOfUse: "INDIVIDUAL",
  payMethod: "CARD",
  billing: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    phoneNumber: "999999999",
    street: "Av. Principal 123",
    postalCode: "15001",
    city: "Lima",
    state: "Lima",
    country: "PE",
    documentType: "DNI",
    document: "12345678"
  },
  shipping: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    phoneNumber: "999999999",
    street: "Av. Principal 123",
    postalCode: "15001",
    city: "Lima",
    state: "Lima",
    country: "PE",
    documentType: "DNI",
    document: "12345678"
  }
});

// Returns:
{
  status: "OK",
  paymentLinkId: "1450558deaf948f2a46a37ddfcd85ea1",
  paymentUrl: "https://paymentlink.izipay.pe/pay/2e3w70vcsoy",
  amount: "10.50",
  currency: "PEN",
  state: "1"  // 1=GENERADO, 3=TERMINADO_EXITO, etc.
}
```

## Payment Link States

| State | Description |
|-------|-------------|
| `1` | GENERADO - Link created and active |
| `3` | TERMINADO_EXITO - Payment completed successfully |
| `4` | TERMINADO_ERROR - Payment error |
| `5` | EXPIRADO - Link expired |
| `6` | DESACTIVADO - Link deactivated |

## Error Handling

Tools throw typed errors you can catch:

```typescript
try {
  await tools.izipay_create_payment_link({ ... });
} catch (err) {
  if (err instanceof IzipayAuthError) {
    // 401 - Invalid credentials or session token
  } else if (err instanceof IzipayApiError) {
    // API error - check err.message for details
  } else if (err instanceof IzipayNetworkError) {
    // Network failure or server error
  }
}
```

## Development

```bash
# Install deps
pnpm install

# Run tests
pnpm test

# Build
pnpm run build
```

## Publishing

```bash
# Version bump
pnpm version patch

# Build + publish to ClawHub
pnpm run build
clawhub package publish . \
  --version <version> \
  --family code-plugin \
  --source-repo YUDER-ALTCODE/openclaw-plugin-izipay \
  --source-commit <commit-sha> \
  --source-ref v<version> \
  --tags latest
```

## License

MIT © [Yuder Guerra](https://github.com/YUDER-ALTCODE)

## Support

For questions or issues, open a [GitHub Issue](https://github.com/YUDER-ALTCODE/openclaw-plugin-izipay/issues) or contact **yuderguerra503@gmail.com**.

## Related

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Izipay API Docs](https://developers.izipay.pe)
- [ClawHub Marketplace](https://clawhub.openclaw.ai)
