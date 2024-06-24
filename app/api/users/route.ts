import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

//Define a schema for input validation
const userSchema = z.object({
  firstName: z.string().min(1, "Username is required").max(50),
  lastName: z.string().min(1, "Username is required").max(50),
  username: z.string().min(1, "Username is required").max(50),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, username, password } =
      userSchema.parse(body);

    //check if email already exists
    const existingUserByEmail = await db.users.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    //check if username already exists
    const existingUserByUsername = await db.users.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.users.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
