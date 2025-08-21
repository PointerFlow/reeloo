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
import { getAllVideos } from "./actions/video.action";
import { getAllFeeds } from "./actions/feeds.action";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const shopifyProducts = await fetchAllData(admin, getAllProductsQuery);
  const shopData: IShopData = await executeGraphQL(admin, getShopQuery);
  const videos = await getAllVideos(shopData.shop.id as string);
  const feeds = await getAllFeeds(shopData.shop.id as string);
  return { shopifyProducts, shopData, allVideos: videos.data.videos, allFeeds: feeds.data.feeds };
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

