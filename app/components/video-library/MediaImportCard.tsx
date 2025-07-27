import { useLoaderData, useNavigate } from "@remix-run/react";
import { BlockStack, Button, Card, Icon, InlineStack } from "@shopify/polaris";
import { LogoInstagramIcon, LogoTiktokIcon, UploadIcon, LogoYoutubeIcon } from '@shopify/polaris-icons';
import { MediaImportData } from "types/mediaImport.type";

export default function MediaImportCard() {
    const navigate = useNavigate();
    const mediaSources: MediaImportData[] = [
        {
            icon: <Icon source={LogoInstagramIcon} />,
            label: "Instagram",
            action: "Import from Instagram",
            disabled: false,
            url: "/app/videoLibrary/import"
        },
        {
            icon: <Icon source={LogoTiktokIcon} />,
            label: "TikTok",
            action: "Import from TikTok",
            disabled: false,
            url: "/app/videoLibrary/import"
        },
        {
            icon: <Icon source={UploadIcon} />,
            label: "Device",
            action: "Upload from Device",
            disabled: false,
            url: "/app/videoLibrary/upload"
        },
        {
            icon: <Icon source={LogoYoutubeIcon} />,
            label: "YouTube",
            action: "Coming soon",
            disabled: true,
            url: "/app/videoLibrary/import"
        }
    ];
    const handleClick = (url?: string) => {
        if (!url || url === "#") return;
        navigate(url);
    };
    
    return (
        
        <div className="grid grid-cols-4 gap-4">
            {
                mediaSources && mediaSources.map((item, i) => {
                    return (
                        <>
                            <Card padding="800" key={i}>
                                <BlockStack gap="400">
                                    <InlineStack align="center">
                                        <Card padding="050">
                                            {item?.icon}
                                        </Card>
                                    </InlineStack>
                                    <Button onClick={() => handleClick(item.url)} disabled={item?.disabled}>{item?.action}</Button>
                                </BlockStack>
                            </Card>
                        </>
                    )
                })
            }
        </div>
    );
}

