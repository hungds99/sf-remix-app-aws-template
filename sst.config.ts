import type { SSTConfig } from "sst";
import { RemixSite, Table } from "sst/constructs";

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
      // Shop Sessions
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

      const site = new RemixSite(stack, "site", {
        bind: [shopSessionsTable],
        environment: {
          SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY!,
          SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET!,
          SCOPES: process.env.SCOPES!,
          HOST: process.env.HOST || "https://d52r02gcc13ea.cloudfront.net",
          SHOPIFY_APP_URL: "https://d52r02gcc13ea.cloudfront.net"
        },
      });

      site.props.environment = {
        ...site.props.environment,
        SHOPIFY_APP_URL: site.url || "https://d52r02gcc13ea.cloudfront.net",
      };

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
