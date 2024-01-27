import { GetCommand } from "@aws-sdk/lib-dynamodb";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Table } from "sst/node/table";
import dynamodbClient from "../db.server.js";
import { authenticate } from "../shopify.server.js";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, session, admin } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        const sessionCommand = new GetCommand({
          TableName: Table.ShopSessions.tableName,
          Key: {
            id: session.id,
          },
        });
        await dynamodbClient.send(sessionCommand);
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
