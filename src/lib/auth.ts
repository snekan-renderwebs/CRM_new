import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export type UserRole =
  | "ADMIN"
  | "SALES_MANAGER"
  | "SALES_USER";

export type JwtPayload = {
  userId: string;
  role: UserRole;
};

export function getAuthUser(
  request: NextRequest
): JwtPayload | null {
  const token =
    request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    return decoded;
  } catch (error) {
    console.error(
      "JWT verification error:",
      error
    );

    return null;
  }
}

export function hasRole(
  user: JwtPayload,
  roles: UserRole[]
) {
  return roles.includes(user.role);
}