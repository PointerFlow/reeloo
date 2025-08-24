import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { BlockStack, Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import MediaImportCard from "app/components/video-library/MediaImportCard";
import VideoBox from "app/components/video-library/VideoBox";
import { deleteVideo, updateVideo } from "app/actions/video.action";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  switch (request.method) {
    case "DELETE": {
      const formData = await request.formData();
      const id = formData.get("id");
      try {
        const response = await deleteVideo(id as string);
        if (response) {
          return { success: true };
        }
      } catch (error) {
        return { success: false };
      }
    }
    case "PATCH": {
      const formData2 = await request.formData();
      const vid = formData2.get("id");
      const title = formData2.get("title") as string;
      const status = formData2.get("status") as string;
      const products = formData2.getAll("products") as string[];
      try {
        const result = await updateVideo(vid as string, title, status, products);
        if (result) {
          return { success: true }
        }
      } catch (e) {
        return e;
      }
    }
      break;
  }

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
