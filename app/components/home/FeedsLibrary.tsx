import {
  BlockStack,
  Button,
  Card,
  Divider,
  EmptyState,
  InlineGrid,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { UploadIcon, OrderDraftIcon } from "@shopify/polaris-icons";
import fullVideo from "../../Images/full_video.png"
import emptyVideo from "../../Images/emty_video.png"

export default function FeedsLibrary() {
  return (
    <InlineGrid gap="400" columns={2}>
      <Card>
        <BlockStack gap="300">
          <InlineStack blockAlign="center" align="space-between">
            <Text variant="headingSm" as="h6">
              Video Library
            </Text>
            <Button>Go to Video Libray</Button>
          </InlineStack>
          <Divider />
        </BlockStack>

        <EmptyState
          heading="Your video library is empty"
          action={{ icon: UploadIcon, content: "Upload Video" }}
          image={emptyVideo}
        >
          <Text as="p" variant="bodyMd">
            Start uploading now.
          </Text>
        </EmptyState>
      </Card>
      <Card>
        <BlockStack gap="300">
          <InlineStack blockAlign="center" align="space-between">
            <Text variant="headingSm" as="h6">
              Feeds Library
            </Text>
            <Button>Manage Feeds</Button>
          </InlineStack>
          <Divider />
        </BlockStack>
        <EmptyState
          heading="No feeds created yet"
          action={{ icon: OrderDraftIcon, content: "Create Feed" }}
          image={fullVideo}
        >
          <Text as="p" variant="bodyMd">
            Start by creating one.
          </Text>
        </EmptyState>
      </Card>
    </InlineGrid>
  );
}
