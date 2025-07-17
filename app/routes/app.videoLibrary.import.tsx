import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Combobox, Divider, Icon, InlineGrid, InlineStack, Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { ArrowLeftIcon } from '@shopify/polaris-icons';
import { useCallback, useState } from "react";
import { VideoData } from "types/video.type";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};

export default function page() {
    const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);
    const [checkedAll, setCheckedAll] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedVideos, setSelectedVideos] = useState<Record<string, boolean>>({});

    const videos: VideoData[] = [
        { id: '1', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '2', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '3', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '4', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '5', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '6', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" }
    ];

    const handleFirstButtonClick = useCallback(() => {
        if (isFirstButtonActive) return;
        setIsFirstButtonActive(true);
    }, [isFirstButtonActive]);

    const handleSecondButtonClick = useCallback(() => {
        if (!isFirstButtonActive) return;
        setIsFirstButtonActive(false);
    }, [isFirstButtonActive]);

    const handleSelectAllChange = useCallback(
        (newChecked: boolean) => {
            setCheckedAll(newChecked);
            const newSelected: Record<string, boolean> = {};
            videos.forEach(video => {
                newSelected[video.id] = newChecked;
            });
        },
        [videos]
    );

    const handleVideoCheckboxChange = useCallback(
        (id: string, newChecked: boolean) => {
            setSelectedVideos(prev => ({
                ...prev,
                [id]: newChecked
            }));

            const allChecked = Object.values({
                ...selectedVideos,
                [id]: newChecked
            }).every(Boolean);

            setCheckedAll(allChecked);
        },
        [selectedVideos]
    );
    
    return (
        <Page>
            <BlockStack gap="500">
                <Card>
                    <BlockStack gap="600">
                        <InlineStack gap="200">
                            <div className="w-5 h-5"><ArrowLeftIcon /></div>
                            <Text variant="headingMd" as="h2">
                                Input from Tiktok
                            </Text>
                        </InlineStack>
                        <ButtonGroup>
                            <Card padding="200">
                                <Button variant="tertiary" pressed={isFirstButtonActive} onClick={handleFirstButtonClick}>
                                    Import by URL
                                </Button>
                                <Button variant="tertiary" pressed={!isFirstButtonActive} onClick={handleSecondButtonClick}>
                                    Import by @Username
                                </Button>
                            </Card>
                        </ButtonGroup>
                    </BlockStack>
                    <Box paddingBlockStart="500">
                        <div className="flex gap-2 items-center">
                            <div className="w-[85%]">
                                <Combobox
                                    activator={
                                        <Combobox.TextField
                                            label="url and tiktok reel"
                                            labelHidden
                                            onChange={setInputValue}
                                            value={inputValue}
                                            placeholder="url and tiktok reel"
                                            autoComplete="off"
                                        />
                                    }
                                ></Combobox>
                            </div>
                           <div className="w-fit">
                             <Button>Search Video</Button>
                           </div>
                        </div>
                    </Box>
                    <Box paddingBlockStart="300">
                        <Checkbox
                            label="Are you sure you want to import the selected videos from and make them available in your Reeloo video library."
                            checked={checkedAll}
                            onChange={handleSelectAllChange}
                        />
                    </Box>
                </Card>
                <Card>
                    <BlockStack gap="300">
                        <InlineStack blockAlign="center" align="space-between">
                            <Text variant="headingSm" as="h6">
                                Tiktok all Videos
                            </Text>
                        </InlineStack>
                        <Divider />
                    </BlockStack>
                    <Box paddingBlock="400">
                        <InlineGrid gap="400" columns={4}>
                            {videos.map((video) => (
                                <Box key={video.id} position="relative">
                                    <img
                                        className="h-80 w-full object-cover rounded-lg"
                                        src={video.src}
                                        alt={`TikTok video ${video.id}`}
                                    />
                                    <div className="absolute top-2 left-2">
                                        <Checkbox
                                            checked={selectedVideos[video.id] || false}
                                            onChange={(newChecked) => handleVideoCheckboxChange(video.id, newChecked)}
                                            labelHidden
                                            label={`Select video ${video.id}`}
                                        />
                                    </div>
                                </Box>
                            ))}
                        </InlineGrid>
                    </Box>
                    <BlockStack gap="300">
                        <Divider />
                        <InlineStack blockAlign="center" align="space-between">
                            <Text variant="headingSm" as="h6">
                                All Product Show
                            </Text>
                            <ButtonGroup>
                                <Button>Cancel</Button>
                                <Button variant="primary">Save</Button>
                            </ButtonGroup>
                        </InlineStack>
                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
    );
}
