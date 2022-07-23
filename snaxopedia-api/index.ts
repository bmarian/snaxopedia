import { serve } from "https://deno.land/std@0.149.0/http/server.ts";
import { routeHandler as snaxopediaRouteHandler } from "./snaxopedia.ts";
import { imageRouteHandler as bugImageRouteHandler } from "./bugs.ts";

const SNAXOPEDIA_ROUTE = new URLPattern({ pathname: "/snaxopedia" });
const BUG_IMAGE_ROUTE = new URLPattern({ pathname: "/bugs/:fileName" });

const handler = async (req: Request): Promise<Response> => {
  const { url } = req;

  const snaxopediaMatch = SNAXOPEDIA_ROUTE.exec(url);
  if (snaxopediaMatch) return snaxopediaRouteHandler();

  const bugImageMatch = BUG_IMAGE_ROUTE.exec(url);
  if (bugImageMatch) return await bugImageRouteHandler(req, bugImageMatch);

  return new Response("Route not found", { status: 404 });
};

console.log("Listening on http://localhost:8000")
serve(handler, { port: 8000 });