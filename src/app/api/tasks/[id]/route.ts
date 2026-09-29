import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";

import { taskSchema } from "../../../../schemas/task";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};



export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {

    // JWT protection
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

    const { id } = await params;


   
    const task =
      await db.task.findFirst({
        where: {
          id,

          ...(authUser.role === "SALES_USER"
            ? {
                userId:
                  authUser.userId,
              }
            : {}),
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });


    if (!task) {
      return NextResponse.json(
        {
          message: "Task not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({
      task,
    });

  } catch (error) {

    console.error(
      "Get task error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch task",
      },
      {
        status: 500,
      }
    );
  }
}



export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {

    // JWT protection
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

    const { id } = await params;


   
    const existingTask =
      await db.task.findFirst({
        where: {
          id,

          ...(authUser.role === "SALES_USER"
            ? {
                userId:
                  authUser.userId,
              }
            : {}),
        },
      });


    if (!existingTask) {
      return NextResponse.json(
        {
          message: "Task not found",
        },
        {
          status: 404,
        }
      );
    }


    
    const body =
      await request.json();


    
    const validation =
      taskSchema.safeParse(body);


    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            "Validation failed",

          errors:
            validation.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        }
      );
    }


   
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      userId,
    } = validation.data;


   
    const assignedUser =
      await db.user.findUnique({
        where: {
          id: userId,
        },
      });


    if (!assignedUser) {
      return NextResponse.json(
        {
          message:
            "Assigned user not found",
        },
        {
          status: 400,
        }
      );
    }


   
    const task =
      await db.task.update({
        where: {
          id,
        },

        data: {
          title,

          description:
            description || null,

          dueDate:
            dueDate
              ? new Date(dueDate)
              : null,

          priority,

          status,

          userId,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });


    return NextResponse.json({
      message:
        "Task updated successfully",

      task,
    });

  } catch (error) {

    console.error(
      "Update task error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update task",
      },
      {
        status: 500,
      }
    );
  }
}



export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {

    // JWT protection
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

    const { id } = await params;


   
    const existingTask =
      await db.task.findFirst({
        where: {
          id,

          ...(authUser.role === "SALES_USER"
            ? {
                userId:
                  authUser.userId,
              }
            : {}),
        },
      });


    if (!existingTask) {
      return NextResponse.json(
        {
          message: "Task not found",
        },
        {
          status: 404,
        }
      );
    }


    
    await db.task.delete({
      where: {
        id,
      },
    });


    return NextResponse.json({
      message:
        "Task deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete task error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to delete task",
      },
      {
        status: 500,
      }
    );
  }
}