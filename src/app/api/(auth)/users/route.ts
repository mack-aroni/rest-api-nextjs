import connect from "@/lib/db"
import User from "@/lib/models/users";
import { Types } from "mongoose"
import { NextResponse } from "next/server"

const ObjectId = Types.ObjectId;

/*
  GET request for User models
*/
export const GET = async () => {
  try {
    // make database connection
    await connect();
  
    // find all Users
    const users = await User.find();

    // return successful request message
    return new NextResponse(
      JSON.stringify(users),
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in fetching Users" + err.message,
      {status: 500}
    );
  }
}

/*
  POST request for User model
*/
export const POST = async (request: Request) => {
  try {
    // User schema variables are stored in request json
    const body = await request.json();
    
    // TODO

    // make database connection
    await connect();

    // creates new User with body json and saves to database
    const newUser = new User(body);
    await newUser.save();

    // return successful request message
    return new NextResponse(
      JSON.stringify({message: "User is created", user: newUser}),
        {status: 200}
    );
  } catch (err: any) {
    return new NextResponse("Error in creating user: " + err.message, {status: 500});
  }
}

/*
  UPDATE request for User model
*/
export const PATCH = async (request: Request) => {
  try {
    // Users userId and newUsername stored in request body json
    const body = await request.json();
    const { userId, newUsername } = body;

    // checks for userId and newUsername presence
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({message: "ID or new username not found"}),
        {status:400}
      );
    }

    // checks userId validity
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid userID"}),
        {status:400}
      );
    }

    // make database connection
    await connect();

    // find and validite presence of User by userId
    const user = await User.findById(userId);
    if (!user) {
        return new NextResponse(
        JSON.stringify({message: "User not found"}),
        {status:404}
      );
    }

    // update User using userId with newUsername
    const updatedUser = await User.findOneAndUpdate(
      {_id: userId},
      {username: newUsername},
      {new: true}
    );

    // return successful request message
    return new NextResponse(
      JSON.stringify({message: "User updated", user: updatedUser}),
      {status:200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in updating user: " + err.message,
      {status:500}
    );
  }
}

/*
  DELETE request for User model
*/
export const DELETE = async (request: Request) => {
  try {
    // userId stored as URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // checks for presence or validity of userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing userID"}),
        {status:400}
      );
    }

    // make database connection
    await connect();

    // delete User using userId
    const deletedUser = await User.findByIdAndDelete(userId);
    // check if User was found and deleted
    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({message: "User not found"}),
        {status:404}
      );
    }
    
    // return successful request message
    return new NextResponse(
      JSON.stringify({message: "User deleted", user: deletedUser}),
      {status:200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in updating user: " + err.message,
      {status:500}
    );
  }
}