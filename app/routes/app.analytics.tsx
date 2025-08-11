import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import PerformanceDashborad from "app/components/analytics/PerformanceDashborad";
import Analatics from "app/components/home/Analatics";
import { BlockStack, Page } from "@shopify/polaris";
import { CalendarIcon } from '@shopify/polaris-icons';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};
export default function AppAnalytics() {
    return (
        <>
            <Page
                backAction={{ content: 'Products', onAction: () => { history.back() } }}
                title="Analytics"
                subtitle="Analyze, Adapt, and Elevate Your Returns Process"
                primaryAction={{ icon: CalendarIcon, content: 'Last 15 Days' }}
            >
                <BlockStack gap="500">
                    <Analatics />
                    <PerformanceDashborad />
                </BlockStack>
            </Page>
        </>
    );
}

