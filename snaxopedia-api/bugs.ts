import { serveFile } from 'https://deno.land/std@0.149.0/http/file_server.ts';

export const imageRouteHandler = async (req: Request, match: URLPatternResult): Promise<Response> => {
  const fileName = decodeURI(match.pathname.groups.fileName);
  console.log(`Trying to get the file for: ${fileName}`);

  return await serveFile(req, `./assets/bugs/${fileName}`);
};