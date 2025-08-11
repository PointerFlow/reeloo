import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { executeGraphQL, fetchAllData } from "./graphql/graphql";
import { getAllProductsQuery, getShopQuery } from "./graphql/queries";
import { authenticate } from "./shopify.server";
import { IShopData } from "types/shop.type";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const shopifyProducts = await fetchAllData(admin, getAllProductsQuery);
  const shopData: IShopData = await executeGraphQL(admin, getShopQuery);
  return { shopifyProducts, shopData };
};

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

