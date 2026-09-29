import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";

import { taskSchema } from "../../../schemas/task";


export async function POST(
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

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

    if (!assignedUser) {
      return NextResponse.json(
        {
          message:
            "Assigned user not found",
        },
        {
          status: 404,
        }
      );
    }

    
    const task =
      await db.task.create({
        data: {
          title,

          description:
            description || null,

          dueDate: dueDate
            ? new Date(dueDate)
            : null,

          priority,

          status,

          // Selected user gets the task
          userId,
        },

        // Return assigned user
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

   
    return NextResponse.json(
      {
        message:
          "Task created successfully",

        task,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create task error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create task",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(
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

  
    const { searchParams } =
      new URL(request.url);

  
    const search =
      searchParams
        .get("search")
        ?.trim() || "";

   
    const pageParam =
      Number(
        searchParams.get("page")
      );

    const page =
      Number.isInteger(pageParam) &&
      pageParam > 0
        ? pageParam
        : 1;

    
    const limitParam =
      Number(
        searchParams.get("limit")
      );

    const limit =
      Number.isInteger(limitParam) &&
      limitParam > 0 &&
      limitParam <= 100
        ? limitParam
        : 10;

   
    const skip =
      (page - 1) * limit;

   
    const where = {
      // SALES_USER can see only
      // tasks assigned to himself
      ...(authUser.role ===
      "SALES_USER"
        ? {
            userId:
              authUser.userId,
          }
        : {}),

      // Search
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode:
                    "insensitive" as const,
                },
              },

              {
                description: {
                  contains: search,
                  mode:
                    "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    
    const [tasks, total] =
      await Promise.all([
        db.task.findMany({
          where,

          // Assigned user details
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

          orderBy: {
            createdAt: "desc",
          },

          skip,

          take: limit,
        }),

        db.task.count({
          where,
        }),
      ]);

   
    const totalPages =
      Math.ceil(
        total / limit
      );

  
    return NextResponse.json({
      tasks,

      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch tasks",
      },
      {
        status: 500,
      }
    );
  }
}