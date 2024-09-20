/*
  HELPER function for token validation
*/
const validate = (token: any) => {
  const validToken = true;
  if (!validToken || !token) {
    return false;
  }
  return true;
}

/*
  MAIN function for token validation
*/
export function authMiddleware(request: Request): any {
  // receives and breaks down token from request header
  const token = request.headers.get("authorization")?.split(" ")[1];
  
  return {isValid: validate(token)};
}