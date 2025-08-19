import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Page } from "@shopify/polaris";
import { OrderDraftIcon } from '@shopify/polaris-icons';
import VideoFeeds from "app/components/feeds/VideoFeeds";
import { deleteFeeds } from "app/actions/feeds.action";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    if (request.method === "DELETE") {
        const formData = await request.formData();
        let ids: string[] = [];
        const allIds = formData.getAll("id");
        ids = allIds.map(id => String(id));

        if (!ids.length) {
            return { success: false, error: "No IDs provided" };
        }
        try {
            const response = await deleteFeeds(ids);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error };
        }
    }
    return null;
};
export default function AppVideoLibrary() {
    return (
        <Page
            backAction={{ content: 'Products', onAction: () => { history.back() } }}
            title="Feeds library"
            subtitle="Manage your video feeds and organize your shoppable content efficiently."
            primaryAction={{ content: 'Create Feed', icon: OrderDraftIcon, url: 'create' }}
        >
            <VideoFeeds />
        </Page>
    );
}

