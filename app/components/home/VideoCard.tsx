import {
  BlockStack,
  Card,
  Text,
  MediaCard,
  VideoThumbnail,
  Pagination,
  Modal,
} from "@shopify/polaris";
import { useState, useCallback, useRef } from "react";
import img1 from "../../Images/videoCard-01.jpg";
import img2 from "../../Images/videoCard-02.jpg";
import img3 from "../../Images/videoCard-03.jpg";
import { ITutorialStep } from "types/tutorial.type";
import { useNavigate } from "@remix-run/react";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function VideoCard() {
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  const tutorialSteps: ITutorialStep[] = [
    {
      id: 1,
      title: "Step 1: Upload/Import Your Videos",
      actionText: "Upload Videos",
      redirectTo: "/app/videoLibrary",
      description:
        "Upload videos from your device or import them directly from TikTok",
      thumbnailUrl: img1,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with actual video URLs
    },
    {
      id: 2,
      title: "Step 2: Tag Products to Your Videos",
      actionText: "Attach Product",
      redirectTo: "/app/videoLibrary",
      description:
        "Tag your Shopify products in your videos to make them shoppable.",
      thumbnailUrl: img2,
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      id: 3,
      title: "Step 3: Create a Feed and Publish",
      actionText: "Create Feed",
      redirectTo: "/app/feedsLibrary/edit",
      description:
        "Group your videos into feeds and publish them directly on your store.",
      thumbnailUrl: img3,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      title: "Step 3: Create a Feed and Publish",
      actionText: "Create Feed",
      redirectTo: "/app/feedsLibrary/edit",
      description:
        "Group your videos into feeds and publish them directly on your store.",
      thumbnailUrl: img3,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      title: "Step 3: Create a Feed and Publish",
      actionText: "Create Feed",
      redirectTo: "/app/feedsLibrary/edit",
      description:
        "Group your videos into feeds and publish them directly on your store.",
      thumbnailUrl: img3,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      title: "Step 3: Create a Feed and Publish",
      actionText: "Create Feed",
      redirectTo: "/app/feedsLibrary/edit",
      description:
        "Group your videos into feeds and publish them directly on your store.",
      thumbnailUrl: img3,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];
  const [active, setActive] = useState(false);

  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const handleOpen = useCallback((videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setActive(true);
  }, []);

  const handleClose = useCallback(() => {
    setActive(false);
    setCurrentVideo(null);
  }, []);

  return (
    <>
      <Card>
        <BlockStack gap="500">
          <BlockStack>
            <Text variant="headingSm" as="h6">
              Get Started in 3 Easy Steps!
            </Text>
            <Text as="p" variant="bodyMd">
              Follow these tutorials to create and publish your first shoppable video.
            </Text>
          </BlockStack>
          <div>
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="mySwiper"
              spaceBetween={20}
              slidesPerView={3}
            >
              {tutorialSteps.map((item, i) => (
                <SwiperSlide key={i}>
                  <MediaCard
                    portrait
                    title={item.title}
                    primaryAction={{
                      content: item.actionText,
                      onAction: () => navigate(item.redirectTo),
                    }}
                    description={item.description}
                  >
                    <VideoThumbnail
                      videoLength={80}
                      thumbnailUrl={item.thumbnailUrl}
                      onClick={() => handleOpen(item.videoUrl)}
                    />
                  </MediaCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <Pagination
            hasPrevious
            onPrevious={() => swiperRef.current?.slidePrev()}
            hasNext
            onNext={() => swiperRef.current?.slideNext()}
          />
        </BlockStack>
      </Card>

      {/* Modal to play video */}
      <Modal open={active} onClose={handleClose} title="Video Preview" size="large">
        <Modal.Section>
          {currentVideo && (
            <video
              controls
              autoPlay
              className="w-full h-full rounded-tr-lg"
            >
              <source src={currentVideo} type="video/mp4" />
            </video>
          )}
        </Modal.Section>
      </Modal>
    </>
  );
}
