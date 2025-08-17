import { redirect, useNavigate, useRouteLoaderData } from "@remix-run/react";
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
import { useCallback, useEffect, useState } from "react";
import { IAllVideo } from "types/allVideo.type";
import { IShopData } from "types/shop.type";

interface Option {
    label: string;
    value: string;
}
export default function PageFeed() {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState("today");
    const [files, setFiles] = useState<File[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
    const storeId = shopData.shop.id;
    const navigate = useNavigate();

    const [selectedVideos, setSelectedVideos] = useState<[]>([]);
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
        { label: "Active", value: "Active" },
        { label: "Diactive", value: "Diactive" },
    ];

    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Select video from video library (max 100MB)" />
    );

    // get all videoas api fetch
    const [data, setData] = useState<IAllVideo[]>([]);
    useEffect(() => {
        (async () => {
            const response = await fetch(`https://reelo-backend.vercel.app/api/v1/videos?storeId=${storeId}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            })
            const data = await response.json();
            setData(data.data.videos);
        })()
    }, [])
    // create feeds 
    const payload = {
        storeId: storeId,
        name: name,
        widgetType: "carousel",
        videos: selectedVideos,
    };
    const createFeedsHandler = async () => {
        const result = await fetch("https://reelo-backend.vercel.app/api/v1/feeds", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(payload),
        })
        await result.json();
        redirect("feedsLibrary");
        if (result.ok) {
            navigate("/app/feedsLibrary");
        }
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
                                {data.map((item, i) => (
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
