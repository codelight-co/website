# Codelight website

Static HTML site (no build step). Hosted on GitHub Pages at **https://codelight.tech**.

## Changing the domain or contact emails

All domain-dependent values live in one file: [`site.config.json`](site.config.json).

```json
{
  "domain": "codelight.tech",
  "siteUrl": "https://codelight.tech",
  "ogImage": "opengraph.png",
  "emails": {
    "info": "info@codelight.tech",
    "contact": "contact@codelight.tech",
    "info_chianotes": "info_chianotes@codelight.tech"
  }
}
```

After editing it, stamp the values into every page and commit the result:

```bash
node scripts/apply-config.mjs          # rewrites the HTML files
node scripts/apply-config.mjs --check  # exits 1 if any page is out of date
```

The script fills in elements marked with a `data-site` attribute:

| Marker                    | Element            | What gets set                              |
| ------------------------- | ------------------ | ------------------------------------------ |
| `data-site="email:<key>"` | `a`, `span`, `bdt` | `mailto:` href (for `a`) and the text      |
| `data-site="url"`         | `a`                | href and text = `siteUrl`                  |
| `data-site="page-url"`    | `link`, `meta`     | canonical / `og:url` for that page         |
| `data-site="og-image"`    | `meta`             | absolute `og:image` / `twitter:image` URL  |

To add a new email address, add a key under `emails` and mark the element, e.g.
`<a data-site="email:sales">placeholder</a>`.

Also update the [`CNAME`](CNAME) file if the domain changes; GitHub Pages reads it.

## Deploying (GitHub Pages)

1. Push to `master`.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `master`, Folder = `/ (root)`.
3. Under **Custom domain** enter `codelight.tech`, save, wait for the DNS check, then tick **Enforce HTTPS**.

Every push to `master` redeploys. `.nojekyll` makes Pages serve files as-is.

## DNS (AWS Route 53)

Records needed (also in [`scripts/route53-github-pages.json`](scripts/route53-github-pages.json)):

| Name                 | Type  | Value                                                                  |
| -------------------- | ----- | ---------------------------------------------------------------------- |
| `codelight.tech`     | A     | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `codelight.tech`     | AAAA  | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www.codelight.tech` | CNAME | `codelight-co.github.io`                                               |

With the AWS CLI:

```bash
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name codelight.tech \
  --query 'HostedZones[0].Id' --output text | sed 's|/hostedzone/||')
aws route53 change-resource-record-sets --hosted-zone-id "$ZONE_ID" \
  --change-batch file://scripts/route53-github-pages.json
```
