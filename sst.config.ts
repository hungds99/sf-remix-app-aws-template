import type { SSTConfig } from "sst";
import { Config, RemixSite, Table } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "sf-remix-app-aws-template",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    // Remix Site
    app.stack(function Site({ stack }) {
      // Shop Sessions Table
      const shopSessionsTable = new Table(stack, "ShopSessions", {
        fields: {
          id: "string",
          shop: "string",
          state: "string",
          isOnline: "string",
          scope: "string",
          expires: "string",
          accessToken: "string",
          userId: "string",
        },
        primaryIndex: { partitionKey: "id" },
        globalIndexes: {
          shopIndex: { partitionKey: "shop" },
        },
      });

      // Configure SSM environment variables
      const SHOPIFY_API_KEY = new Config.Secret(stack, "SHOPIFY_API_KEY");
      const SHOPIFY_API_SECRET = new Config.Secret(stack, "SHOPIFY_API_SECRET");
      const SHOPIFY_APP_URL = new Config.Parameter(stack, "SHOPIFY_APP_URL", {
        value: "https://d2cfbqdrlpjx23.cloudfront.net",
      });
      const SCOPES = new Config.Parameter(stack, "SCOPES", {
        value:
          "write_payment_customizations,write_delivery_customizations,read_customers,read_products,read_shipping,write_discounts,read_discounts,read_metaobjects,read_delivery_customizations",
      });

      const site = new RemixSite(stack, "site", {
        bind: [
          shopSessionsTable,
          SHOPIFY_API_KEY,
          SHOPIFY_API_SECRET,
          SHOPIFY_APP_URL,
          SCOPES,
        ],
      });

      stack.addOutputs({
        url: site.url,
      });

      return {
        site,
        shopSessionsTable,
      };
    });

    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
