import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { BlockStack, Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import MediaImportCard from "app/components/video-library/MediaImportCard";
import VideoBox from "app/components/video-library/VideoBox";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export default function AppVideoLibrary() {
  return (
    <Page backAction={{ content: "Products", onAction: () => { history.back() } }} title="Video Library">
      <BlockStack gap="500">
        <MediaImportCard />
        <VideoBox />
      </BlockStack>
    </Page>
  );
}
