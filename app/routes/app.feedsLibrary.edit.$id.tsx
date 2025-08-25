import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import {
    Page,
    Layout,
    Card,
    TextField,
    Select,
    Button,
    Text,
    ButtonGroup,
    Pagination,
    BlockStack,
    InlineStack,
    Checkbox,
    Divider,
} from "@shopify/polaris";
import {
    ViewIcon,
    PlusIcon,
    DeleteIcon
} from '@shopify/polaris-icons';
import { getAfeed } from "app/actions/feeds.action";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import { IShopifyProduct } from "types/shopifyProduct.type";
import { getProductByIds } from "app/helper/utils";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    const { id } = params;
    const feed = await getAfeed(id as string);
    return { feed: feed.data };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};

export default function page() {
    // load a feed
    const { feed } = useLoaderData<any>();
    const { shopifyProducts } = useRouteLoaderData("root") as {
        shopifyProducts: IShopifyProduct[];
    };

    // pagination
    const [currenPage, setCurrentPage] = useState(1);
    const showItemPerPage = 5;
    const videos = feed?.feed?.videos || [];
    const totalPage = Math.ceil(videos.length / showItemPerPage);
    const startIndex = (currenPage - 1) * showItemPerPage;
    const paginatedVideos = videos.slice(startIndex, startIndex + showItemPerPage);


    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
    ];

    const [checked, setChecked] = useState<string[]>([]);
    const handleChange = (id: string) => {
       setChecked(prev => {
        if(prev.includes(id)) {
            return prev.filter(_id => _id != id);
        } else {
            return [...prev, id];
        }
       });
    }


    return (
        <Page
            backAction={{ content: "Settings", onAction: () => { history.back() } }}
            title="Edit Feed"
            subtitle="Manage your video feeds and organize your shoppable content efficiently."
            primaryAction={{
                icon: PlusIcon,
                content: "Add More Videos",
            }}
            secondaryActions={[
                {
                    icon: ViewIcon,
                    content: "Preview",
                    onAction: () => console.log("Preview clicked"),
                },
            ]}
        >
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="500">
                            <Text variant="headingMd" as="h2">
                                Information
                            </Text>
                            <Layout>
                                <Layout.Section>
                                    <TextField
                                        autoComplete="off"
                                        label="Feed Title"
                                        value={feed?.feed?.name || ""}
                                        placeholder="Write a feed title"
                                        requiredIndicator
                                    />
                                </Layout.Section>
                                <Layout.Section variant="oneThird">
                                    <Select
                                        label="Feed Status"
                                        options={statusOptions}
                                        value={feed?.feed?.status}
                                    />
                                </Layout.Section>
                            </Layout>
                        </BlockStack>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <TextField
                                autoComplete="off"
                                label=""
                                placeholder="Search video"
                                value=""
                                clearButton
                                onClearButtonClick={() => { }}
                            />
                            {
                                paginatedVideos && paginatedVideos.map((item: any) => {
                                    const resolvedProducts: any = getProductByIds(item.products || [], shopifyProducts);
                                    return (
                                        <div key={item._id}>
                                            <Divider />
                                            <div className="flex items-center justify-between w-11/12 py-4">
                                                <InlineStack blockAlign="center" gap="200">
                                                    <Checkbox
                                                        label=""
                                                        checked={checked.includes(item._id)}
                                                        onChange={() => handleChange(item._id)}
                                                    />
                                                    <video className="w-20 h-20 object-cover" src={item?.url}></video>
                                                    <Text as="span">Beautiful caucasian...Mp4</Text>
                                                </InlineStack>

                                                <InlineStack gap="200" blockAlign="center">

                                                    {
                                                        resolvedProducts && resolvedProducts.slice(0, 3).map((product: any) => {
                                                            return (
                                                                <div key={product._id}>
                                                                    <Card padding="200">
                                                                        <img className="w-10 h-10" src={product?.featuredMedia?.preview?.image?.url} width={40} height={40} alt={product.title} />
                                                                    </Card>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    {item?.products?.length > 3 && (
                                                        <Text as="p" variant="bodyMd">
                                                            +{item.products.length - 3} More..
                                                        </Text>
                                                    )}
                                                </InlineStack>
                                                <Button tone="critical" icon={DeleteIcon}></Button>
                                            </div>
                                            <Divider />
                                        </div>
                                    )
                                })
                            }
                            <Pagination
                                hasPrevious={currenPage > 1}
                                onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                hasNext={currenPage < totalPage}
                                onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPage))}
                                label={`${currenPage} / ${totalPage}`}
                            />
                        </BlockStack>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <ButtonGroup>
                        <Button>Cancel</Button>
                        <Button variant="primary">Save Changes</Button>
                    </ButtonGroup>
                </Layout.Section>
            </Layout>
        </Page>
    );
}