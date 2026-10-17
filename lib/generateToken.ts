import jwt, { type JwtPayload } from "jsonwebtoken";
import "server-only";

export type UserRole = "USER" | "ADMIN";

export type TokenPayload = {
  userId: string;
  role: UserRole;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

// Generate a JWT
export function generateToken(userId: string, role: UserRole): string {
  return jwt.sign({ role }, getJwtSecret(), {
    subject: userId,
    expiresIn: "7d",
  });
}

// Verify a JWT
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {});

    if (typeof decoded === "string") {
      return null;
    }

    const payload = decoded as JwtPayload;

    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "USER" && payload.role !== "ADMIN")
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
