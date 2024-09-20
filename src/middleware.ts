import { NextResponse } from "next/server"
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

export const config = {
  matcher: "/api/:path*"
}

/*
  MAIN middleware function
*/
export default function middleware(request: Request) {
  // only log requests made to "/api/blogs"
  if (request.url.includes("/api/blogs")) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }

  // only check auth for requests to "/api/blogs"
  const authResult = authMiddleware(request);
  if (!authResult?.isValid && request.url.includes("/api/blogs")) {
    return new NextResponse(
      JSON.stringify({message: "Unauthorized"}),
      {status: 401}
    );
  }
  
  return NextResponse.next();
}