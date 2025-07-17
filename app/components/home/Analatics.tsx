import {
  BlockStack,
  Card,
  InlineGrid,
  InlineStack,
  Text,
} from "@shopify/polaris";
import {
  AlertCircleIcon,
  CartIcon,
  ClockIcon,
  MoneyFilledIcon,
  ViewIcon,
} from "@shopify/polaris-icons";
import type { Analatics } from "types/analytics.type";

export default function Analatics() {
  const Analatics: Analatics[] = [
    {
      title: "Video Views",
      subtitle: "Last 15 Days",
      value: "5,625",
      icon: <ViewIcon />,
    },
    {
      title: "Avg Watch Time",
      subtitle: "Last 15 Days",
      value: "12.5%",
      icon: <ClockIcon />,
    },
    {
      title: "Video Orders",
      subtitle: "Last 15 Days",
      value: "47",
      icon: <CartIcon />,
    },
    {
      title: "Video Revenue",
      subtitle: "Last 15 Days",
      value: "$1,256",
      icon: <MoneyFilledIcon />,
    },
  ];
  return (
    <Card>
      <BlockStack gap="500">
        <BlockStack>
          <Text variant="headingSm" as="h6">
            Your Video Performance at a Glance
          </Text>
          <Text as="p" variant="bodyMd">
            Follow these tutorials to create and publish your first shoppable
            video.
          </Text>
        </BlockStack>
        <InlineGrid gap="400" columns={4}>
          {Analatics &&
            Analatics?.map((item, i) => (
              <Card key={i}>
                <BlockStack gap="200">
                  <BlockStack gap="500">
                    <InlineStack align="space-between">
                      <InlineStack blockAlign="center">
                        <Text variant="headingXs" as="h6">
                          {item?.title}
                        </Text>
                        <div className="w-[20px] h-[20px]">
                          <AlertCircleIcon />
                        </div>
                      </InlineStack>
                      <InlineStack blockAlign="center">
                        <Text as="p" variant="bodyXs">
                          {item?.subtitle}
                        </Text>
                      </InlineStack>
                    </InlineStack>
                    <div className="w-[28px] h-[28px] bg-gray-100 p-1 rounded-lg">
                      {item?.icon}
                    </div>
                  </BlockStack>
                  <Text variant="headingLg" as="h6">
                    {item?.value}
                  </Text>
                </BlockStack>
              </Card>
            ))}
        </InlineGrid>
      </BlockStack>
    </Card>
  );
}
