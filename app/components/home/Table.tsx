import {
  Card,
  IndexTable,
  Text,
  useIndexResourceState,
  BlockStack,
  InlineStack,
  Button,
  Divider,
  Icon,
} from "@shopify/polaris";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { TableData } from "types/tableData.type";


export default function Table() {
  const orders: TableData[] = [
    {
      id: "1020",
      user_name: "Beautiful caucasian...Mp4",
      image:
        "https://retailminded.com/wp-content/uploads/2016/03/EN_GreenOlive-1.jpg",
      date: "11/06/2025",
    },
    {
      id: "1019",
      user_name: "Beautiful caucasian...Mp4",
      image:
        "https://retailminded.com/wp-content/uploads/2016/03/EN_GreenOlive-1.jpg",
      date: "11/06/2025",
    },
    {
      id: "1018",
      user_name: "Beautiful caucasian...Mp4",
      image:
        "https://retailminded.com/wp-content/uploads/2016/03/EN_GreenOlive-1.jpg",
      date: "11/06/2025",
    },
  ];

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(({ id, user_name, image, date }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <InlineStack blockAlign="center" gap="200">
          <Card padding="0">
            <img width={40} height={40} src={image} alt="" />
          </Card>
          <Text variant="bodyMd" as="span">
            {user_name}
          </Text>
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>{date}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="100">
          <div className="w-7 h-7 bg-gray-100 border rounded-lg border-gray-300">
            <Icon source={EditIcon} tone="base" />
          </div>
          <div className="w-7 h-7 bg-gray-100 border rounded-lg border-gray-300">
            <Icon source={DeleteIcon} tone="critical" />
          </div>
        </InlineStack>
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
                  Video Library
                </Text>
                <Button>Go to Video Libray</Button>
              </InlineStack>
              <Divider />
            </BlockStack>
            <Text variant="headingSm" as="p">
              You have uploaded 20 videos
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
              { title: "Videos" },
              { title: "Upload Date" },
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
