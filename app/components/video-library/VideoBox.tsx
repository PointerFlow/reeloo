import {
  Card,
  Button,
  Divider,
  Text,
  BlockStack,
  InlineStack,
  Popover,
  ActionList,
  Icon,
  Box,
  TextField,
  ChoiceList,
  OptionList,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { SearchIcon, FilterIcon, SortIcon } from "@shopify/polaris-icons";
import {
  ProductIcon,
  ProductAddIcon,
} from "@shopify/polaris-icons";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { IShopifyProduct } from "types/shopifyProduct.type";
import { IAllVideo } from "types/allVideo.type";
import PopupModal from "../home/PopupModal";
import VideoCard from "./VideoCard";

export default function VideoBox() {
  const fetcher = useFetcher();
  const { allVideos, shopifyProducts } = useRouteLoaderData("root") as {
    allVideos: IAllVideo[];
    shopifyProducts: IShopifyProduct[];
  };
  // states
  const [active, setActive] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [Vtitle, setVtitle] = useState("");
  const [Vstatus, setVstatus] = useState("");
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

  const videoIdHandler = (id: string, title: string, status: string) => {
    setVideoId(id);
    setVtitle(title)
    setVstatus(status);
  }

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
        <VideoCard
          allVideos={allVideos}
          deleteHandler={deleteHandler}
          shopifyProducts={shopifyProducts}
          setIsPopupOpen={setIsPopupOpen}
          setSelectedProductIds={setSelectedProductIds}
          videoIdHandler={videoIdHandler}
        />

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
        videoId={videoId}
        Vtitle={Vtitle}
        Vstatus={Vstatus}
      />
    </>
  );
}
