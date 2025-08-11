import { BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Combobox, DropZone, InlineGrid, InlineStack, Page, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { ArrowLeftIcon, PlayCircleIcon, NoteIcon } from '@shopify/polaris-icons';
import { useCallback, useState } from "react";

interface Option {
    label: string;
    value: string;
}

export default function AppFeedsLibraryEdit() {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState('today');

    const [files, setFiles] = useState<File[]>([]);

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );
    const handleNameInput = useCallback(
        (value: string) => setName(value),
        []
    )

    const handleSelectChange = useCallback(
        (value: string) => setSelected(value),
        [],
    );

    const options: Option[] = [
        { label: 'Active', value: 'Active' },
        { label: 'Diactive', value: 'Diactive' },
    ];

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Select video from video library (max 100MB)" />
    );
    const uploadedFiles = files.length > 0 && (
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
                        {file.name}{' '}
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
            backAction={{ content: 'Products', onAction: () => { history.back() } }}
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
                                    helpText={
                                        <span>
                                            Visible only to you.
                                        </span>
                                    }
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
                            <Button icon={PlayCircleIcon}>
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
        </Page>
    )
}

function setSelected(value: string): any {
    throw new Error("Function not implemented.");
}

