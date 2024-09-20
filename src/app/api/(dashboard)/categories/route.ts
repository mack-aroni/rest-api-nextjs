import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

/*
  GET request for Category models
*/
export const GET = async (request: Request) => {
  try {
    // userId stored as URL parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // checks for presence and validity of userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing userId"}),
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

    // find Cateogry by userId
    const categories = await Category.find({userId});

    // return successful request message
    return new NextResponse(
      JSON.stringify(categories),
      {status: 200}
    );

  } catch (err: any) {
    return new NextResponse(
      "Error in fetching categories: " + err.message,
      {status:500}
    );
  }
}

/*
  POST request for Category model
*/
export const POST = async (request: Request) => {
  try {
    // userId stored as URL parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Category title stored in request body json
    const { title } = await request.json();

    // checks for presence and validity of userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing userId"}),
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

    // create new Category with title and saves to database
    const newCategory = new Category({
      title,
      user: userId,
    });
    await newCategory.save();

    // return successful request message
    return new NextResponse(
      JSON.stringify({
        message: "Category is created", 
        category: newCategory,
      }),
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in creating category: " + err.message,
      {status:500}
    );
  }
}