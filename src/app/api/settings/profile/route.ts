import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getAuthUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";

import { profileSchema } from "../../../../schemas/settings";

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
      profileSchema.safeParse(body);

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

    const user =
      await db.user.update({
        where: {
          id: authUser.userId,
        },

        data: {
          name: result.data.name,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

    return NextResponse.json({
      message:
        "Profile updated successfully",

      user,
    });
  } catch (error) {
    console.error(
      "Profile update error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}