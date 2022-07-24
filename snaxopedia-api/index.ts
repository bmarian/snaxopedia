import { serve } from "https://deno.land/std@0.149.0/http/server.ts";
import { 
  routeHandlerGetSnaxopedia as snaxopediaRouteHandler, 
  routeHandlerSaveBug as saveBugRootHandler,
  routeHandlerUpdateSelected as updateSelectedRootHandler
} from "./snaxopedia.ts";
import { imageRouteHandler as bugImageRouteHandler } from "./bugs.ts";
import { imageRouteHandler as locationImageRouteHandler } from "./locations.ts";

const SNAXOPEDIA_ROUTE = new URLPattern({ pathname: "/snaxopedia" });
const BUG_IMAGE_ROUTE = new URLPattern({ pathname: "/bugs/:fileName" });
const LOCATION_IMAGE_ROUTE = new URLPattern({ pathname: "/locations/:fileName" });
const SAVE_BUG_ROUTE = new URLPattern({ pathname: "/snaxopedia/:bugName" });
const UPDATE_SELECTED_ROUTE = new URLPattern({ pathname: "/snaxopedia/selected/:bugName" });

const handler = async (req: Request): Promise<Response> => {
  const { url } = req;

  const snaxopediaMatch = SNAXOPEDIA_ROUTE.exec(url);
  if (snaxopediaMatch) return snaxopediaRouteHandler();

  const saveBugMatch = SAVE_BUG_ROUTE.exec(url);
  if (saveBugMatch) return saveBugRootHandler(req, saveBugMatch);

  const updateSelectedMatch = UPDATE_SELECTED_ROUTE.exec(url);
  if (updateSelectedMatch) return updateSelectedRootHandler(req, updateSelectedMatch);

  const bugImageMatch = BUG_IMAGE_ROUTE.exec(url);
  if (bugImageMatch) return await bugImageRouteHandler(req, bugImageMatch);

  const locationImageMatch = LOCATION_IMAGE_ROUTE.exec(url);
  if (locationImageMatch) return await locationImageRouteHandler(req, locationImageMatch);

  return new Response("Route not found", { status: 404 });
};

console.log("Listening on http://localhost:8000")
serve(handler, { port: 8000 });