import {
  MONGODB_CLIENT,
  MONGODB_DB,
  MONGODB_BASE_URL,
  MONGODB_APP_NAME,
  MONGODB_GENERAL_APP_NAME,
  MONGODB_GENERAL_APP_KEY,
  PROVIDER_URL,
  IMAGEKIT_PUBLICKEY,
  IMAGEKIT_URLENDPOINT,
  IMAGEKIT_AUTHENTICATIONENTPOINT,
} from "../env.json";

export const Config = {
  mongoDb: {
    client: MONGODB_CLIENT,
    db: MONGODB_DB,
    baseUrl: MONGODB_BASE_URL,
    appName: MONGODB_APP_NAME,
    generalAppName: MONGODB_GENERAL_APP_NAME,
    generalAppApiKey: MONGODB_GENERAL_APP_KEY,
  },
  providerUrl: PROVIDER_URL,
};

export const urlEndpoint = IMAGEKIT_URLENDPOINT;
export const publicKey = IMAGEKIT_PUBLICKEY;
export const authenticationEndpoint = IMAGEKIT_AUTHENTICATIONENTPOINT;

export const INJECTED_JAVASCRIPT = `(function() {
    const elementsHeader = document.getElementsByClassName('navbar-header');
    while (elementsHeader.length > 0) elementsHeader[0].remove();
  })();`;

export const couponTypes = [
  { label: "Flat", value: "flat" },
  { label: "Percentage", value: "percentage" },
];
