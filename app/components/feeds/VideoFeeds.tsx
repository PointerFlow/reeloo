import {
    Box,
    Button,
    Card,
    EmptyState,
    Text,
    Page,
    Badge,
    InlineStack,
    IndexTable,
    useIndexResourceState,
    Tabs,
    Modal,
    Toast,
    Frame
} from "@shopify/polaris";
import emtyvideoImg from "../../Images/vidoeFeed.png";
import {
    OrderDraftIcon,
    EditIcon,
    ViewIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DeleteIcon
} from '@shopify/polaris-icons';
import { useNavigate, useRouteLoaderData } from "@remix-run/react";
import { IShopData } from "types/shop.type";
import { useEffect, useState, useCallback } from "react";
import { IFeedsDataAll } from "types/allFeeds.type";

export default function VideoFeeds() {
    const navigate = useNavigate();
    const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
    const storeId = shopData.shop.id;
    const [data, setData] = useState<IFeedsDataAll[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const itemsPerPage = 10;
    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const resourceName = {
        singular: 'video',
        plural: 'videos',
    };
    const {
        selectedResources,
        allResourcesSelected,
        handleSelectionChange,
        clearSelection
    } = useIndexResourceState(data.map(item => ({ ...item, id: item._id })));

    const tabs = [
        { id: 'all-videos', content: 'All Videos' },
        { id: 'active', content: 'Active' },
        { id: 'draft', content: 'Draft' },
    ];

    const handleTabChange = useCallback((selectedTabIndex: number) => {
        setSelectedTab(selectedTabIndex);
        clearSelection();
    }, [clearSelection]);

    // Fetch feeds
    const fetchFeeds = useCallback(async () => {
        try {
            const response = await fetch(
                `https://reelo-backend.vercel.app/api/v1/feeds?storeId=${storeId}`,
                { method: "GET", headers: { "content-type": "application/json" } }
            );
            const responseData = await response.json();
            setData(responseData.data.feeds);
        } catch (error) {
            setData([]);
        }
    }, [storeId]);

    useEffect(() => {
        fetchFeeds();
    }, [fetchFeeds]);

    // Show delete confirmation
    const handleDeleteClick = () => {
        if (selectedResources.length > 0) {
            setShowDeleteModal(true);
        }
    };

    // Delete selected feeds
    const handleDeleteSelected = async () => {
        if (selectedResources.length === 0) return;
        setIsDeleting(true);
        try {
            await Promise.all(
                selectedResources.map(id =>
                    fetch(`https://reelo-backend.vercel.app/api/v1/feeds/${id}`, {
                        method: "DELETE",
                        headers: { "content-type": "application/json" }
                    })
                )
            );
            setData(prev => prev.filter(feed => !selectedResources.includes(feed._id)));
            clearSelection();
            setShowDeleteModal(false);
            setToastMessage(`Successfully deleted ${selectedResources.length} feed${selectedResources.length > 1 ? 's' : ''}`);
            setShowToast(true);

            // Reset pagination if necessary
            const remainingItems = data.length - selectedResources.length;
            const newTotalPages = Math.ceil(remainingItems / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(1);
            }

        } catch (error) {
            setToastMessage("Error deleting feeds. Please try again.");
            setShowToast(true);
        } finally {
            setIsDeleting(false);
        }
    };
    // pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Show empty state if no data
    if (data.length === 0) {
        return (
            <Frame>
                <Page>
                    <Card>
                        <Box paddingBlock="800">
                            <EmptyState
                                heading="No feeds created yet"
                                image={emtyvideoImg}
                            >
                                <Text as="p" variant="bodyMd">
                                    Start by creating one to showcase your video content.
                                </Text>
                                <Box paddingBlockStart="400">
                                    <Button
                                        variant="primary"
                                        icon={OrderDraftIcon}
                                        onClick={() => navigate('create')}
                                    >
                                        Create Feed
                                    </Button>
                                </Box>
                            </EmptyState>
                        </Box>
                    </Card>
                </Page>
                {showToast && (
                    <Toast
                        content={toastMessage}
                        onDismiss={() => setShowToast(false)}
                        duration={3000}
                    />
                )}
            </Frame>
        );
    }
    const rowMarkup = paginatedData.map((feed, index) => (
        <IndexTable.Row
            id={feed._id}
            key={feed._id}
            selected={selectedResources.includes(feed._id)}
            position={index + (currentPage - 1) * itemsPerPage}
        >
            <IndexTable.Cell>
                <Text variant="headingSm" as="span">{feed.name}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{feed.videos.length} Videos</IndexTable.Cell>
            <IndexTable.Cell>
                <Badge tone="success">{feed.status}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="p" variant="bodySm" tone="subdued">
                    {new Date().toLocaleDateString()}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <InlineStack gap="200">
                    <Button
                        size="micro"
                        variant="tertiary"
                        icon={EditIcon}
                        onClick={() => navigate(`edit/${feed._id}`)}
                        accessibilityLabel="Edit feed"
                    />
                    <Button
                        size="micro"
                        variant="tertiary"
                        icon={ViewIcon}
                        onClick={() => navigate(`view/${feed._id}`)}
                        accessibilityLabel="View feed"
                    />
                </InlineStack>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <Frame>
            <Page>
                <Card>
                    <Tabs
                        tabs={tabs}
                        selected={selectedTab}
                        onSelect={handleTabChange}
                    />

                    <IndexTable
                        resourceName={resourceName}
                        itemCount={data.length}
                        selectedItemsCount={
                            allResourcesSelected ? 'All' : selectedResources.length
                        }
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: 'Feeds Name' },
                            { title: 'Total Videos' },
                            { title: 'Status' },
                            { title: 'Created' },
                            { title: 'Action' },
                        ]}
                        promotedBulkActions={[
                            {
                                content: 'Delete',
                                icon: DeleteIcon,
                                onAction: handleDeleteClick,
                            },
                        ]}
                    >
                        {rowMarkup}
                    </IndexTable>

                    {/* Pagination - Only show if there's data */}
                    {data.length > 0 && (
                        <Box padding="400">
                            <InlineStack align="center" gap="200">
                                <Button
                                    size="slim"
                                    disabled={currentPage === 1}
                                    onClick={handlePrev}
                                    icon={ChevronLeftIcon}
                                />
                                <Text as="p" variant="bodyMd" tone="subdued">
                                    {currentPage}/{totalPages}
                                </Text>
                                <Button
                                    size="slim"
                                    disabled={currentPage === totalPages}
                                    onClick={handleNext}
                                    icon={ChevronRightIcon}
                                />
                            </InlineStack>
                        </Box>
                    )}
                </Card>

                {/* Delete Confirmation Modal */}
                <Modal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete feeds"
                    primaryAction={{
                        content: 'Delete',
                        onAction: handleDeleteSelected,
                        destructive: true,
                        loading: isDeleting,
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => setShowDeleteModal(false),
                        },
                    ]}
                >
                    <Modal.Section>
                        <Text as="p">
                            Are you sure you want to delete {selectedResources.length} feed{selectedResources.length > 1 ? 's' : ''}?
                            This action cannot be undone.
                        </Text>
                    </Modal.Section>
                </Modal>
            </Page>

            {/* Success/Error Toast */}
            {showToast && (
                <Toast
                    content={toastMessage}
                    onDismiss={() => setShowToast(false)}
                    duration={3000}
                />
            )}
        </Frame>
    );
}