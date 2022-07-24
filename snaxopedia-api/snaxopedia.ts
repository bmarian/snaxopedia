import { writeJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';
import { readJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';
import { Bug, Snaxopedia } from "./types.d.ts";

export const routeHandlerGetSnaxopedia = (): Response => {
  try {
    const snaxopedia = readJsonSync("./assets/snaxopedia.json");
    const stringifySnaxopedia = JSON.stringify(snaxopedia)
    console.log("Snaxopedia was successfully delivered!");
    return new Response(stringifySnaxopedia, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.log("Error while parsing snaxopedia: ", error);
    return new Response(error, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }
};

export const routeHandlerSaveBug = async (req: Request, match: URLPatternResult): Promise<Response> => {
  const bugName = decodeURI(match.pathname.groups.bugName);
  const requestBody = await req.json();
  const snaxopedia = readJsonSync("./assets/snaxopedia.json");

  console.log(`Updating bug ${bugName}`);
  const updatedSnaxopedia = (snaxopedia as Snaxopedia).map((snack: Bug) => {
    if (snack.name !== bugName) return snack;
    return requestBody;
  });

  writeJsonSync("./assets/snaxopedia.json", updatedSnaxopedia);
  return new Response("Successfully edited the snaxopedia.", { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
};

export const routeHandlerUpdateSelected = (_req: Request, match: URLPatternResult): Response => {
  const bugName = decodeURI(match.pathname.groups.bugName);
  const snaxopedia = readJsonSync("./assets/snaxopedia.json");

  console.log(`Selecting bug ${bugName}`);
  const updatedSnaxopedia = (snaxopedia as Snaxopedia).map((snack: Bug) => {
    return { ...snack, isSelected: snack.name === bugName };
  });
  writeJsonSync("./assets/snaxopedia.json", updatedSnaxopedia);

  return new Response("Successfully updated the selected bug.", { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
};