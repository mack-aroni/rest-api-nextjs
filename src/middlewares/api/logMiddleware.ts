export function logMiddleware(request: Request) {
  return {response: request.method + " " + request.url};
}