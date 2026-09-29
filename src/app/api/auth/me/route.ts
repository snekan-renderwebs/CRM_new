import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const decoded = getAuthUser(request);

    if (!decoded) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Auth verification error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}