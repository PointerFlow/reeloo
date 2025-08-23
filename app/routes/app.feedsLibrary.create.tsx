import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useNavigate, useRouteLoaderData } from "@remix-run/react";
import {
    BlockStack,
    Box,
    Button,
    Card,
    DropZone,
    InlineGrid,
    InlineStack,
    Page,
    Select,
    Text,
    TextField,
    Thumbnail,
    Modal,
    Checkbox,
    Divider,
    ButtonGroup,
} from "@shopify/polaris";
import { PlayCircleIcon, NoteIcon } from "@shopify/polaris-icons";
import { createFeeds } from "app/actions/feeds.action";
import { authenticate } from "app/shopify.server";
import { useCallback, useState } from "react";
import { IAllVideo } from "types/allVideo.type";
import { IShopData } from "types/shop.type";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const payload = {
        storeId: formData.get('storeId'),
        name: formData.get('name'),
        widgetType: formData.get('widgetType'),
        status: formData.get('status'),
        videos: formData.getAll('videos'),
    };
    const result = await createFeeds(payload);
    return result;
};

interface Option {
    label: string;
    value: string;
}

export default function PageFeed() {
    const fetcher = useFetcher()

    // state
    const [name, setName] = useState("");
    const [selected, setSelected] = useState("active");
    const [files, setFiles] = useState<File[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [selectedVideos, setSelectedVideos] = useState<[]>([]);
    const { shopData, allVideos } = useRouteLoaderData("root") as { shopData: IShopData, allVideos: IAllVideo[] };
    const storeId = shopData.shop.id;

    // handler
    const handleVideoCheckboxChange = (id: string, checked: boolean) => {
        setSelectedVideos((prev: any) => {
            if (checked) {
                return [...prev, id]
            }
            else {
                return prev.filter((vid: any) => vid !== id)
            }
        })
    };

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        []
    );

    const handleNameInput = useCallback((value: string) => setName(value), []);
    const handleSelectChange = useCallback((value: string) => setSelected(value), []);

    const options: Option[] = [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
    ];

    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Select video from video library (max 100MB)" />
    );

    const createFeedsHandler = async () => {
        const formData = new FormData();
        formData.append("storeId", storeId);
        formData.append("name", name);
        formData.append("widgetType", "carousel");
        formData.append("status", selected);
        const videos = selectedVideos ?? [];
        videos.forEach((id: string) => formData.append("videos", id));
        fetcher.submit(formData, { method: "POST" });
        navigate("/app/feedsLibrary");
    }

    const uploadedFiles =
        files.length > 0 && (
            <InlineGrid>
                {files.map((file, index) => (
                    <InlineGrid key={index}>
                        <Thumbnail
                            size="small"
                            alt={file.name}
                            source={
                                validImageTypes.includes(file.type)
                                    ? window.URL.createObjectURL(file)
                                    : NoteIcon
                            }
                        />
                        <div>
                            {file.name}{" "}
                            <Text variant="bodySm" as="p">
                                {file.size} bytes
                            </Text>
                        </div>
                    </InlineGrid>
                ))}
            </InlineGrid>
        );

    return (
        <Page
            backAction={{ content: "Products", onAction: () => history.back() }}
            title="Create new Feed"
        >
            <BlockStack gap="500">
                <Card>
                    <Box paddingBlockStart="0">
                        <div className="flex gap-5">
                            <div className="w-[70%]">
                                <TextField
                                    value={name}
                                    onChange={handleNameInput}
                                    label="Feed Name"
                                    type="text"
                                    placeholder="Home page carousal"
                                    autoComplete="text"
                                    helpText={<span>Visible only to you.</span>}
                                />
                            </div>
                            <div className="w-[30%]">
                                <Select
                                    label="Feed Status"
                                    options={options}
                                    onChange={handleSelectChange}
                                    value={selected}
                                />
                            </div>
                        </div>
                    </Box>
                    <Box paddingBlockStart="400">
                        <InlineStack align="space-between" blockAlign="center">
                            <Text variant="bodyMd" as="p">
                                Videos
                            </Text>
                            <Button icon={PlayCircleIcon} onClick={() => setIsModalOpen(true)}>
                                Choose from My Videos
                            </Button>
                        </InlineStack>
                    </Box>
                    <Box paddingBlockStart="400">
                        <DropZone onDrop={handleDropZoneDrop} variableHeight>
                            <div className="h-[400px]">
                                {uploadedFiles}
                                {fileUpload}
                            </div>
                        </DropZone>
                    </Box>
                </Card>
            </BlockStack>

            {/* Modal starts here */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select videos to import"
            >
                <Modal.Section>
                    <BlockStack gap="500">
                        <Box paddingBlock="400">
                            <InlineGrid gap="400" columns={4}>
                                {allVideos && allVideos.map((item, i) => (
                                    <Box key={i} position="relative">
                                        <div className='h-64 w-full'>
                                            <video className="rounded-lg object-cover h-full" src={item.url}></video>
                                        </div>
                                        <div className="absolute top-2 left-2">
                                            <Checkbox
                                                checked={selectedVideos.includes(item._id as never)}
                                                onChange={(checked) => handleVideoCheckboxChange(item._id, checked)}
                                                labelHidden
                                                label=""
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
                                    All Videos Show
                                </Text>
                                <ButtonGroup>
                                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            createFeedsHandler();
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </InlineStack>
                        </BlockStack>
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </Page>
    );
}
