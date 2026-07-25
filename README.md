<p align="center">
  <img src="assets/favicon.png" alt="Izipay Logo" width="100">
</p>

<h1 align="center">openclaw-plugin-izipay</h1>

<p align="center">
  <strong>OpenClaw plugin for Izipay payment gateway integration</strong>
</p>

<p align="center">
  <a href="https://github.com/YUDER-ALTCODE/openclaw-plugin-izipay/releases"><img src="https://img.shields.io/github/v/release/YUDER-ALTCODE/openclaw-plugin-izipay?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://www.npmjs.com/package/@YUDER-ALTCODE/openclaw-plugin-izipay"><img src="https://img.shields.io/npm/v/@YUDER-ALTCODE/openclaw-plugin-izipay?style=for-the-badge&color=blue" alt="npm version"></a>
  <a href="https://clawhub.openclaw.ai/packages/@YUDER-ALTCODE/openclaw-plugin-izipay"><img src="https://img.shields.io/badge/ClawHub-published-brightgreen?style=for-the-badge" alt="ClawHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

## Overview

This plugin provides OpenClaw agents with native tools to interact with the [Izipay](https://izipay.pe) payment gateway. It supports two main operations:

| Tool | Description |
|------|-------------|
| `izipay_create_payment` | Generate a `formToken` for embedding the Izipay JavaScript SDK checkout form |
| `izipay_create_payment_link` | Create a shareable payment link (via WhatsApp, email, SMS, etc.) |

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  OpenClaw Agent │────▶│  Izipay Plugin   │────▶│  Izipay API     │
│                 │     │                  │     │                 │
│  tools.*        │     │  Auth (Basic)    │     │  /CreatePayment │
│                 │     │  Client          │     │  /Token/Generate│
│                 │     │  Schemas (Zod)   │     │  /PaymentLink   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Authentication:**
- `CreatePayment` → Basic Auth (`username:password`)
- `Payment Links` → Bearer token via `/security/v1/Token/Generate`

## Installation

```bash
# From ClawHub (recommended)
openclaw plugins install clawhub:@YUDER-ALTCODE/openclaw-plugin-izipay

# From npm
openclaw plugins install npm:@YUDER-ALTCODE/openclaw-plugin-izipay
```

### Local Development

```bash
git clone https://github.com/YUDER-ALTCODE/openclaw-plugin-izipay
cd openclaw-plugin-izipay
pnpm install
pnpm run build
```

## Configuration

Add the following to your `openclaw.json`:

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

Or use environment variables:

```bash
IZIPAY_USERNAME=YOUR_MERCHANT_CODE
IZIPAY_PASSWORD=YOUR_SANDBOX_PASSWORD
IZIPAY_PUBLIC_KEY=YOUR_API_KEY
IZIPAY_ENVIRONMENT=sandbox
```

> Plugin config takes precedence over environment variables.

### Getting Your Credentials

1. Login to [Izipay Dashboard](https://dashboard.izipay.pe)
2. Navigate to **Recursos** → **Credenciales**
3. Copy:
   - **Usuario** (merchant code)
   - **Contraseña de test** (sandbox password)
   - **Clave API** for Payment Links (format: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

## API Reference

### `izipay_create_payment`

Generates a `formToken` for use with the Izipay JavaScript SDK.

```typescript
const result = await tools.izipay_create_payment({
  amount: 10000,           // Amount in cents (100.00 PEN)
  currency: "PEN",         // "PEN" or "USD"
  orderId: "ORD-001",      // Unique order identifier
  customerEmail: "cliente@ejemplo.com"
});

// Response
{
  status: "SUCCESS",
  formToken: "eyJhbGciOiJIUzI1NiIs..."
}
```

### `izipay_create_payment_link`

Creates a shareable payment link with billing/shipping details.

```typescript
const result = await tools.izipay_create_payment_link({
  merchantCode: "YOUR_MERCHANT_CODE",
  productDescription: "Camiseta Premium",
  amount: "10.50",
  currency: "PEN",
  expirationDate: "2026-12-31 23:59:00.000",
  wayOfUse: "INDIVIDUAL",  // or "GENERAL" for reusable
  payMethod: "CARD",       // "CARD", "QR", "YAPE_CODE", "PAGO_PUSH"
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
  shipping: { /* same structure as billing */ }
});

// Response
{
  status: "OK",
  paymentLinkId: "1450558deaf948f2a46a37ddfcd85ea1",
  paymentUrl: "https://paymentlink.izipay.pe/pay/2e3w70vcsoy",
  amount: "10.50",
  currency: "PEN",
  state: "1"
}
```

### Payment Link States

| Code | State | Description |
|------|-------|-------------|
| `1` | GENERADO | Link created and active |
| `3` | TERMINADO_EXITO | Payment completed successfully |
| `4` | TERMINADO_ERROR | Payment error |
| `5` | EXPIRADO | Link expired |
| `6` | DESACTIVADO | Link deactivated |

### Error Handling

```typescript
import { IzipayAuthError, IzipayApiError, IzipayNetworkError } from "@YUDER-ALTCODE/openclaw-plugin-izipay";

try {
  await tools.izipay_create_payment_link({ ... });
} catch (err) {
  if (err instanceof IzipayAuthError) {
    // 401 - Invalid credentials or expired session token
  } else if (err instanceof IzipayApiError) {
    // API error - check err.message for details
  } else if (err instanceof IzipayNetworkError) {
    // Network failure or server error
  }
}
```

## Development

```bash
pnpm install        # Install dependencies
pnpm test           # Run tests
pnpm run build      # Build for production
```

## Publishing

```bash
pnpm version patch
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

For questions or issues, open a [GitHub Issue](https://github.com/YUDER-ALTCODE/openclaw-plugin-izipay/issues) or contact **yuderguerra508@gmail.com**.

## Related

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Izipay API Documentation](https://developers.izipay.pe)
- [ClawHub Marketplace](https://clawhub.openclaw.ai)
