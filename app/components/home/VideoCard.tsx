import {
  BlockStack,
  Card,
  Text,
  InlineGrid,
  MediaCard,
  VideoThumbnail,
  Pagination,
} from "@shopify/polaris";
import img1 from "../../Images/videoCard-01.jpg";
import img2 from "../../Images/videoCard-02.jpg";
import img3 from "../../Images/videoCard-03.jpg";
import { ITutorialStep } from "types/tutorial.type";

export default function VideoCard() {
  const tutorialSteps: ITutorialStep[] = [
    {
      id: 1,
      title: "Step 1: Upload/Import Your Videos",
      actionText: "Upload Videos",
      description:
        "Upload videos from your device or import them directly from TikTok",
      thumbnailUrl: img1,
    },
    {
      id: 2,
      title: "Step 2: Tag Products to Your Videos",
      actionText: "Attach Product",
      description:
        "Tag your Shopify products in your videos to make them shoppable. ",
      thumbnailUrl: img2,
    },
    {
      id: 3,
      title: "Step 3: Create a Feed and Publish",
      actionText: "Create Feed",
      description:
        "Group your videos into feeds and publish them directly on your store.",
      thumbnailUrl: img3,
    },
  ];
  return (
    <Card>
      <BlockStack gap="500">
        <BlockStack>
          <Text variant="headingSm" as="h6">
            Get Started in 3 Easy Steps!
          </Text>
          <Text as="p" variant="bodyMd">
            Follow these tutorials to create and publish your first shoppable
            video.
          </Text>
        </BlockStack>

        <InlineGrid gap="400" columns={3}>
          {tutorialSteps &&
            tutorialSteps?.map((item, i) => {
              return (
                <div className="mt-0" key={i}>
                  <MediaCard
                    portrait
                    title={item?.title}
                    primaryAction={{
                      content: item?.actionText,
                      onAction: () => { },
                    }}
                    description={item?.description}
                  >
                    <VideoThumbnail
                      videoLength={80}
                      thumbnailUrl={item?.thumbnailUrl}
                      onClick={() => console.log("clicked")}
                    />
                  </MediaCard>
                </div>
              );
            })}
        </InlineGrid>
        <Pagination
          hasPrevious
          onPrevious={() => {
            console.log("Previous");
          }}
          hasNext
          onNext={() => {
            console.log("Next");
          }}
        />
      </BlockStack>
    </Card>
  );
}
