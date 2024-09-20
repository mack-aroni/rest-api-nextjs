/*
  MAIN function for returning logs of requests
*/
export function logMiddleware(request: Request) {
  return {response: request.method + " " + request.url};
}