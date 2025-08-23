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
  DeleteIcon,
} from '@shopify/polaris-icons';
import { useFetcher, useNavigate, useRevalidator, useRouteLoaderData } from "@remix-run/react";
import { useState, useCallback } from "react";
import { IFeedsDataAll } from "types/allFeeds.type";

export default function VideoFeeds() {
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { allFeeds } = useRouteLoaderData("root") as { allFeeds: IFeedsDataAll };

  // state
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const itemsPerPage = 10;

  // filter feeds by tabs
  const filterdFeeds = (Array.isArray(allFeeds) ? allFeeds : []).filter(feed => {
    if (selectedTab === 1) return feed.status === "active";
    if (selectedTab === 2) return feed.status === "draft";
    return true;
  })

  const paginatedData = filterdFeeds.slice(
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
  } = useIndexResourceState((Array.isArray(allFeeds) ? allFeeds : []).map(item => ({ ...item, id: item._id })));

  const tabs = [
    { id: 'all-videos', content: 'All Videos' },
    { id: 'active', content: 'Active' },
    { id: 'draft', content: 'Draft' },
  ];

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelectedTab(selectedTabIndex);
    clearSelection();
  }, [clearSelection]);

  // Show delete confirmation
  const handleDeleteClick = () => {
    if (selectedResources.length > 0) {
      setShowDeleteModal(true);
    }
  };

  // handle delete feeds
  const deleteHandler = async () => {
    if (!selectedResources.length) return;
    setIsDeleting(true);

    const formData = new FormData();
    selectedResources.forEach(id => formData.append("id", id));

    try {
      await fetcher.submit(formData, { method: "DELETE" });
      setToastMessage(`${selectedResources.length} feed${selectedResources.length > 1 ? 's' : ''} deleted successfully`);
      setShowToast(true);
      clearSelection();
      setShowDeleteModal(false);
      revalidator.revalidate();
    } catch (error) {
      setToastMessage("Failed to delete feeds. Please try again.");
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // pagination
  const totalPages = Math.ceil(filterdFeeds.length / itemsPerPage);
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // Show empty state if no data
  if (!Array.isArray(allFeeds) || allFeeds.length === 0) {
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
        {feed.status === "draft" ? (
          <Badge progress="complete">{feed.status}</Badge>
        ) : (
          <Badge progress="complete" tone="success">{feed.status}</Badge>
        )}
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
            itemCount={filterdFeeds.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
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

          {/* Pagination */}
          {allFeeds.length > 0 && (
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
            onAction: deleteHandler,
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
