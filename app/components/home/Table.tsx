import { useFetcher, useNavigate, useRevalidator, useRouteLoaderData } from "@remix-run/react";
import {
  Card,
  IndexTable,
  Text,
  useIndexResourceState,
  BlockStack,
  InlineStack,
  Button,
  Divider,
} from "@shopify/polaris";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { IAllVideo } from "types/allVideo.type";

export default function Table() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  // get all video
  const { allVideos } = useRouteLoaderData("root") as { allVideos: IAllVideo };

  // handle delete video
  const deleteHandler = (id: string) => {
    fetcher.submit(
      { id },
      { method: "DELETE" }
    );
  };

  const resourceName = {
    singular: "video",
    plural: "videos",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(allVideos as unknown as { [key: string]: unknown }[]);

  const rowMarkup = (Array.isArray(allVideos) ? allVideos : []).map((video, index) => (
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
          <Button icon={EditIcon} onClick={() => navigate("/app/videoLibrary/edit/" + video._id)}>

          </Button>
          <Button onClick={() => deleteHandler(video._id)} icon={DeleteIcon} tone="critical">
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
            You have uploaded {(Array.isArray(allVideos) ? allVideos : []).length} videos
          </Text>
        </BlockStack>

        {/* Scrollable table container */}
        <div className="max-h-96 overflow-y-auto">
          <IndexTable
            resourceName={resourceName}
            itemCount={(Array.isArray(allVideos) ? allVideos : []).length}
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
