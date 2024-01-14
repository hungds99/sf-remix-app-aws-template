import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";

const db = DynamoDBDocumentClient.from(
    new DynamoDBClient({
    })
  );

export async function getSession() {
  try {
    console.log("table name: ", Table.ShopSessions.tableName)

    // console.log("data", db);
    const scan = new ScanCommand({
      TableName: Table.ShopSessions.tableName,
    });
    const results = await db.send(scan);

    console.log("results", results);
  } catch (error) {
    console.log("error", JSON.stringify(error, null, 2));
  }
}
