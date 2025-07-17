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
    ImportIcon, ViewIcon, FileIcon, ClockIcon, HashtagIcon, PageAttachmentIcon, DeleteIcon, PlusIcon, OrderDraftIcon, DesktopIcon, TabletIcon, MobileIcon
} from '@shopify/polaris-icons';
import { videoDetails } from "types/videoDetails.type";
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};
export default function PageComponent() {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoStatus, setVideoStatus] = useState('Active');

    const handleStatusChange = useCallback((value: string) => setVideoStatus(value), []);

    const videoStatusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
    ];
    const videoDetails: videoDetails[] = [
        { id: 1, icon: ImportIcon, label: 'Imported from', value: 'Tiktok' },
        { id: 2, icon: ViewIcon, label: 'Video Views', value: '45' },
        { id: 3, icon: FileIcon, label: 'Video Size', value: '20MB' },
        { id: 4, icon: ClockIcon, label: 'Duration', value: '14.0 Sec' },
        { id: 5, icon: HashtagIcon, label: 'Dimensions', value: '340 X 150' },
        { id: 6, icon: PageAttachmentIcon, label: 'Format', value: 'mp4' },
    ];
    return (
        <Page
            backAction={{ content: 'Products', url: '#' }}
            title="Edit Video Details"
            subtitle="Manage your videos, tag products, and build engaging shoppable content."
            primaryAction={{ content: 'Update' }}
            secondaryActions={[{ content: 'Cancel' }]}
        >
            <InlineGrid gap="500" columns={['twoThirds', 'oneThird']}>
                <BlockStack gap="500">
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
                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingSm" as="h6">Video Details</Text>

                            <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
                                <video className="rounded-lg h-[100%]" width="100%" controls>
                                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <BlockStack gap="200">
                                    {videoDetails.map(detail => (
                                        <Card key={detail.id}>
                                            <InlineStack blockAlign="center" align="start" gap="100">
                                                <div className="w-5 h-5">
                                                    <detail.icon />
                                                </div>
                                                <Text as="span">
                                                    <b>{detail.label}:</b> {detail.value}
                                                </Text>
                                            </InlineStack>
                                        </Card>
                                    ))}
                                </BlockStack>

                            </InlineGrid>
                        </BlockStack>
                    </Card>
                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingSm" as="h6">Tag Products</Text>
                            <InlineGrid gap="200" columns={2}>
                                <Card>
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <InlineStack gap="300">
                                            <Card padding="0">
                                                <img className="w-14 h-14 object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                            </Card>
                                            <Text as="span">Brown Throw Pillows</Text>
                                        </InlineStack>
                                        <div className="cursor-pointer">
                                            <Card padding="100">
                                                <Icon source={DeleteIcon} />
                                            </Card>
                                        </div>
                                    </InlineStack>
                                </Card>
                                <Card>
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <InlineStack gap="300">
                                            <Card padding="0">
                                                <img className="w-14 h-14 object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                            </Card>
                                            <Text as="span">Brown Throw Pillows</Text>
                                        </InlineStack>
                                        <div className="cursor-pointer">
                                            <Card padding="100">
                                                <Icon source={DeleteIcon} />
                                            </Card>
                                        </div>
                                    </InlineStack>
                                </Card>
                                <Card>
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <InlineStack gap="300">
                                            <Card padding="0">
                                                <img className="w-14 h-14 object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                            </Card>
                                            <Text as="span">Brown Throw Pillows</Text>
                                        </InlineStack>
                                        <div className="cursor-pointer">
                                            <Card padding="100">
                                                <Icon source={DeleteIcon} />
                                            </Card>
                                        </div>
                                    </InlineStack>
                                </Card>
                                <Card>
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <InlineStack gap="300">
                                            <Card padding="0">
                                                <img className="w-14 h-14 object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                            </Card>
                                            <Text as="span">Brown Throw Pillows</Text>
                                        </InlineStack>
                                        <div className="cursor-pointer">
                                            <Card padding="100">
                                                <Icon source={DeleteIcon} />
                                            </Card>
                                        </div>
                                    </InlineStack>
                                </Card>
                                <Card>
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <InlineStack gap="300">
                                            <Card>
                                                <Icon source={PlusIcon} />
                                            </Card>
                                            <button>
                                                Add Product
                                            </button>
                                        </InlineStack>
                                    </InlineStack>
                                </Card>
                            </InlineGrid>
                        </BlockStack>
                    </Card>
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
                                    <Button variant="primary" icon={<Icon source={DesktopIcon} />} >
                                    </Button>
                                    <Button icon={<Icon source={TabletIcon} />} >
                                    </Button>
                                    <Button icon={<Icon source={MobileIcon} />} >
                                    </Button>
                                </InlineStack>
                            </InlineStack>
                            <VideoThumbnail
                                videoLength={60}
                                thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                                onClick={() => { }}
                            />
                            <Box >
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
