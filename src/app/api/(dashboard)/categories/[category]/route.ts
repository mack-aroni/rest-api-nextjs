import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

/*
  UPDATE request for Category model
*/
export const PATCH = async (request: Request, context: {params: any}) => {
  // categoryId stored as URL context parameter
  const categoryId = context.params.category;
  try {
    // Category title stored in request body json
    const body = await request.json();
    const { title } = body;

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

    // checks for presence and validity of categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing categoryId"}),
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
    
    // find and validate presence of Category by categoryId and userId
    const category = await Category.findOne({_id: categoryId, user: userId })
    if (!category) {
      return new NextResponse(
        JSON.stringify({message: "Category not found"}),
        {status:404}
      );
    }

    // update Category with new title
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {title},
      {new: true}
    );

    // return successful request message
    return new NextResponse(
      JSON.stringify({
        message: "Category is updated",
        category: updatedCategory,
      }),
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in updating category: " + err.message,
      {status:500}
    );
  }
}

/*
  DELETE request for Category model
*/
export const DELETE = async (request: Request, context: {params: any}) => {
  // categoryId stored as URL context parameter
  const categoryId = context.params.category;
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

    // checks for presence and validity of categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing categoryId"}),
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

    // find and validate presence of Category by categoryId and userId
    const category = await Category.findOne({_id: categoryId, user: userId })
    if (!category) {
      return new NextResponse(
        JSON.stringify({message: "Category not found or does not belong to user"}),
        {status:404}
      );
    }

    // delete Category by categoryId
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    // return successful request message
    return new NextResponse(
      JSON.stringify({
        message: "Category is deleted",
        category: deletedCategory,
      }),
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in deleting category: " + err.message,
      {status:500}
    );
  }
}