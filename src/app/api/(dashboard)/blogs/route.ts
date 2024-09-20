import connect from "@/lib/db"
import User from "@/lib/models/users";
import Category from "@/lib/models/category"
import Blog from "@/lib/models/blog"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

/*
  GET request for Blog models: For listing multiple Blogs
*/
export const GET = async (request: Request) => {
  try {
    // userId and categoryId stored as url parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // additional parameters for filtering stored as URL parameters
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const pageLimit = parseInt(searchParams.get("page") || "10");

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
    const category = await Category.findOne({_id: categoryId, user: userId})
    if (!category) {
      return new NextResponse(
        JSON.stringify({message: "Category not found"}),
        {status:404}
      );
    }

    // creates filter of userId and categoryId
    const filter: any = {
      user: userId,
      category: categoryId,
    }

    // adds filter for keyword searches if present
    if (searchKeywords) {
      filter.$or = [
        {title: {$regex: searchKeywords, $options: "i"}},
        {description: {$regex: searchKeywords, $options: "i" }}
      ]
    }

    // adds filter for date ranges if present
    // (between dates, after date, before date)
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate)
      }
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate)
      }
    }

    // function for pagination
    const skip = (page - 1) * pageLimit;

    // finds all Blogs matching filters, if None returns []
    const blogs = await Blog.find(filter)
                            .sort({createdAt: "asc"})
                            .skip(skip)
                            .limit(pageLimit);
    
    // return successful request message
    return new NextResponse(
      JSON.stringify({blogs}),
      {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in fetching blogs: " + err.message,
      {status:500}
    );
  }
}

/*
  POST request for Blog model
*/
export const POST = async (request: Request) => {
  try {
    // Blog title and description are stored in request body json
    const body = await request.json()
    const { title, description } = body

    // userId and categoryId stored as url parameters
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

    // create new Blog with all required data and saves to database
    const newBlog = new Blog({
      title,
      description,
      user: userId,
      category: categoryId
    });
    await newBlog.save();

    // return successful request message
    return new NextResponse(
      JSON.stringify(
        {message: "Blog is created", blog: newBlog}),
        {status: 200}
    );
  } catch (err: any) {
    return new NextResponse(
      "Error in creating blog: " + err.message,
      {status:500}
    );
  }
}