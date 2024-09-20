import connect from "@/lib/db"
import User from "@/lib/modals/users";
import {Types} from "mongoose"
import { NextResponse } from "next/server"

const ObjectId = Types.ObjectId;

export const GET = async () => {
  try {
    await connect();

    const users = await User.find();
    return new NextResponse(JSON.stringify(users), {status: 200})
  } catch (err: any) {
    return new NextResponse(
      "Error in fetching Users" + err.message,
      {status: 500}
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({message: "User is created", user: newUser}),
        {status: 200}
    );
  } catch (err: any) {
    return new NextResponse("Error in creating User" + err.message, {status: 500});
  }
}

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const {userId, newUsername} = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({message: "ID or new username not found"}),
        {status:400}
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid UserID"}),
        {status:400}
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {username: newUsername},
      {new: true}
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({message: "User not found"}),
        {status:404}
      );
    }

    return new NextResponse(
      JSON.stringify({message: "User updated", user: updatedUser}),
      {status:200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in updating user" + err.message,
      {status:500}
    );
  }
}

export const DELETE = async (request: Request) => {
  try {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({message: "ID not found"}),
        {status:400}
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid UserID"}),
        {status:400}
      );
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({message: "User not found"}),
        {status:404}
      );
    }
    
    return new NextResponse(
      JSON.stringify({message: "User deleted", user: deletedUser}),
      {status:200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in updating user" + err.message,
      {status:500}
    );
  }
}