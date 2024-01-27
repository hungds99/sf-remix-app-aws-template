import { restResources } from '@shopify/shopify-api/rest/admin/2024-01';
import '@shopify/shopify-app-remix/adapters/node';
import {
  AppDistribution,
  DeliveryMethod,
  LATEST_API_VERSION,
  shopifyApp,
} from '@shopify/shopify-app-remix/server';
import { DynamoDBSessionStorage } from '@shopify/shopify-app-session-storage-dynamodb';
import { Config } from 'sst/node/config';
import { Table } from 'sst/node/table';

const shopify = shopifyApp({
  apiKey: Config.SHOPIFY_API_KEY,
  apiSecretKey: Config.SHOPIFY_API_SECRET,
  apiVersion: LATEST_API_VERSION,
  scopes: Config.SHOPIFY_SCOPES?.split(','),
  appUrl: Config.APP_URL,
  authPathPrefix: '/auth',
  sessionStorage: new DynamoDBSessionStorage({
    sessionTableName: Table.ShopSessions.tableName,
    shopIndexName: 'shopIndex',
  }),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
