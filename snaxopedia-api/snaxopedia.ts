import snaxopedia from "./assets/snaxopedia.json" assert { type: "json" };

export const routeHandler = (): Response => {
  try {
    const stringifySnaxopedia = JSON.stringify(snaxopedia)
    console.log("Snaxopedia was successfully delivered!");
    return new Response(stringifySnaxopedia, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.log("Error while parsing snaxopedia: ", error);
    return new Response(error, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }
};