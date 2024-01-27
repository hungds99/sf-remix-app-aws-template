import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamodbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export default dynamodbClient;
