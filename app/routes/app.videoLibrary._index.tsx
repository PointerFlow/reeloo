import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { BlockStack, Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import MediaImportCard from "app/components/video-library/MediaImportCard";
import VideoBox from "app/components/video-library/VideoBox";
import { getAllProductsQuery } from "app/graphql/queries";
import { useLoaderData } from "@remix-run/react";
import { fetchAllData } from "app/graphql/graphql";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const shopifyProducts = await fetchAllData(admin, getAllProductsQuery);

  return { shopifyProducts };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export default function AppVideoLibrary() {
  const { shopifyProducts } = useLoaderData<{ shopifyProducts: any }>();

  console.log("products", shopifyProducts);
  return (
    <Page backAction={{ content: "Products", url: "#" }} title="Video Library">
      <BlockStack gap="500">
        <MediaImportCard />
        <VideoBox />
      </BlockStack>
    </Page>
  );
}
