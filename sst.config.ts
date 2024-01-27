import type { SSTConfig } from 'sst';
import { Config, RemixSite, Table } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'sf-remix-app-aws-template',
      region: 'ap-southeast-1',
      stage: 'local',
    };
  },
  stacks(app) {
    // Remix Site
    app.stack(function Site({ stack }) {
      // Shop Sessions Table
      const shopSessionsTable = new Table(stack, 'ShopSessions', {
        fields: {
          id: 'string',
          shop: 'string',
          state: 'string',
          isOnline: 'string',
          scope: 'string',
          expires: 'string',
          accessToken: 'string',
          userId: 'string',
        },
        primaryIndex: { partitionKey: 'id' },
        globalIndexes: {
          shopIndex: { partitionKey: 'shop' },
        },
      });

      // Configure SSM environment variables
      const SHOPIFY_API_KEY = new Config.Secret(stack, 'SHOPIFY_API_KEY');
      const SHOPIFY_API_SECRET = new Config.Secret(stack, 'SHOPIFY_API_SECRET');
      const SHOPIFY_SCOPES = new Config.Parameter(stack, 'SHOPIFY_SCOPES', {
        value: 'write_products',
      });
      const APP_URL = new Config.Parameter(stack, 'APP_URL', {
        value: 'https://7555-14-241-123-88.ngrok-free.app',
      });

      const site = new RemixSite(stack, 'site', {
        bind: [shopSessionsTable, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_SCOPES, APP_URL],
      });

      stack.addOutputs({
        url: site.url,
        table: shopSessionsTable.tableName,
      });
    });

    // Remove all resources when non-prod stages are removed
    // if (app.stage !== "prod") {
    app.setDefaultRemovalPolicy('destroy');
    // }
  },
} satisfies SSTConfig;
