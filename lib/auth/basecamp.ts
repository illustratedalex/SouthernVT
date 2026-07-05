import "server-only";
import { getAuthenticatedOwnerUser } from "@/lib/auth/session";

function isAllowedBasecampReviewer(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const configured = (process.env.BASECAMP_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (configured.length > 0) {
    return configured.includes(normalizedEmail);
  }

  return normalizedEmail.endsWith("@southernvt.com");
}

export async function requireBasecampReviewerEmail() {
  const user = await getAuthenticatedOwnerUser();
  const email = user?.email ?? "";

  if (!email) {
    throw new Error("Basecamp reviewer login is required.");
  }

  if (!isAllowedBasecampReviewer(email)) {
    throw new Error("You are not authorized to review claims.");
  }

  return email;
}
