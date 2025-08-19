import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
    BlockStack,
    Card,
    InlineGrid,
    Page,
    Select,
    Text,
    TextField,
    VideoThumbnail,
    Button,
    Box,
    InlineStack,
    Icon,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useCallback, useState } from "react";
import {
    ImportIcon,
    ViewIcon,
    FileIcon,
    ClockIcon,
    HashtagIcon,
    PageAttachmentIcon,
    DeleteIcon,
    PlusIcon,
    OrderDraftIcon,
    DesktopIcon,
    TabletIcon,
    MobileIcon
} from '@shopify/polaris-icons';
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { id } = params;
    await authenticate.admin(request);

    const res = await fetch(`https://reelo-backend.vercel.app/api/v1/videos/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
    const data = await res.json();

    return { video: data.data.video };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};

export default function PageComponent() {
    const { video } = useLoaderData<typeof loader>();

    // Controlled fields
    const [videoTitle, setVideoTitle] = useState(video?.title || "");
    const [videoStatus, setVideoStatus] = useState(video?.status || "Active");

    const handleStatusChange = useCallback((value: string) => setVideoStatus(value), []);

    const videoStatusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
    ];

    return (
        <Page
            backAction={{ content: 'Videos', onAction: () => { history.back() } }}
            title="Edit Video Details"
            subtitle="Manage your videos, tag products, and build engaging shoppable content."
            primaryAction={{ content: 'Update' }}
            secondaryActions={[{ content: 'Cancel' }]}
        >
            <InlineGrid gap="500" columns={['twoThirds', 'oneThird']}>
                <BlockStack gap="500">

                    {/* Info Section */}
                    <Card>
                        <Box paddingBlockEnd="300">
                            <Text variant="headingSm" as="h6">Information</Text>
                        </Box>
                        <InlineGrid gap="400" columns={['twoThirds', 'oneThird']}>
                            <TextField
                                autoComplete="off"
                                label="Video Title"
                                value={videoTitle}
                                onChange={setVideoTitle}
                                placeholder="write a video title"
                                requiredIndicator
                            />
                            <Select
                                label="Video Status"
                                options={videoStatusOptions}
                                onChange={handleStatusChange}
                                value={videoStatus}
                            />
                        </InlineGrid>
                    </Card>

                    {/* Video Details */}
                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingSm" as="h6">Video Details</Text>
                            <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
                                <video className="rounded-lg h-[100%]" width="100%" controls>
                                    <source src={video?.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <BlockStack gap="200">
                                    <Card>
                                        <InlineStack blockAlign="center" gap="300">
                                            <Card padding="100">
                                                <Icon source={ImportIcon} />
                                            </Card>
                                            <Text as="span">Imported from: {video?.source || "-"}</Text>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        <InlineStack blockAlign="center" gap="300">
                                            <Card padding="100">
                                                <Icon source={ViewIcon} />
                                            </Card>
                                            <Text as="span">Video Views: {video?.views || "0"}</Text>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        <InlineStack blockAlign="center" gap="300">
                                            <Card padding="100">
                                                <Icon source={FileIcon} />
                                            </Card>
                                            <Text as="span">Video Size: {video?.size || "-"}</Text>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        <InlineStack blockAlign="center" gap="300">
                                            <Card padding="100">
                                                <Icon source={ClockIcon} />
                                            </Card>
                                            <Text as="span">Duration: {video?.duration || "-"}</Text>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        <InlineStack blockAlign="center" gap="300">
                                            <Card padding="100">
                                                <Icon source={HashtagIcon} />
                                            </Card>
                                            <Text as="span">Dimensions: {video?.width || "?"} x {video?.height || "?"}</Text>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        <InlineStack blockAlign="center" gap="300">
                                            <Card padding="100">
                                                <Icon source={PageAttachmentIcon} />
                                            </Card>
                                            <Text as="span">Format: {video?.format || "-"}</Text>
                                        </InlineStack>
                                    </Card>
                                </BlockStack>
                            </InlineGrid>
                        </BlockStack>
                    </Card>

                    {/* Tagged Products */}
                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingSm" as="h6">Tag Products</Text>
                            <InlineGrid gap="200" columns={2}>
                                {video?.products?.map((product: any) => (
                                    <Card key={product.id}>
                                        <InlineStack gap="100" align="space-between" blockAlign="center">
                                            <InlineStack gap="300">
                                                <Card padding="0">
                                                    <img
                                                        className="w-14 h-14 object-cover"
                                                        src={product.image}
                                                        alt={product.title}
                                                    />
                                                </Card>
                                                <Text as="span">{product.title}</Text>
                                            </InlineStack>
                                            <div className="cursor-pointer">
                                                <Card padding="100">
                                                    <Icon source={DeleteIcon} />
                                                </Card>
                                            </div>
                                        </InlineStack>
                                    </Card>
                                ))}

                                {/* Add Product Button */}
                                <Card>
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <InlineStack gap="300">
                                            <Card>
                                                <Icon source={PlusIcon} />
                                            </Card>
                                            <button>Add Product</button>
                                        </InlineStack>
                                    </InlineStack>
                                </Card>
                            </InlineGrid>
                        </BlockStack>
                    </Card>

                    {/* Delete Button */}
                    <Box width="100%" paddingBlockEnd="500">
                        <Button variant="primary" tone="critical" icon={<Icon source={DeleteIcon} />}>
                            Delete Video
                        </Button>
                    </Box>
                </BlockStack>

                {/* Preview Card */}
                <div className="h-[600px]">
                    <Card>
                        <BlockStack gap="300">
                            <InlineStack blockAlign="center" align="space-between">
                                <Text variant="headingSm" as="h6">Preview</Text>
                                <InlineStack gap="100">
                                    <Button variant="primary" icon={<Icon source={DesktopIcon} />} />
                                    <Button icon={<Icon source={TabletIcon} />} />
                                    <Button icon={<Icon source={MobileIcon} />} />
                                </InlineStack>
                            </InlineStack>
                            <VideoThumbnail
                                videoLength={video?.duration || 0}
                                thumbnailUrl={video?.thumbnail || ""}
                                onClick={() => { }}
                            />
                            <Box>
                                <InlineStack align="center">
                                    <Button variant="primary" icon={<Icon source={OrderDraftIcon} />}>
                                        Customize Style
                                    </Button>
                                </InlineStack>
                            </Box>
                        </BlockStack>
                    </Card>
                </div>
            </InlineGrid>
        </Page>
    );
}
