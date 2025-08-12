import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
  BlockStack,
  Button,
  ButtonGroup,
  InlineGrid,
  Page,
  Text,
} from "@shopify/polaris";
import { RefreshIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import VideoCard from "app/components/home/VideoCard";
import Analatics from "app/components/home/Analatics";
import FeedBackCard from "app/components/home/FeedBackCard";
import FeedsLibrary from "app/components/home/FeedsLibrary";
import Table from "app/components/home/Table";
import Table2 from "app/components/home/Table2";
import Support from "app/components/home/Support";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return null;
};
export default function Index() {
  return (
    <Page title="Hello, Alamin" subtitle="Welcome to Reeloo Shoppable Video">
      <TitleBar title="Reeloo Shoppable Video" />
      <BlockStack gap="500">
        <Banner
          title="Enable Reeloo Shoppable Video"
          tone="warning"
          onDismiss={() => { }}
        >
          <BlockStack gap="300">
            <Text as="p" variant="bodyMd">
              To ensure your shoppable videos and custom feeds display
              seamlessly, please activate the Reeloo Embed in your theme
              settings.
            </Text>
            <ButtonGroup>
              <Button variant="primary">Enable Now</Button>
              <Button icon={RefreshIcon}>Refresh</Button>
            </ButtonGroup>
          </BlockStack>
        </Banner>
        <VideoCard />
        <Analatics />
        <FeedBackCard />
        <FeedsLibrary />
        <InlineGrid gap="400" columns={2}>
          <Table />
          <Table2 />
        </InlineGrid>
        <Support />
      </BlockStack>
    </Page>
  );
}
