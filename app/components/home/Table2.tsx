import { useRouteLoaderData } from "@remix-run/react";
import {
  BlockStack,
  Button,
  Card,
  Divider,
  IndexTable,
  InlineStack,
  Text,
  useIndexResourceState
} from "@shopify/polaris";
import { EditIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { IFeedsDataAll } from "types/allFeeds.type";
import { IShopData } from "types/shop.type";

export default function Table2() {
  const resourceName = {
    singular: "feed",
    plural: "feeds",
  };

  // Fetch feeds
  const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
  const storeId = shopData.shop.id;
  const [data, setData] = useState<IFeedsDataAll[]>([]);
  const fetchFeeds = useCallback(async () => {
    try {
      const response = await fetch(
        `https://reelo-backend.vercel.app/api/v1/feeds?storeId=${storeId}`,
        { method: "GET", headers: { "content-type": "application/json" } }
      );
      const responseData = await response.json();
      setData(responseData.data.feeds);
    } catch (error) {
      setData([]);
    }
  }, [storeId]);
  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  // TypeScript fix for useIndexResourceState
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data as unknown as { id: string }[]);

  const rowMarkup = data.map((feed, index) => (
    <IndexTable.Row
      id={feed._id}
      key={index}
      selected={selectedResources.includes(feed._id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{feed?.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{feed.totalVideos || "0 Videos"}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{new Date(feed.createdAt).toLocaleDateString()}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="100">
          <Button icon={EditIcon} />
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return (
    <Card>
      <BlockStack gap="300">
        <BlockStack gap="300">
          <BlockStack gap="300">
            <InlineStack blockAlign="center" align="space-between">
              <Text variant="headingSm" as="h6">Feeds Library</Text>
              <Button>Manage Feeds</Button>
            </InlineStack>
            <Divider />
          </BlockStack>
          <Text variant="headingSm" as="p">You have created {data.length} feeds</Text>
        </BlockStack>
        <div className="max-h-96 overflow-y-auto">
          <IndexTable
            resourceName={resourceName}
            itemCount={data.length}
            selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Feeds Name" },
              { title: "Total Videos" },
              { title: "Created" },
              { title: "Action" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </div>
      </BlockStack>
    </Card>
  );
}
