import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { BlockStack, Page } from "@shopify/polaris";
import Support from "app/components/home/Support";
import FAQ from "app/components/help-and-support/FAQ";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return null;
};
export default function helpSupport() {

    return (
        <>
            <Page
                backAction={{ content: 'Products', url: '#' }}
                title="Help Support"
                subtitle="Your Questions, Answered – Fast, Friendly, and Always Here to Help!"
            >
                <BlockStack gap="500">
                    <Support />
                    <FAQ />
                </BlockStack>
            </Page>
        </>
    );
}

