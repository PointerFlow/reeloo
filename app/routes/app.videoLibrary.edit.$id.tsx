import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  BlockStack,
  Card,
  InlineGrid,
  Page,
  Select,
  Text,
  TextField,
  Button,
  Box,
  InlineStack,
  Icon,
  Frame,
  Thumbnail,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useCallback, useState, useEffect } from "react";
import {
  ImportIcon,
  ViewIcon,
  FileIcon,
  ClockIcon,
  HashtagIcon,
  PageAttachmentIcon,
  DeleteIcon,
  PlusIcon,
  OrderDraftIcon,
  DesktopIcon,
  TabletIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import {
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import { getVideoByid, updateVideo } from "app/actions/video.action";
import { IAllproduct } from "types/allproduct.type";
import { IImportVideo } from "types/IImportVideo.type";
import PopupModal from "app/components/home/PopupModal";
import { singleProduct } from "types/singleproduct.type";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const { id } = params;
  const video = await getVideoByid(id as string);
  return video;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const { id } = params;
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const status = formData.get("status") as string;
    const products = formData.getAll("products") as string[];
    const result = await updateVideo(id as string, title, status, products);
    return result;
  } catch (e) {
    return e;
  }
};

type PreviewDevice = "desktop" | "tablet" | "mobile";
export default function PageComponent() {
  const fetcher = useFetcher();
  const { video } = useLoaderData<IImportVideo>();
  const routeData = useRouteLoaderData("root");
  const shopifyProducts = (routeData as { shopifyProducts: IAllproduct })
    ?.shopifyProducts;

  // Get initial tagged products
  const tagProductIds = video?.products || [];
  const initialTaggedProducts = Object.values(shopifyProducts || {}).filter(
    (product: singleProduct) => tagProductIds.includes(product.id),
  );

  // Form states
  const [videoTitle, setVideoTitle] = useState(video?.title || "");
  const [videoStatus, setVideoStatus] = useState(video?.status || "Active");
  const [selectedProducts, setSelectedProducts] = useState<singleProduct[]>(
    initialTaggedProducts,
  );

  // UI states
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );

  // Initialize selectedProductIds with already tagged products when modal opens
  useEffect(() => {
    if (isProductModalOpen) {
      const taggedIds = selectedProducts.map((p) => p.id);
      setSelectedProductIds(new Set(taggedIds));
    }
  }, [isProductModalOpen, selectedProducts]);

  const handleStatusChange = useCallback(
    (value: string) => setVideoStatus(value),
    [],
  );

  const videoStatusOptions = [
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
  ];

  const handleProductSelection = useCallback((productId: string) => {
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const addSelectedProducts = useCallback(() => {
    if (!shopifyProducts) return;

    // Get all selected products (both old and new)
    const allSelectedProducts = Object.values(shopifyProducts).filter(
      (p: singleProduct) => selectedProductIds.has(p.id),
    );

    setSelectedProducts(allSelectedProducts);
    setSelectedProductIds(new Set());
    setIsProductModalOpen(false);
    setProductSearchQuery("");
  }, [selectedProductIds, shopifyProducts]);

  // Filter products based on search query
  const filteredProducts = Object.values(shopifyProducts || {}).filter(
    (product: singleProduct) =>
      product.title.toLowerCase().includes(productSearchQuery.toLowerCase()),
  );

  // video update handler
  const updateHandler = () => {
    const productIds = selectedProducts
      .map((p: singleProduct) => p.id)
      .filter((id: string) => !!id);
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("status", videoStatus);
    productIds.forEach((id: string) => formData.append("products", id));
    fetcher.submit(formData, { method: "PATCH" });
  };

  const formatVideoSize = (bytes: number) => {
    if (!bytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const removeProduct = useCallback((productId: string) => {
    setSelectedProducts((prev: singleProduct[]) =>
      prev.filter((p) => p.id !== productId),
    );
  }, []);

  return (
    <Frame>
      <Page
        backAction={{
          content: "Videos",
          onAction: () => {},
        }}
        title="Edit Video Details"
        subtitle="Manage your videos, tag products, and build engaging shoppable content."
        primaryAction={{
          content: fetcher.state === "submitting" ? "Updating..." : "Update",
          onAction: updateHandler,
          loading: fetcher.state === "submitting",
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {},
          },
        ]}
      >
        {/* Product Selection Modal */}
        <PopupModal
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          setSelectedProductIds={setSelectedProductIds}
          selectedProductIds={selectedProductIds}
          shopifyProducts={shopifyProducts}
          filteredProducts={filteredProducts}
          addSelectedProducts={addSelectedProducts}
          handleProductSelection={handleProductSelection}
        />

        <InlineGrid gap="500" columns={["twoThirds", "oneThird"]}>
          <BlockStack gap="500">
            {/* Info Section */}
            <Card>
              <Box paddingBlockEnd="300">
                <Text variant="headingSm" as="h6">
                  Information
                </Text>
              </Box>
              <InlineGrid gap="400" columns={["twoThirds", "oneThird"]}>
                <TextField
                  autoComplete="off"
                  label="Video Title"
                  value={videoTitle}
                  onChange={setVideoTitle}
                  placeholder="Write a video title"
                  requiredIndicator
                  error={!videoTitle ? "Title is required" : undefined}
                />
                <Select
                  label="Video Status"
                  options={videoStatusOptions}
                  onChange={handleStatusChange}
                  value={videoStatus}
                />
              </InlineGrid>
            </Card>

            {/* Video Details */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h6">
                  Video Details
                </Text>
                <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
                  <Box>
                    <video
                      className="rounded-lg w-full h-full object-cover"
                      controls
                    >
                      <source src={video?.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                  <BlockStack gap="200">
                    {[
                      {
                        icon: ImportIcon,
                        label: `Source: ${video?.source || "Unknown"}`,
                      },
                      {
                        icon: ViewIcon,
                        label: `Views: ${video?.views?.toLocaleString() || "0"}`,
                      },
                      {
                        icon: FileIcon,
                        label: `Size: ${formatVideoSize(video?.size)}`,
                      },
                      {
                        icon: ClockIcon,
                        label: `Duration: ${formatDuration(video?.duration)}`,
                      },
                      {
                        icon: HashtagIcon,
                        label: `Dimensions: ${video?.width || "?"}×${video?.height || "?"}`,
                      },
                      {
                        icon: PageAttachmentIcon,
                        label: `Format: ${video?.format || "Unknown"}`,
                      },
                    ].map((item, idx) => (
                      <Card key={idx} padding="300">
                        <InlineStack blockAlign="center" gap="300">
                          <Card padding="100">
                            <Icon source={item.icon} />
                          </Card>
                          <Text as="span" variant="bodySm">
                            {item.label}
                          </Text>
                        </InlineStack>
                      </Card>
                    ))}
                  </BlockStack>
                </InlineGrid>
              </BlockStack>
            </Card>

            {/* Tagged Products */}
            <Card>
              <BlockStack gap="300">
                <InlineStack blockAlign="center" align="space-between">
                  <Text variant="headingSm" as="h6">
                    Tagged Products
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    {selectedProducts.length} product
                    {selectedProducts.length !== 1 ? "s" : ""} tagged
                  </Text>
                </InlineStack>

                {selectedProducts.length === 0 ? (
                  <BlockStack gap="300">
                    <Text as="span" variant="bodySm">
                      Tag products to make your video shoppable
                    </Text>
                    <Button
                      variant="primary"
                      icon={PlusIcon}
                      onClick={() => setIsProductModalOpen(true)}
                    >
                      Add Product
                    </Button>
                  </BlockStack>
                ) : (
                  <InlineGrid gap="200" columns={2}>
                    {selectedProducts.map((product: singleProduct) => (
                      <Card key={product.id} padding="300">
                        <InlineStack
                          gap="100"
                          align="space-between"
                          blockAlign="center"
                        >
                          <InlineStack gap="300" blockAlign="center">
                            <Thumbnail
                              source={
                                product?.featuredMedia?.preview?.image?.url
                              }
                              alt={product.title}
                              size="small"
                            />
                            <BlockStack gap="100">
                              <div className="w-44">
                                <Text
                                  as="span"
                                  variant="bodySm"
                                  fontWeight="medium"
                                >
                                  {product.title}
                                </Text>
                              </div>
                            </BlockStack>
                          </InlineStack>
                          <Button
                            icon={DeleteIcon}
                            variant="plain"
                            onClick={() => removeProduct(product.id)}
                            accessibilityLabel={`Remove ${product.title}`}
                          />
                        </InlineStack>
                      </Card>
                    ))}

                    {/* Add Product Button */}
                    <Card padding="300">
                      <InlineStack gap="300" blockAlign="center">
                        <Card padding="100">
                          <Icon source={PlusIcon} />
                        </Card>
                        <Button
                          variant="plain"
                          onClick={() => setIsProductModalOpen(true)}
                        >
                          Add Product
                        </Button>
                      </InlineStack>
                    </Card>
                  </InlineGrid>
                )}
              </BlockStack>
            </Card>
          </BlockStack>

          {/* Preview Card */}
          <div className="sticky top-4">
            <Card>
              <BlockStack gap="300">
                <InlineStack blockAlign="center" align="space-between">
                  <Text variant="headingSm" as="h6">
                    Preview
                  </Text>
                  <InlineStack gap="100">
                    <Button
                      variant={
                        previewDevice === "desktop" ? "primary" : "secondary"
                      }
                      icon={DesktopIcon}
                      onClick={() => setPreviewDevice("desktop")}
                      accessibilityLabel="Desktop preview"
                    />
                    <Button
                      variant={
                        previewDevice === "tablet" ? "primary" : "secondary"
                      }
                      icon={TabletIcon}
                      onClick={() => setPreviewDevice("tablet")}
                      accessibilityLabel="Tablet preview"
                    />
                    <Button
                      variant={
                        previewDevice === "mobile" ? "primary" : "secondary"
                      }
                      icon={MobileIcon}
                      onClick={() => setPreviewDevice("mobile")}
                      accessibilityLabel="Mobile preview"
                    />
                  </InlineStack>
                </InlineStack>

                <div
                  className={`
                                    mx-auto transition-all duration-200
                                    ${previewDevice === "desktop" ? "w-full" : ""}
                                    ${previewDevice === "tablet" ? "w-3/4" : ""}
                                    ${previewDevice === "mobile" ? "w-1/2" : ""}
                                `}
                >
                  <div className="h-96 w-full object-cover">
                    <video
                      className="rounded-lg w-full h-full object-cover"
                      controls
                    >
                      <source src={video?.url} type="video/mp4" />
                    </video>
                  </div>
                </div>

                <Box>
                  <InlineStack align="center">
                    <Button variant="primary" icon={OrderDraftIcon}>
                      Customize Style
                    </Button>
                  </InlineStack>
                </Box>
              </BlockStack>
            </Card>
          </div>
        </InlineGrid>
      </Page>
    </Frame>
  );
}
