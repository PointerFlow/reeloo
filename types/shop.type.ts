export interface IShopData {
  shop: {
    id: string;
    name: string;
    email: string;
    myshopifyDomain: string;
    currencyCode: string;
    timezoneOffset: number;
    primaryDomain: {
      url: string;
      host: string;
      sslEnabled: boolean;
    };
  };
}