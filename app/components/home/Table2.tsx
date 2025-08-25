import { useNavigate, useRouteLoaderData } from "@remix-run/react";
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
import { IFeedsDataAll } from "types/allFeeds.type";

export default function Table2() {
  const { allFeeds } = useRouteLoaderData("root") as { allFeeds: IFeedsDataAll };
  const navigate = useNavigate();
  const resourceName = {
    singular: "feed",
    plural: "feeds",
  };

  // TypeScript fix for useIndexResourceState
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(allFeeds as unknown as { id: string }[]);

  const rowMarkup = (Array.isArray(allFeeds) ? allFeeds : []).map((feed: any, index: any) => (
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
        <Text variant="bodyMd" as="span">{feed?.videos?.length} Videos</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{new Date(feed.createdAt).toLocaleDateString()}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="100">
          <Button icon={EditIcon}
            onClick={() => navigate(`feedsLibrary/edit/${feed._id}`)}
          />
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
              <Button
                onClick={() => navigate("/app/feedsLibrary")}
              >Manage Feeds</Button>
            </InlineStack>
            <Divider />
          </BlockStack>
          <Text variant="headingSm" as="p">You have created {Array.isArray(allFeeds) ? allFeeds.length : 0} feeds</Text>
        </BlockStack>
        <div className="max-h-96 overflow-y-auto">
          <IndexTable
            resourceName={resourceName}
            itemCount={Array.isArray(allFeeds) ? allFeeds.length : 0}
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
