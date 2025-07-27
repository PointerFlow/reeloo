import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useCallback, useState } from "react";
import { DropZone, InlineGrid, Thumbnail, Text, Page, BlockStack, Card, InlineStack, Box, Divider, ButtonGroup, Button, Checkbox, ProgressBar } from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';
import { VideoData } from "types/video.type";
import { stagingUploadMutation, uploadFileMutation } from "app/graphql/mutations";
import { executeGraphQL } from "app/graphql/graphql";
import { pullFileUntilReady } from "../helper/helper.jsx";
import { getVideoFileByIdQuery } from "app/graphql/queries";
import { useFetcher, useLoaderData } from "@remix-run/react";

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

    // Append the auth parameters
    // stagedTarget.parameters.forEach(({ name, value }) => {
    //     formDataForUpload.append(name, value);
    // });

    // // Append the actual file
    // formDataForUpload.append("file", file, {
    //     filename: file.name,
    //     contentType: file.type,
    // });

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
        1000, // 1 second
        60, // 60 attempts
    );

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

    console.log(fetcher.data);

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append("file", files[0]);

        fetcher.submit(formData, {
            method: "post",
            encType: "multipart/form-data",
        });
    };
    // const [files, setFiles] = useState<File[]>([]);

    // const handleDropZoneDrop = useCallback(
    //     (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
    //         setFiles((files) => [...files, ...acceptedFiles]),
    //     [],
    // );
    const videos: VideoData[] = [
        { id: '1', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '2', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '3', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '4', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '5', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" },
        { id: '6', src: "https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850" }
    ];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    // const fileUpload = !files.length && (
    //     <DropZone.FileUpload actionHint="Drag and drop or choose Mp4, HEIC, MOV videos to upload (max 20MB)" />
    // );
    // const uploadedFiles = files.length > 0 && (
    //     <InlineGrid>
    //         {files.map((file, index) => (
    //             <InlineGrid key={index}>
    //                 <Thumbnail
    //                     size="small"
    //                     alt={file.name}
    //                     source={
    //                         validImageTypes.includes(file.type)
    //                             ? window.URL.createObjectURL(file)
    //                             : NoteIcon
    //                     }
    //                 />
    //                 <div>
    //                     {file.name}{' '}
    //                     <Text variant="bodySm" as="p">
    //                         {file.size} bytes
    //                     </Text>
    //                 </div>
    //             </InlineGrid>
    //         ))}
    //     </InlineGrid>
    // );
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
                    </BlockStack>
                    <Box paddingBlockStart="300">
                        {/* <DropZone onDrop={handleDropZoneDrop} variableHeight>
                            <div className="h-[400px]">
                                {uploadedFiles}
                                {fileUpload}
                            </div>
                        </DropZone> */}

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
