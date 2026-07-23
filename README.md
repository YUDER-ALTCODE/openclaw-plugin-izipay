# openclaw-plugin-izipay

[![npm version](https://img.shields.io/npm/v/@YUDER-ALTCODE/openclaw-plugin-izipay)](https://www.npmjs.com/package/@YUDER-ALTCODE/openclaw-plugin-izipay)
[![license](https://img.shields.io/npm/l/@YUDER-ALTCODE/openclaw-plugin-izipay)](LICENSE)
[![ClawHub](https://img.shields.io/badge/ClawHub-published-brightgreen)](https://clawhub.openclaw.ai/packages/@YUDER-ALTCODE/openclaw-plugin-izipay)

OpenClaw plugin for **Izipay** payment gateway integration. Provides agent tools to create payments, check status, and retrieve transaction details.

## Features

| Tool | Description |
|------|-------------|
| `izipay_create_payment` | Create a new payment request, returns payment URL for customer redirect |
| `izipay_payment_status` | Check current status of a payment by ID |
| `izipay_payment_details` | Get full transaction details including fees, payment method, installments, refunds |

- ✅ Sandbox & Production environments
- ✅ Config via plugin config or env vars (`IZIPAY_USERNAME`, `IZIPAY_PASSWORD`)
- ✅ Type-safe with TypeBox schemas (runtime validation + metadata)
- ✅ Proper error classes (Auth, Network, Validation, RateLimit)
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
          "username": "98671504",
          "password": "testpassword_abc123...",
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
IZIPAY_USERNAME=98671504
IZIPAY_PASSWORD=testpassword_abc123...
IZIPAY_ENVIRONMENT=sandbox
```

> **Note**: Plugin config takes precedence over env vars.

### Where to Find Your Credentials

1. Login to [Izipay Dashboard](https://dashboard.izipay.pe)
2. Go to **Configuración** → **API Keys**
3. Copy your **Usuario** (username) and **Contraseña de test** (sandbox password)

## Usage

Once installed and configured, the tools are available to any OpenClaw agent:

### Create Payment

```typescript
// Agent calls this tool
await tools.izipay_create_payment({
  amount: 15000,           // Amount in cents (150.00 PEN)
  currency: "PEN",         // "PEN" or "USD"
  orderId: "ORD-2024-001", // Your unique order ID
  description: "Order #2024-001",
  customerEmail: "cliente@ejemplo.com",
  returnUrl: "https://tutienda.com/pago/exito",
  cancelUrl: "https://tutienda.com/pago/cancelado",
  metadata: { source: "web" }
});

// Returns:
{
  paymentId: "pay_abc123",
  status: "pending",
  paymentUrl: "https://pay.micuentaweb.pe/pay_abc123",
  amount: 15000,
  currency: "PEN",
  orderId: "ORD-2024-001",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Check Payment Status

```typescript
await tools.izipay_payment_status({ paymentId: "pay_abc123" });

// Returns:
{
  paymentId: "pay_abc123",
  status: "approved",
  amount: 15000,
  currency: "PEN",
  orderId: "ORD-2024-001",
  updatedAt: "2024-01-15T10:32:15Z"
}
```

### Get Full Details

```typescript
await tools.izipay_payment_details({ paymentId: "pay_abc123" });

// Returns:
{
  paymentId: "pay_abc123",
  status: "approved",
  amount: 15000,
  currency: "PEN",
  orderId: "ORD-2024-001",
  installments: 1,
  paymentMethod: { type: "card", brand: "Visa", lastFour: "4242" },
  fees: { total: 450, breakdown: [{ type: "processing", amount: 450 }] },
  refunds: [],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:32:15Z"
}
```

## Payment Status Values

| Status | Description |
|--------|-------------|
| `pending` | Payment created, awaiting customer |
| `processing` | Customer on payment page |
| `approved` | Payment successful |
| `declined` | Payment rejected |
| `cancelled` | Customer cancelled |
| `expired` | Payment link expired |
| `refunded` | Fully refunded |
| `partially_refunded` | Partial refund |

## Error Handling

Tools throw typed errors you can catch:

```typescript
try {
  await tools.izipay_create_payment({ ... });
} catch (err) {
  if (err instanceof IzipayAuthError) {
    // 401 - Invalid credentials
  } else if (err instanceof IzipayRateLimitError) {
    // 429 - Retry after err.retryAfter ms
  } else if (err instanceof IzipayValidationError) {
    // 400 - Check err.validationErrors
  } else if (err instanceof IzipayNetworkError) {
    // 5xx or network failure
  }
}
```

## Development

```bash
# Install deps
pnpm install

# Type-check
pnpm run typecheck

# Run tests
pnpm test

# Build
pnpm run build

# Validate plugin manifest
pnpm run plugin:validate
```

## Publishing

```bash
# Version bump (patch/minor/major)
pnpm version patch

# Build + validate
pnpm run build && pnpm run plugin:validate

# Publish to ClawHub
clawhub package publish . \
  --version <version> \
  --family code-plugin \
  --source-repo YUDER-ALTCODE/openclaw-plugin-izipay \
  --source-commit <commit-sha> \
  --source-ref v<version> \
  --tags latest
```

## Roadmap

- [ ] Webhook handling (`izipay_webhook_verify`)
- [ ] Refund tool (`izipay_create_refund`)
- [ ] Tokenization (`izipay_tokenize_card`)
- [ ] Recurring payments (`izipay_create_subscription`)
- [ ] Batch operations (`izipay_list_payments`)

## License

MIT © [Yuder Guerra](https://github.com/YUDER-ALTCODE)

## Support

For questions or issues, open a [GitHub Issue](https://github.com/YUDER-ALTCODE/openclaw-plugin-izipay/issues) or contact **yuderguerra503@gmail.com**.

## Related

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Izipay API Docs](https://developers.izipay.pe)
- [ClawHub Marketplace](https://clawhub.openclaw.ai)
