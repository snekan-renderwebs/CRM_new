import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";

import { getAuthUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";

import {
  passwordSchema,
} from "../../../../schemas/settings";

export async function PUT(
  request: NextRequest
) {
  try {
    const authUser =
      await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const result =
      passwordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      currentPassword,
      newPassword,
    } = result.data;

    const user =
      await db.user.findUnique({
        where: {
          id: authUser.userId,
        },

        select: {
          id: true,
          password: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message:
            "Current password is incorrect",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await db.user.update({
      where: {
        id: authUser.userId,
      },

      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message:
        "Password updated successfully",
    });
  } catch (error) {
    console.error(
      "Password update error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update password",
      },
      {
        status: 500,
      }
    );
  }
}