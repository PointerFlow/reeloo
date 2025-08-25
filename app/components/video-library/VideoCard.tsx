import {
    Card,
    Button,
    EmptyState,
    Text,
    BlockStack,
    InlineStack,
    Icon,
    Box,
    InlineGrid,
    Thumbnail,
    Link,
} from "@shopify/polaris";
import emtyvideoImg from "../../Images/emty_video.png";
import {
    PlusIcon,
    DeleteIcon,
    EditIcon,
    ViewIcon
} from "@shopify/polaris-icons";
import { getProductById } from "app/helper/utils";
import { videoCard } from "types/videoCard.type";

export default function VideoCard({ allVideos, deleteHandler, shopifyProducts, setIsPopupOpen, setSelectedProductIds, videoIdHandler }: videoCard) {
    return (
        <Box paddingBlock="400">
            {allVideos.length > 0 ? (
                <InlineGrid columns={4} gap="300">
                    {allVideos.map((item, id) => (
                        <Card padding="0" key={id}>
                            <Box position="relative">
                                <div className="h-64 w-full">
                                    <video
                                        className="h-full w-full object-cover"
                                        src={item?.url}
                                    ></video>
                                </div>
                                <div
                                    className="absolute top-2 right-2 bg-white rounded-lg p-1 cursor-pointer"
                                    onClick={() => deleteHandler(item._id)}
                                >
                                    <Icon tone="critical" source={DeleteIcon} />
                                </div>
                                <div className="absolute top-2 right-11 bg-white rounded-lg p-1 cursor-pointer">
                                    <Link
                                        monochrome
                                        url={`/app/videoLibrary/edit/${item._id}`}
                                    >
                                        <Icon source={EditIcon} />
                                    </Link>
                                </div>
                                <div className="flex gap-1 absolute top-2 left-2 bg-black rounded-lg px-2 py-0.5 cursor-pointer">
                                    <Icon source={ViewIcon} tone="subdued" />
                                    <span className="text-white">{item?.views}</span>
                                </div>
                            </Box>
                            <Box padding="200">
                                <BlockStack gap="300">
                                    <InlineStack gap="100" blockAlign="center">
                                        {item.products.slice(0, 3).map((productId, index) => (
                                            <Thumbnail
                                                key={index}
                                                source={
                                                    getProductById(productId, shopifyProducts)
                                                        ?.featuredMedia.preview.image.url
                                                }
                                                size="small"
                                                alt={
                                                    getProductById(productId, shopifyProducts)
                                                        ?.title || ""
                                                }
                                            />
                                        ))}
                                        {item.products.length > 3 && (
                                            <Text as="p" variant="bodyMd">
                                                +{item.products.length - 3} More..
                                            </Text>
                                        )}
                                    </InlineStack>
                                    <Button
                                        fullWidth
                                        icon={PlusIcon}
                                        variant="primary"
                                        onClick={() => {
                                            setIsPopupOpen(true);
                                            const taggedIds = item.products || [];
                                            setSelectedProductIds(new Set(taggedIds));
                                            videoIdHandler(item._id, item.title, item.status)
                                        }}
                                    >
                                        Tag Products
                                    </Button>
                                </BlockStack>
                            </Box>
                        </Card>
                    ))}
                </InlineGrid>
            ) : (
                <EmptyState
                    heading="Your video library is empty"
                    image={emtyvideoImg}
                >
                    <Text as="p" variant="bodyMd">
                        Start uploading now.
                    </Text>
                </EmptyState>
            )}
        </Box>
    );
}

