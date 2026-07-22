# Security Policy

## Supported Versions

We release security patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

> **Note**: Pre-1.0 versions may have breaking changes. Always pin to exact version in production.

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub issues.**

Instead, email **security@openclaw.ai** with:

1. **Description** of the vulnerability
2. **Steps to reproduce** (if applicable)
3. **Impact assessment** (what could an attacker do?)
4. **Suggested fix** (if you have one)
5. **Your contact info** for follow-up

We will:
- Acknowledge within **48 hours**
- Provide a **timeline** for fix
- Keep you **updated** on progress
- Credit you in the **security advisory** (if desired)

## Security Considerations

### API Keys
- Never commit API keys to git (`.env` is in `.gitignore`)
- Use environment variables in production
- Rotate keys periodically
- Use sandbox keys for development only

### Network
- All API calls use HTTPS only
- Certificate validation is enforced (no `rejectUnauthorized: false`)
- Timeouts prevent hanging requests

### Error Handling
- Errors don't leak sensitive data in messages
- Stack traces excluded from production logs
- Validation errors return generic messages to clients

### Dependencies
- `pnpm audit` runs in CI
- Only production deps in `dependencies`
- Dev deps separated in `devDependencies`

## Responsible Disclosure

We follow coordinated vulnerability disclosure. We appreciate your help keeping users safe.