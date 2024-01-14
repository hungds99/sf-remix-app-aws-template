import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";
import dynamodbClient from "./db.server.js";

export async function getSession() {
  try {
    const scan = new ScanCommand({
      TableName: Table.ShopSessions.tableName,
    });
    const results = await dynamodbClient.send(scan);

    console.log("results", results);
  } catch (error) {
    console.log("error", JSON.stringify(error, null, 2));
  }
}
