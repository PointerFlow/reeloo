import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Layout, Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  return null;
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  return (
    <Page>
      <TitleBar title="Reeloo Shoppable Video" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Text as="h2" variant="headingLg">
              Hello, <span className="text-2xl font-bold">Jaz</span>

            </Text>
            <Text as="p" variant="bodyMd">
              Welcome to Reeloo Shoppable Video
            </Text>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
