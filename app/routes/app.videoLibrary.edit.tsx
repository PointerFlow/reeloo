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
    Icon,
    InlineStack
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useCallback, useState } from "react";

import {
    ImportIcon
} from '@shopify/polaris-icons';
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

                            <InlineGrid columns={{ xs: 1, sm: 2 }} gap="300">
                                <video width="100%" controls>
                                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                <BlockStack gap="200">
                                    <Card>
                                        <InlineStack align="start" gap="100">
                                            <Icon source={ImportIcon} tone="base" />
                                            <Text as="span"><b>Formet:</b> mp4</Text>
                                        </InlineStack>
                                    </Card>
                                </BlockStack>
                            </InlineGrid>
                        </BlockStack>
                    </Card>

                </BlockStack>

                {/* Preview Card */}
                <Card>
                    <BlockStack gap="300">
                        <Text variant="headingSm" as="h6">Preview</Text>

                        <VideoThumbnail
                            videoLength={60}
                            thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                            onClick={() => { }}
                        />

                        <BlockStack gap="200">
                            <Text variant="bodyMd" as="p">
                                Serene Comfort Sofa
                            </Text>
                            <Text variant="bodyMd" as="p">
                                $59.99 <del>$69.99</del>
                            </Text>
                            <Button>Customize Style</Button>
                        </BlockStack>
                    </BlockStack>
                </Card>
            </InlineGrid>
        </Page>
    );
}
