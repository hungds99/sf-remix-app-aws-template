import type { LoaderFunctionArgs } from '@remix-run/node';
import { authenticate } from '../shopify.server.js';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};
