import {
  Card,
  Button,
  Divider,
  EmptyState,
  Text,
  BlockStack,
  InlineStack,
  Popover,
  ActionList,
  Icon,
  Box,
  VideoThumbnail,
  InlineGrid,
  Thumbnail,
  TextField,
  ChoiceList,
  OptionList,
  Modal,
  Combobox,
  Listbox,
  Checkbox,
  ButtonGroup,
  Link,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { SearchIcon, FilterIcon, SortIcon } from "@shopify/polaris-icons";
import emtyvideoImg from "../../Images/emty_video.png";
import {
  PlusIcon,
  DeleteIcon,
  EditIcon,
  ProductIcon,
  ProductAddIcon,
} from "@shopify/polaris-icons";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { IShopifyProduct } from "types/shopifyProduct.type";
import { IAllVideo } from "types/allVideo.type";
import { getProductById } from "app/helper/utils";
import PopupModal from "../home/PopupModal";
import { singleProduct } from "types/singleproduct.type";

export default function VideoBox() {
  const fetcher = useFetcher();
  const { allVideos, shopifyProducts } = useRouteLoaderData("root") as {
    allVideos: IAllVideo[];
    shopifyProducts: IShopifyProduct[];
  };

  // states
  const [active, setActive] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState<string[]>([]);
  const [sortActive, setSortActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(["hidden"]);
  const [selectedContent, setSelectedContent] = useState<
    "All Video" | "Instagram" | "Tiktok" | "Device" | "Youtube"
  >("All Video");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedProducts, setSelectedProducts] = useState<IShopifyProduct[]>(
    [],
  );

  // methodes
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const handleChange = useCallback((value: string[]) => setSelected(value), []);

  const handleContentSelect = useCallback(
    (content: typeof selectedContent) => {
      setSelectedContent(content);
      toggleActive();
    },
    [toggleActive],
  );

  const activator = (
    <Button onClick={toggleActive} disclosure>
      {selectedContent}
    </Button>
  );

  const handleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addSelectedProducts = () => {
    const allSelectedProducts = shopifyProducts.filter((p) =>
      selectedProductIds.has(p.id),
    );
    setSelectedProducts(allSelectedProducts);
    setIsPopupOpen(false);
    setSelectedProductIds(new Set());
  };

  // handle delete video
  const deleteHandler = (id: string) => {
    fetcher.submit({ id }, { method: "DELETE" });
  };

  return (
    <>
      <Card>
        <BlockStack gap="300">
          <InlineStack blockAlign="center" align="space-between">
            <InlineStack gap="100">
              <Popover
                active={active}
                activator={activator}
                autofocusTarget="first-node"
                onClose={toggleActive}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: "All Video",
                      onAction: () => handleContentSelect("All Video"),
                      active: selectedContent === "All Video",
                    },
                    {
                      content: "Instagram",
                      onAction: () => handleContentSelect("Instagram"),
                      active: selectedContent === "Instagram",
                    },
                    {
                      content: "Tiktok",
                      onAction: () => handleContentSelect("Tiktok"),
                      active: selectedContent === "Tiktok",
                    },
                    {
                      content: "Device",
                      onAction: () => handleContentSelect("Device"),
                      active: selectedContent === "Device",
                    },
                    {
                      content: "Youtube",
                      onAction: () => handleContentSelect("Youtube"),
                      active: selectedContent === "Youtube",
                    },
                  ]}
                />
              </Popover>
              <Button variant="tertiary">Active</Button>
              <Button variant="tertiary">Draft</Button>
            </InlineStack>
            <InlineStack gap="200">
              <Box>
                <InlineStack gap="200">
                  {searchActive ? (
                    <InlineStack gap="100" blockAlign="center">
                      <Box minWidth="400px">
                        <TextField
                          label="Search videos"
                          labelHidden
                          autoComplete="off"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={setSearchQuery}
                          prefix={<Icon source={SearchIcon} />}
                          clearButton
                          onClearButtonClick={() => {
                            setSearchQuery("");
                            setSearchActive(false);
                          }}
                          autoFocus
                        />
                      </Box>
                      <Button
                        variant="tertiary"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchActive(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </InlineStack>
                  ) : (
                    <div onClick={() => setSearchActive(true)}>
                      <Card padding="100">
                        <div className="cursor-pointer">
                          <InlineStack>
                            <Icon source={SearchIcon} />
                            <Icon source={FilterIcon} />
                          </InlineStack>
                        </div>
                      </Card>
                    </div>
                  )}
                </InlineStack>
              </Box>
              <Popover
                active={sortActive}
                activator={
                  <Button
                    icon={SortIcon}
                    onClick={() => setSortActive(!sortActive)}
                  ></Button>
                }
                onClose={() => setSortActive(false)}
              >
                <Box padding="200" minWidth="163px">
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">
                      Sort By
                    </Text>
                    <ChoiceList
                      title=""
                      choices={[
                        { label: "Tagging Status", value: "Tagging Status" },
                        { label: "Date Range", value: "Date Range" },
                      ]}
                      selected={selected}
                      onChange={handleChange}
                    />
                    <Divider />
                    <OptionList
                      title=""
                      onChange={setSelectedBtn}
                      options={[
                        {
                          label: (
                            <>
                              <InlineStack align="center" gap="200">
                                <Icon source={ProductIcon} />
                                <Text as="span" variant="bodyMd">
                                  Tagged
                                </Text>
                              </InlineStack>
                            </>
                          ),
                          value: "Tagged",
                        },
                        {
                          label: (
                            <>
                              <InlineStack align="center" gap="200">
                                <Icon source={ProductAddIcon} />
                                <Text as="span" variant="bodyMd">
                                  Untagged
                                </Text>
                              </InlineStack>
                            </>
                          ),
                          value: "Untagged",
                        },
                      ]}
                      selected={selectedBtn}
                    />
                  </BlockStack>
                </Box>
              </Popover>
            </InlineStack>
          </InlineStack>
          <Divider />
        </BlockStack>
        {/* video card */}
        <Box paddingBlock="400">
          {allVideos.length > 0 ? (
            <InlineGrid columns={4} gap="300">
              {allVideos.map((item, id) => (
                <Card padding="0" key={id}>
                  <Box position="relative">
                    <div className="h-64 w-full">
                      <video
                        className="h-full w-full object-cover"
                        src={item?.url}
                      ></video>
                    </div>
                    <div
                      className="absolute top-2 right-2 bg-white rounded-lg p-1 cursor-pointer"
                      onClick={() => deleteHandler(item._id)}
                    >
                      <Icon tone="critical" source={DeleteIcon} />
                    </div>
                    <div className="absolute top-2 right-11 bg-white rounded-lg p-1 cursor-pointer">
                      <Link
                        monochrome
                        url={`/app/videoLibrary/edit/${item._id}`}
                      >
                        <Icon source={EditIcon} />
                      </Link>
                    </div>
                    <div className="flex gap-1 absolute top-2 left-2 bg-black rounded-lg px-2 py-0.5 cursor-pointer">
                      <Icon
                        source={() => (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7C11.6569 7 13 8.34315 13 10ZM11.5 10C11.5 10.8284 10.8284 11.5 10 11.5C9.17157 11.5 8.5 10.8284 8.5 10C8.5 9.17157 9.17157 8.5 10 8.5C10.8284 8.5 11.5 9.17157 11.5 10Z"
                              fill="#F8FFFB"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10 4C7.52353 4 5.65153 5.22977 4.42264 6.53216C3.80748 7.18413 3.34017 7.86704 3.02329 8.45447C2.86488 8.74811 2.73973 9.02591 2.65225 9.27169C2.57143 9.49874 2.5 9.76019 2.5 10C2.5 10.2398 2.57143 10.5013 2.65225 10.7283C2.73973 10.9741 2.86488 11.2519 3.02329 11.5455C3.34017 12.133 3.80748 12.8159 4.42264 13.4678C5.65153 14.7702 7.52353 16 10 16C12.4765 16 14.3485 14.7702 15.5774 13.4678C16.1925 12.8159 16.6598 12.133 16.9767 11.5455C17.1351 11.2519 17.2603 10.9741 17.3478 10.7283C17.4286 10.5013 17.5 10.2398 17.5 10C17.5 9.76019 17.4286 9.49874 17.3478 9.27169C17.2603 9.02591 17.1351 8.74811 16.9767 8.45447C16.6598 7.86704 16.1925 7.18413 15.5774 6.53216C14.3485 5.22977 12.4765 4 10 4ZM4.00141 10.0021L4.00103 10L4.00141 9.99793C4.00509 9.97812 4.01827 9.90708 4.0654 9.77469C4.12269 9.61374 4.21422 9.40618 4.34345 9.16663C4.60183 8.68764 4.9936 8.11275 5.51365 7.56159C6.55519 6.45773 8.05819 5.5 10 5.5C11.9418 5.5 13.4448 6.45773 14.4864 7.56159C15.0064 8.11275 15.3982 8.68764 15.6566 9.16663C15.7858 9.40618 15.8773 9.61374 15.9346 9.77469C15.9817 9.90708 15.9949 9.97813 15.9986 9.99793L15.999 10L15.9986 10.0021C15.9949 10.0219 15.9817 10.0929 15.9346 10.2253C15.8773 10.3863 15.7858 10.5938 15.6566 10.8334C15.3982 11.3124 15.0064 11.8873 14.4864 12.4384C13.4448 13.5423 11.9418 14.5 10 14.5C8.05819 14.5 6.55519 13.5423 5.51365 12.4384C4.9936 11.8873 4.60183 11.3124 4.34345 10.8334C4.21422 10.5938 4.12269 10.3863 4.0654 10.2253C4.01827 10.0929 4.00509 10.0219 4.00141 10.0021Z"
                              fill="#F8FFFB"
                            />
                          </svg>
                        )}
                      />
                      <span className="text-white">{item?.views}</span>
                    </div>
                  </Box>
                  <Box padding="200">
                    <BlockStack gap="300">
                      <InlineStack gap="100" blockAlign="center">
                        {item.products.slice(0, 3).map((productId, index) => (
                          <Thumbnail
                            key={index}
                            source={
                              getProductById(productId, shopifyProducts)
                                ?.featuredMedia.preview.image.url
                            }
                            size="small"
                            alt={
                              getProductById(productId, shopifyProducts)
                                ?.title || ""
                            }
                          />
                        ))}
                        {item.products.length > 3 && (
                          <Text as="p" variant="bodyMd">
                            +{item.products.length - 3} More..
                          </Text>
                        )}
                      </InlineStack>
                      <Button
                        fullWidth
                        icon={PlusIcon}
                        variant="primary"
                        // onClick={togglePopup}
                        onClick={() => {
                          setIsPopupOpen(true);
                          // prefill already tagged products if needed
                          const taggedIds = item.products || [];
                          setSelectedProductIds(new Set(taggedIds));
                        }}
                      >
                        Tag Products
                      </Button>
                    </BlockStack>
                  </Box>
                </Card>
              ))}
            </InlineGrid>
          ) : (
            <EmptyState
              heading="Your video library is empty"
              image={emtyvideoImg}
            >
              <Text as="p" variant="bodyMd">
                Start uploading now.
              </Text>
            </EmptyState>
          )}
        </Box>
      </Card>
      {/* popup product modal */}
      <PopupModal
        isProductModalOpen={isPopupOpen}
        setIsProductModalOpen={setIsPopupOpen}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
        shopifyProducts={shopifyProducts as any}
        filteredProducts={shopifyProducts as any}
        addSelectedProducts={addSelectedProducts}
        handleProductSelection={handleProductSelection}
      />
    </>
  );
}
