#!/usr/bin/env node
/**
 * Stamps values from site.config.json into every HTML page.
 *
 * Markers (add `data-site="..."` to an element, this script fills it in):
 *   data-site="email:<key>"  on <a>, <span>, <bdt>  -> href="mailto:<email>" (for <a>) + inner text
 *   data-site="url"          on <a>                  -> href=siteUrl + inner text
 *   data-site="page-url"     on <link>/<meta>        -> href/content = siteUrl + page path
 *   data-site="og-image"     on <meta>               -> content = siteUrl + "/" + ogImage
 *
 * Usage:  node scripts/apply-config.mjs          (rewrite files)
 *         node scripts/apply-config.mjs --check  (exit 1 if any file is out of date)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8"));
const siteUrl = config.siteUrl.replace(/\/+$/, "");
const check = process.argv.includes("--check");
const SKIP_DIRS = new Set(["node_modules", ".git", "assets", "scripts"]);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return SKIP_DIRS.has(name) ? [] : htmlFiles(p);
    return name.endsWith(".html") ? [p] : [];
  });
}

function pageUrl(file) {
  const rel = relative(root, file).split("\\").join("/");
  return rel === "index.html" ? `${siteUrl}/` : `${siteUrl}/${rel}`;
}

function setAttr(attrs, name, value) {
  const re = new RegExp(`\\s${name}="[^"]*"`);
  return re.test(attrs) ? attrs.replace(re, ` ${name}="${value}"`) : `${attrs} ${name}="${value}"`;
}

function valueFor(marker, file) {
  if (marker === "url") return siteUrl;
  if (marker === "page-url") return pageUrl(file);
  if (marker === "og-image") return `${siteUrl}/${config.ogImage.replace(/^\/+/, "")}`;
  if (marker.startsWith("email:")) {
    const key = marker.slice(6);
    const email = config.emails[key];
    if (!email) throw new Error(`site.config.json has no emails.${key} (used in ${relative(root, file)})`);
    return email;
  }
  throw new Error(`Unknown data-site marker "${marker}" in ${relative(root, file)}`);
}

// Matches an opening tag carrying data-site, and (for a/span/bdt) its inner text up to the closing tag.
const TAG_RE = /<(a|span|bdt|meta|link)\b([^>]*?\sdata-site="([^"]+)"[^>]*?)(\/?)>(?:([\s\S]*?)<\/\1\s*>)?/g;

function transform(html, file) {
  return html.replace(TAG_RE, (whole, tag, attrs, marker, selfClose, inner) => {
    const value = valueFor(marker, file);
    let newAttrs = attrs;
    if (tag === "a") newAttrs = setAttr(attrs, "href", marker.startsWith("email:") ? `mailto:${value}` : value);
    if (tag === "link") newAttrs = setAttr(attrs, "href", value);
    if (tag === "meta") newAttrs = setAttr(attrs, "content", value);
    if (inner === undefined) return `<${tag}${newAttrs}${selfClose}>`;
    // Keep the author's whitespace/newlines around the text, swap only the text itself.
    const newInner = inner.replace(/^(\s*)[\s\S]*?(\s*)$/, (_, pre, post) => `${pre}${value}${post}`);
    return `<${tag}${newAttrs}${selfClose}>${newInner}</${tag}>`;
  });
}

let changed = 0;
for (const file of htmlFiles(root)) {
  const before = readFileSync(file, "utf8");
  const after = transform(before, file);
  if (after !== before) {
    changed++;
    if (check) console.log(`out of date: ${relative(root, file)}`);
    else {
      writeFileSync(file, after);
      console.log(`updated: ${relative(root, file)}`);
    }
  }
}
if (check && changed) {
  console.error(`\n${changed} file(s) need "node scripts/apply-config.mjs"`);
  process.exit(1);
}
console.log(changed ? `${changed} file(s) ${check ? "out of date" : "updated"}` : "all pages already match site.config.json");
