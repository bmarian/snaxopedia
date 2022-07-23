import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { routeHandler as snaxopediaRouteHandler } from "./snaxopedia.ts";

const SNAXOPEDIA_ROUTE = new URLPattern({ pathname: "/snaxopedia" });

const handler = (req: Request): Response => {
  const { url } = req;
  if (SNAXOPEDIA_ROUTE.exec(url)) return snaxopediaRouteHandler();

  return new Response("Route not found", { status: 404 });
};

console.log("Listening on http://localhost:8000")
serve(handler);