import { useNavigate, useRouteLoaderData } from "@remix-run/react";
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
import { useEffect, useState } from "react";
import { IAllVideo } from "types/allVideo.type";
import { IShopData } from "types/shop.type";

export default function Table() {
  const navigate = useNavigate();

  // get all video
  const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
  const storeId = shopData.shop.id;
  const [data, setData] = useState<IAllVideo[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`https://reelo-backend.vercel.app/api/v1/videos?storeId=${storeId}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      const data = await response.json();
      setData(data.data.videos);
    })();
  }, []);

// delete videos
   const deleteHandler = async (id: string) => {
        const res = await fetch("https://reelo-backend.vercel.app/api/v1/videos/" + id, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
        })
        await res.json()
       const response = await fetch(`https://reelo-backend.vercel.app/api/v1/videos?storeId=${storeId}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })
        const data = await response.json();
        setData(data.data.videos);
    }

  const resourceName = {
    singular: "video",
    plural: "videos",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data as unknown as { [key: string]: unknown }[]);

  const rowMarkup = data.map((video, index) => (
    <IndexTable.Row
      id={video._id}
      key={index}
      selected={selectedResources.includes(video._id)}
      position={index}
    >
      <IndexTable.Cell>
        <InlineStack blockAlign="center" gap="200">
          <Card padding="0">
            <video className="w-10 h-10 object-cover" src={video.url} />
          </Card>
          <Text variant="bodyMd" as="span">
            {video.title || 'Untitled Video'}
          </Text>
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>{new Date(video.updatedAt).toLocaleDateString()}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="100">
          <Button icon={EditIcon} onClick={()=> navigate("/app/videoLibrary/edit")}>
          </Button>
          <Button onClick={()=> deleteHandler(video._id)} icon={DeleteIcon} tone="critical">
          </Button>

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
              <Text variant="headingSm" as="h6">
                Video Library
              </Text>
              <Button onClick={() => navigate("/app/videoLibrary")}>
                Go to Video Library
              </Button>
            </InlineStack>
            <Divider />
          </BlockStack>
          <Text variant="headingSm" as="p">
            You have uploaded {data.length} videos
          </Text>
        </BlockStack>

        {/* Scrollable table container */}
        <div className="max-h-96 overflow-y-auto">
          <IndexTable
            resourceName={resourceName}
            itemCount={data.length}
            selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Videos" },
              { title: "Upload Date" },
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
