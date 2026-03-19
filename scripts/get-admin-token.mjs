/**
 * One-time script to get a Shopify Admin API access token via OAuth.
 * Run: node scripts/get-admin-token.mjs
 *
 * 1. Opens browser to Shopify OAuth
 * 2. Captures the callback
 * 3. Exchanges auth code for access token
 * 4. Prints the token
 */

import http from "node:http";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || "8e723dcf28f3e67f7ad9b0015f2f01d3";
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
if (!CLIENT_SECRET) {
  console.error("Error: Set SHOPIFY_CLIENT_SECRET env var before running this script.");
  process.exit(1);
}
const STORE = "uncut-packaging.myshopify.com";
const SCOPES = "write_products,read_products,write_inventory,read_inventory,read_orders";
const REDIRECT_URI = "http://localhost:3456/callback";

const nonce = crypto.randomBytes(16).toString("hex");

const authUrl =
  `https://${STORE}/admin/oauth/authorize?` +
  `client_id=${CLIENT_ID}` +
  `&scope=${SCOPES}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&state=${nonce}`;

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/callback")) {
    res.writeHead(404);
    res.end();
    return;
  }

  const url = new URL(req.url, "http://localhost:3456");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (state !== nonce) {
    res.writeHead(400);
    res.end("State mismatch");
    server.close();
    return;
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  if (data.access_token) {
    console.log("\n✅ Admin API Access Token:");
    console.log(data.access_token);
    console.log("\nAdd this to your .env.local:");
    console.log(`SHOPIFY_ADMIN_ACCESS_TOKEN=${data.access_token}`);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Token captured! You can close this tab.</h1>");
  } else {
    console.error("Error:", data);
    res.writeHead(500);
    res.end("Failed to get token: " + JSON.stringify(data));
  }

  server.close();
});

server.listen(3456, () => {
  console.log("Listening on http://localhost:3456");
  console.log("Opening browser for Shopify OAuth...\n");
  execSync(`open "${authUrl}"`);
});
