import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Page } from "@shopify/polaris";
import VideoBox from "app/components/video-library/VideoBox";
import { OrderDraftIcon } from '@shopify/polaris-icons';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};
export default function AppVideoLibrary() {
    return (
        <Page
            backAction={{ content: 'Products', onAction: () => { history.back() } }}
            title="Feeds library"
            subtitle="Manage your video feeds and organize your shoppable content efficiently."
            primaryAction={{ content: 'Create Feed', icon: OrderDraftIcon, url: 'edit' }}
        >
            <VideoBox />
        </Page>
    );
}

