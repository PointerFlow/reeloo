import {
  BlockStack,
  Box,
  Checkbox,
  EmptyState,
  Icon,
  InlineStack,
  Modal,
  ResourceItem,
  ResourceList,
  TextField,
  Thumbnail,
  Text,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { singleProduct } from "./../../../types/singleproduct.type";
import { popupProducts } from "types/popupProducts.type";
import { useState } from "react";
import { searchProducts } from "app/helper/utils";
import { useFetcher } from "@remix-run/react";

export default function PopupModal({
  isProductModalOpen,
  setIsProductModalOpen,
  setSelectedProductIds,
  selectedProductIds,
  shopifyProducts,
  filteredProducts,
  addSelectedProducts,
  handleProductSelection,
  videoId,
  Vtitle,
  Vstatus,
}: popupProducts) {
  const fetcher = useFetcher();
  const [searchQuery, setSearchQuery] = useState("");
  const serchprduct = searchProducts(Array.isArray(shopifyProducts) ? shopifyProducts : [], searchQuery);

  // video update handler
  const updateHandler = () => {
    const productIds = Array.from(selectedProductIds).filter((id: string) => !!id);
    const formData = new FormData();
    formData.append("id", videoId || "")
    formData.append("title", Vtitle || "");
    formData.append("status", Vstatus || "");
    productIds.forEach((id: string) => formData.append("products", id));
    fetcher.submit(formData, { method: "PATCH" });
  };
  
  return (
    <>
      <Modal
        open={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProductIds(new Set());
        }}
        title="Select Products"
        primaryAction={{
          content: `Add Selected (${selectedProductIds.size})`,
          onAction: () => {
            addSelectedProducts();
            updateHandler();
          },
          disabled: selectedProductIds.size === 0,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setIsProductModalOpen(false);
              setSelectedProductIds(new Set());
            },
          },
        ]}
      >
        <Modal.Section>
          <Box paddingBlockEnd="400">
            <TextField
              label="Search"
              autoComplete="off"
              placeholder="Search products..."
              prefix={<Icon source={SearchIcon} />}
              clearButton
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              onClearButtonClick={() => setSearchQuery("")}
            />
          </Box>

          {!shopifyProducts || filteredProducts.length === 0 ? (
            <EmptyState
              heading="No products found"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Try adjusting your search terms</p>
            </EmptyState>
          ) : (
            <ResourceList
              resourceName={{ singular: "product", plural: "products" }}
              items={serchprduct}
              renderItem={(product: singleProduct) => (
                <ResourceItem
                  id={product.id}
                  onClick={() => handleProductSelection(product.id)}
                >
                  <InlineStack gap="300" blockAlign="center">
                    <Checkbox
                      label=""
                      checked={selectedProductIds.has(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                    />
                    <Thumbnail
                      source={product?.featuredMedia?.preview?.image?.url || ""}
                      alt={product.title}
                      size="small"
                    />
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd">
                        {product.title || ""}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                </ResourceItem>
              )}
            />
          )}
        </Modal.Section>
      </Modal>
    </>
  );
}
