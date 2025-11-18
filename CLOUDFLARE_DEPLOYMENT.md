# Cloudflare Pages Deployment Guide

## Required Configuration

This project is deployed on Cloudflare Pages and requires the `nodejs_compat` compatibility flag to be enabled.

### Setting Up Compatibility Flags

**IMPORTANT**: You must configure the `nodejs_compat` compatibility flag in your Cloudflare Pages project settings.

#### Steps:

1. Go to your Cloudflare Dashboard
2. Navigate to **Workers & Pages** > **Your Project**
3. Go to **Settings** > **Compatibility Flags**
4. Add `nodejs_compat` to **both** environments:
   - **Production compatibility flags**
   - **Preview compatibility flags**
5. Click **Save**

### Why This Is Required

This Next.js application uses Node.js APIs that require the `nodejs_compat` compatibility flag when deployed to Cloudflare Pages. Without this flag, you'll encounter the error:

```
Node.JS Compatibility Error
no nodejs_compat compatibility flag set
```

### Local Development

For local development with Wrangler, the compatibility flag is already configured in `wrangler.toml`:

```toml
compatibility_flags = ["nodejs_compat"]
```

### Deployment Checklist

Before deploying to Cloudflare Pages, ensure:

- [ ] `nodejs_compat` is added to Production compatibility flags
- [ ] `nodejs_compat` is added to Preview compatibility flags
- [ ] Project builds successfully with `npm run build`

### Additional Resources

- [Cloudflare Pages Compatibility Flags Documentation](https://developers.cloudflare.com/pages/platform/functions/compatibility-flags/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

## Build Configuration

**Framework preset**: Next.js (Static HTML Export) or Next.js
**Build command**: `npm run build`
**Build output directory**: `.next` or `out` (depending on your Next.js configuration)

---

**Note**: Compatibility flags must be set via the Cloudflare Dashboard as they are project-level settings and cannot be configured through the repository code alone.
