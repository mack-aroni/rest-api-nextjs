import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category"
import Blog from "@/lib/models/blog"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

/*
  GET request for SINGLE Blog model: For loading individual Blogs
 */
export const GET = async (request: Request, context: {params: any}) => {
  // blogId stored as URL context parameter
  const blogId = context.params.blog;
  try {
    // userId and categoryId stored as URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

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

    // checks for presence and validity of blogId
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing blogId"}),
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

    // find and validate presence of Category by categoryId
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({message: "Category not found"}),
        {status:404}
      );
    }

    // find and validate presence of a Blog matching all parameters
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({message: "Blog not found"}),
        {status:404}
      );
    }

    return new NextResponse(
      JSON.stringify({ blog }), 
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in fetching a blog: " + err.message,
      {status:500}
    );
  }
}

/*
  UPDATE request for Blog model
*/
export const PATCH = async (request: Request, context: {params: any}) => {
  // blogId stored as URL context parameter
  const blogId = context.params.blog;
  try {
    // Blog title and description are stored in request body json
    const body = await request.json();
    const { title, description } = body;

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

    // checks for presence and validity of blogId
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing blogId"}),
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
    const blog = await Blog.findOne({_id: blogId, user: userId});
    if (!blog) {
      return new NextResponse(
        JSON.stringify({message: "Blog not found"}),
        {status:404}
      );
    }

    // update Blog with new title and description
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {title, description},
      {new: true},
    );

    // return successful request message
    return new NextResponse(
      JSON.stringify({
        message: "Blog updated",
        blog: updatedBlog,
      }), 
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error updating a blog: " + err.message,
      {status:500}
    );
  }
}

/*
  DELETE request for Blog model
*/
export const DELETE = async (request: Request, context: {params: any}) => {
  // blogId stored as URL context parameter
  const blogId = context.params.blog;
  try {
    // userId stored as URL parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    // checks for presence or validity of userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing userId"}),
        {status:400}
      );
    }

    // checks for presence and validity of blogId
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing blogId"}),
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

    // find and validate presence of Blog by blogId and userId
    const blog = await Blog.findOne({_id: blogId, user: userId});
    if (!blog) {
      return new NextResponse(
        JSON.stringify({message: "Blog not found"}),
        {status:404}
      );
    }
    // delete Blog by blogId
    await Blog.findByIdAndDelete(blogId);

    // return successful request message
    return new NextResponse(
      JSON.stringify({message: "Blog is deleted"}),
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in deleting category: " + err.message,
      {status:500}
    );
  }
}