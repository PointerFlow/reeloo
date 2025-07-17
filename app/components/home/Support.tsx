import {
  BlockStack,
  Button,
  Card,
  InlineGrid,
  Text
} from "@shopify/polaris";
import {
  CartIcon,
  ChatIcon,
  ClockIcon,
  MoneyFilledIcon,
} from "@shopify/polaris-icons";
import { SupportCardData } from "types/support.type";


export default function Support() {
  const cardData: SupportCardData[] = [
    {
      title: "Live Chat Support",
      subtitle: "Chat with our support team for real-time assistance.",
      icon: <ChatIcon />,
      button_text: "Get instant Support",
      varient: "primary",
    },
    {
      title: "Email Support",
      subtitle: "Send us your inquiries, and we’ll respond within 24 hours.",
      icon: <ClockIcon />,
      button_text: "Reach Through Email",
      varient: "secondary",
    },
    {
      title: "Help Center",
      subtitle:
        "Find answers to common questions and explore step-by-step guides.",
      icon: <CartIcon />,
      button_text: "Visit Help Center",
      varient: "secondary",
    },
    {
      title: "Video Tutorials",
      subtitle: "Watch quick tutorials to make the most of your dashboard.",
      icon: <MoneyFilledIcon />,
      button_text: "Watch Tutorials",
      varient: "secondary",
    },
  ];
  return (
    <Card>
      <BlockStack gap="500">
        <BlockStack gap="100">
          <Text variant="headingMd" as="h6">
            Need Assistance? We’re Here to Help!
          </Text>
          <Text as="p" variant="bodyLg">
            Our team is available 24/7 to support you. Explore guides, contact
            us, or get immediate help below.
          </Text>
        </BlockStack>
        <InlineGrid gap="400" columns={4}>
          {cardData &&
            cardData?.map((item, i) => (
              <Card key={i}>
                <BlockStack gap="200">
                  <BlockStack gap="500">
                    <BlockStack gap="200">
                      <Text variant="headingXs" as="h6">
                        {item?.title}
                      </Text>
                      <Text as="p" variant="bodyXs">
                        {item?.subtitle}
                      </Text>
                    </BlockStack>
                    <Button variant={item?.varient} icon={ChatIcon}>
                      {item?.button_text}
                    </Button>
                  </BlockStack>
                </BlockStack>
              </Card>
            ))}
        </InlineGrid>
      </BlockStack>
    </Card>
  );
}
