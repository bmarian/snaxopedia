import snaxopedia from "./assets/snaxopedia.json" assert { type: "json" };

export const routeHandler = (): Response => {
  return new Response(JSON.stringify(snaxopedia));
};