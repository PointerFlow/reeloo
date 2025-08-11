import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useState } from "react";
import { DropZone, InlineGrid, Text, Page, BlockStack, Card, InlineStack, Box, Divider, ButtonGroup, Button, ProgressBar } from '@shopify/polaris';
import { VideoData } from "types/video.type";
import { stagingUploadMutation, uploadFileMutation } from "app/graphql/mutations";
import { executeGraphQL } from "app/graphql/graphql";
import { pullFileUntilReady } from "../helper/helper.jsx";
import { getVideoFileByIdQuery } from "app/graphql/queries";
import { useFetcher, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { IShopData } from "types/shop.type";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData()
    const file = formData.get("file") as File;
    if (!file) {
        console.log("not file upload");
    }
    const formDataForUpload = new FormData();

    const stagedUploadInput = {
        input: [
            {
                resource: "VIDEO",
                httpMethod: "POST",
                mimeType: file.type,
                filename: file.name,
                fileSize: file.size.toString(),
            },
        ],
    };

    // Create a staged upload URL using stagedUploadsCreate mutation
    const stagedUploadResponse = await executeGraphQL(
        admin,
        stagingUploadMutation,
        stagedUploadInput,
    );

    const stagedTarget =
        stagedUploadResponse.stagedUploadsCreate.stagedTargets[0];

    // Append auth parameters
    stagedTarget.parameters.forEach(
        ({ name, value }: { name: string; value: string }) => {
            formDataForUpload.append(name, value);
        }
    );

    // Append actual file
    formDataForUpload.append("file", file, file.name);

    // Upload the file to the staged target URL
    const fileUploadResponse = await fetch(stagedTarget.url, {
        method: "POST",
        body: formDataForUpload,
    });

    if (!fileUploadResponse.ok) {
        throw new Error("Failed to upload file to Shopify");
    }

    // Preapre the file creation input
    const filesArray = {
        files: [
            {
                alt: file.name,
                originalSource: stagedTarget.resourceUrl,
                contentType: "VIDEO",
            },
        ],
    };

    // Create the file in Shopify
    const fileCreateResponse = await executeGraphQL(
        admin,
        uploadFileMutation,
        filesArray,
    );

    const fileId = {
        id: fileCreateResponse.fileCreate.files[0].id,
    };

    const fileByIdResponse = await pullFileUntilReady(
        admin,
        getVideoFileByIdQuery,
        fileId,
        1000,
        60,
    );

    // crate video api post reqesst process
    // const videoData = fileByIdResponse.node;
    // const storeApiResponse = await fetch(`${process.env.API_URL}/videos`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${process.env.API_TOKEN}`, 
    //     },
    //     body: JSON.stringify({
    //         storeId: "test",
    //         title: videoData.alt || file.name,
    //         url: videoData.originalSource,
    //         source: "Shopify",
    //         width: videoData.image?.width || 0,
    //         height: videoData.image?.height || 0,
    //         duration: videoData.duration || 0,
    //         format: videoData.format || file.type.split("/")[1],
    //         size: file.size,
    //     }),
    // });

    // if (!storeApiResponse.ok) {
    //     return { success: false, message: "Failed to save video in DB" };
    // }

    return {
        success: true,
        data: {
            fileCreateResponse,
            fileByIdResponse,
        },
    };

};

export default function page() {
    const [files, setFiles] = useState<File[]>([]);
    const data = useLoaderData();
    const fetcher = useFetcher();
    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append("file", files[0]);

        fetcher.submit(formData, {
            method: "post",
            encType: "multipart/form-data",
        });
    };
    const videos: VideoData[] = [
        { id: '1', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '2', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '3', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '4', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '5', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '6', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" }
    ];

    // get shop data

    const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
    console.log(shopData);
    
    return (
        <Page
            backAction={{ content: 'Products', onAction: () => { history.back() } }}
            title="Input from Tiktok"
        >
            <BlockStack gap="500">
                <Card>
                    <Box paddingBlockStart="300">
                        <Card>
                            {files.length == 0 && (
                                <DropZone
                                    onDrop={setFiles}
                                    accept="video/*"
                                    allowMultiple={false}
                                >
                                    <DropZone.FileUpload actionHint="Select files to upload" />
                                </DropZone>
                            )}
                            {files.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                        maxWidth: "400px",
                                    }}
                                >
                                    <video
                                        controls
                                        style={{ maxHeight: "300px", objectFit: "cover" }}
                                    >
                                        <source
                                            src={URL.createObjectURL(files[0])}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                    <ButtonGroup fullWidth>
                                        <Button
                                            variant="primary"
                                            tone="critical"
                                            onClick={() => setFiles([])}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleFileUpload}
                                            disabled={fetcher.state === "submitting"}
                                        >
                                            {fetcher.state === "submitting"
                                                ? "Uploading..."
                                                : "Upload Video"}
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            )}
                        </Card>
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
                                    <div className="absolute top-[50%] w-[80%] left-5">
                                        <ProgressBar progress={20} />
                                    </div>
                                    <img
                                        className="h-80 w-full object-cover rounded-lg"
                                        src={video.src}
                                        alt={`TikTok video ${video.id}`}
                                    />
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
