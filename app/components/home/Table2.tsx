import {
    BlockStack,
    Button,
    Card,
    Divider,
    Icon,
    IndexTable,
    InlineStack,
    Text,
    useIndexResourceState
} from "@shopify/polaris";
import { EditIcon } from "@shopify/polaris-icons";
import { Table2Data } from "types/table2Data.type";

export default function Table2() {
  const orders: Table2Data[] = [
    {
      id: "1020",
      user_name: "Summer Sale",
      total: "8 Videos",
      date: "11/06/2025",
    },
    {
      id: "1019",
      user_name: "Summer Sale",
      total: "8 Videos",
      date: "11/06/2025",
    },
    {
      id: "1018",
      user_name: "Summer Sale",
      total: "8 Videos",
      date: "11/06/2025",
    },
  ];

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(({ id, user_name, total, date }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {user_name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {total}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{date}</IndexTable.Cell>
      <IndexTable.Cell>
        <div className="w-7 h-7 bg-gray-100 border rounded-lg border-gray-300">
          <Icon source={EditIcon} tone="base" />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Card>
        <BlockStack gap="300">
          <BlockStack gap="300">
            <BlockStack gap="300">
              <InlineStack blockAlign="center" align="space-between">
                <Text variant="headingSm" as="h6">
                  Feeds Library
                </Text>
                <Button>Manage Feeds</Button>
              </InlineStack>
              <Divider />
            </BlockStack>
            <Text variant="headingSm" as="p">
              You have Created 05 Feeds
            </Text>
          </BlockStack>
          <IndexTable
            resourceName={resourceName}
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
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
        </BlockStack>
      </Card>
    </>
  );
}
