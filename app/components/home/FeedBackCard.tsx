import {
    BlockStack,
    Button,
    CalloutCard,
    InlineStack,
    Text,
} from "@shopify/polaris";
import { SmileyHappyIcon, SmileySadIcon } from "@shopify/polaris-icons";
import img from "../../Images/Illustration.png";

export default function FeedBackCard() {
  return (
    <CalloutCard
      title="We’d Love Your Feedback!"
      illustration={img}
      primaryAction={{}}
    >
      <BlockStack gap="300">
        <Text as="p" variant="bodyMd">
          How would you describe your experience using the Reeloo app?
        </Text>
        <InlineStack gap="200">
          <Button icon={SmileyHappyIcon} variant="primary">
            Satisfied
          </Button>
          <Button icon={SmileySadIcon}>Neutral</Button>
        </InlineStack>
      </BlockStack>
    </CalloutCard>
  );
}
