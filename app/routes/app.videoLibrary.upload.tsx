import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useCallback, useState } from "react";
import { DropZone, InlineGrid, Text, Page, BlockStack, Card, InlineStack, Box, Divider, ButtonGroup, Button, TextField } from '@shopify/polaris';
import { stagingUploadMutation, uploadFileMutation } from "app/graphql/mutations";
import { executeGraphQL } from "app/graphql/graphql";
import { pullFileUntilReady } from "../helper/helper.jsx";
import { getVideoFileByIdQuery } from "app/graphql/queries";
import { redirect, useFetcher, useRouteLoaderData } from "@remix-run/react";
import { IShopData } from "types/shop.type";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData()
    const file = formData.get("file") as File;
    const storeId = formData.get("storeId") as string;
    const title = formData.get("title") as string;

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

    const payload = {
        storeId: storeId,
        title: title,
        url: fileByIdResponse?.node?.originalSource?.url,
        source: "local",
        width: fileByIdResponse.node.sources[0].width,
        height: fileByIdResponse.node.sources[0].height,
        duration: parseInt(fileByIdResponse?.timeTaken),
        format: fileByIdResponse.node.sources[0].mimeType,
        size: file.size
    };

    await fetch("https://reelo-backend.vercel.app/api/v1/videos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    return redirect("/app/videoLibrary");
};

export default function page() {
    const [files, setFiles] = useState<File[]>([]);
    const [tile, setTile] = useState('');
    const handleEmailChange = useCallback((value: string) => setTile(value), []);
    const fetcher = useFetcher();
    const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
    const storeId = shopData.shop.id;

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("storeId", storeId);
        formData.append("title", tile);
        fetcher.submit(formData, {
            method: "post",
            encType: "multipart/form-data",
        });
    };

    return (
        <Page
            backAction={{ content: 'Products', onAction: () => { history.back() } }}
            title="Upload from Device"
        >
            <BlockStack gap="500">
                <Card>
                    <TextField
                        value={tile}
                        onChange={handleEmailChange}
                        label="Video title"
                        type="text"
                        autoComplete="title"
                    />
                    <Box paddingBlockStart="300">
                        <Card>
                            {files.length == 0 && (
                                <DropZone
                                    onDrop={setFiles}
                                    accept="video/*"
                                    allowMultiple={false}
                                >
                                    <DropZone.FileUpload actionHint="Drag and drop or choose Mp4, HEIC, MOV videos to upload (max 20MB)" />
                                </DropZone>
                            )}
                        </Card>
                    </Box>
                </Card>
                {
                    files[0] && (
                        <Card>
                            <BlockStack gap="300">
                            </BlockStack>
                            <Box paddingBlock="400">
                                <InlineGrid gap="400" columns={4}>
                                    {files.length > 0 && (
                                        <Box position="relative">
                                            <div className="relative h-80 w-full rounded-lg overflow-hidden">
                                                <video
                                                    controls
                                                    className="h-full w-full object-cover"
                                                >
                                                    <source
                                                        src={URL.createObjectURL(files[0])}
                                                        type="video/mp4"
                                                    />
                                                </video>

                                                {fetcher.state === "submitting" && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg">
                                                        Uploading...
                                                    </div>
                                                )}
                                            </div>

                                        </Box>
                                    )}
                                </InlineGrid>
                            </Box>
                            <BlockStack gap="300">
                                <Divider />
                                <InlineStack blockAlign="center" align="space-between">
                                    <Text variant="headingSm" as="h6">
                                        All Product Show
                                    </Text>
                                    <ButtonGroup>


                                        <Button
                                            onClick={() => setFiles([])}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleFileUpload}
                                            variant="primary"
                                            disabled={fetcher.state === "submitting"}
                                        >
                                            {fetcher.state === "submitting"
                                                ? "Uploading..."
                                                : "Upload Video"}
                                        </Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </BlockStack>
                        </Card>
                    )
                }
            </BlockStack>
        </Page>
    );
}

