/**
 * Square billing client — server-side only.
 * Never import this from client components.
 *
 * Required env vars:
 *   SQUARE_ACCESS_TOKEN      — OAuth access token or personal access token
 *   SQUARE_LOCATION_ID       — Square location ID for the seller account
 *   SQUARE_ENVIRONMENT       — "sandbox" (default) or "production"
 *   SQUARE_WEBHOOK_SIGNATURE_KEY — webhook signature verification key (optional)
 */

import { SquareClient, SquareEnvironment, WebhooksHelper } from "square";

export type SquareEnvStatus = {
  configured: boolean;
  environment: "sandbox" | "production";
  missing: string[];
};

export function getSquareEnvStatus(): SquareEnvStatus {
  const missing: string[] = [];

  if (!process.env.SQUARE_ACCESS_TOKEN?.trim()) missing.push("SQUARE_ACCESS_TOKEN");
  if (!process.env.SQUARE_LOCATION_ID?.trim()) missing.push("SQUARE_LOCATION_ID");

  const rawEnv = (process.env.SQUARE_ENVIRONMENT ?? "sandbox").toLowerCase();
  const environment: "sandbox" | "production" = rawEnv === "production" ? "production" : "sandbox";

  return { configured: missing.length === 0, environment, missing };
}

export function isSquareConfigured(): boolean {
  return getSquareEnvStatus().configured;
}

let _client: SquareClient | null = null;

/** Returns a singleton Square SDK client. Throws if env vars are missing. */
export function getSquareClient(): SquareClient {
  if (_client) return _client;

  const { configured, environment, missing } = getSquareEnvStatus();
  if (!configured) {
    throw new Error(`Square is not configured. Missing env vars: ${missing.join(", ")}`);
  }

  _client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN!,
    environment: environment === "production" ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  });

  return _client;
}

export function getSquareLocationId(): string {
  const id = process.env.SQUARE_LOCATION_ID?.trim();
  if (!id) throw new Error("SQUARE_LOCATION_ID is not set.");
  return id;
}

/**
 * Verifies a Square webhook signature.
 * Returns true if the signature is valid, false if the key is not set (treated as unconfigured),
 * throws if the key is set but the signature is invalid.
 */
export async function verifySquareWebhookSignature(
  body: string,
  signature: string | null,
  requestUrl: string,
): Promise<boolean> {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim();
  if (!key) return false;
  if (!signature) return false;

  return WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey: key,
    notificationUrl: requestUrl,
  });
}
