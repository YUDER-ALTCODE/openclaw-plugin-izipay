# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial plugin scaffold with OpenClaw Plugin SDK
- Izipay HTTP client with typed requests/responses
- Three agent tools:
  - `izipay_create_payment` — Create new payment requests
  - `izipay_payment_status` — Check payment status by ID
  - `izipay_payment_details` — Get full payment details including fees, payment method, refunds
- Configuration via plugin config + environment variables (`IZIPAY_API_KEY`, `IZIPAY_ENV`)
- Typed error classes: `IzipayAuthError`, `IzipayNetworkError`, `IzipayValidationError`, `IzipayApiError`
- TypeBox schemas for all tool parameters and results
- Strict TypeScript configuration with verbatimModuleSyntax
- CI/CD ready structure

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

---

## [0.1.0] - 2026-07-22

### Added
- Initial release (MVP)
- Payment creation with amount, currency (PEN/USD), orderId, customer info, return/cancel URLs
- Payment status查询
- Payment details with fees, payment method, installments, refunds
- Sandbox and Production environment support
- API Key authentication with environment-specific prefix validation
- Full TypeScript types and TypeBox runtime validation

---

## Release Notes Format

Each release should include:

```markdown
## [x.y.z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes
```

## Versioning

- **Patch (x.y.Z)**: Bug fixes, security patches
- **Minor (x.Y.z)**: New features, backward compatible
- **Major (X.y.z)**: Breaking changes

Pre-1.0 versions: Minor versions may include breaking changes. Pin to exact version in production.