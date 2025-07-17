import { Card, Collapsible, Text, BlockStack, Button, Box, Divider } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { IFaq } from "types/faq.type";

const faqData: IFaq[] = [
    {
        question: "What does Reeloo do?",
        answer: "Reeloo streamlines returns, exchanges, and order modifications for Shopify stores, saving time and improving customer satisfaction.",
    },
    {
        question: "How does Reeloo benefit my store?",
        answer: "",
    },
    {
        question: "Does Reeloo support international returns?",
        answer: "Absolutely! Reeloo works with global shipping carriers and manages customs seamlessly.",
    },
    {
        question: "What integrations does Reeloo support?",
        answer: "",
    },
    {
        question: "How can I install and start using Reeloo?",
        answer: "You can install Reeloo directly from the Shopify App Store. Once installed, follow the setup guide to configure the app, customize the portal, and start managing returns effortlessly.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const handleToggle = useCallback(
        (index: number) => {
            setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
        },
        []
    );

    return (
        <Card>
            <BlockStack gap="600">
                <BlockStack gap="100">
                    <Text variant="headingMd" as="h6">
                        FAQ
                    </Text>
                    <Text as="p" variant="bodyLg">
                        Frequently Asked Questions
                    </Text>
                </BlockStack>
                <Card padding="0">
                    {faqData.map((item, index) => (
                        <Box key={index} padding="0">
                            <Box padding="200" background="bg-surface-secondary">
                                <Button
                                    fullWidth
                                    textAlign="left"
                                    onClick={() => handleToggle(index)}
                                    ariaExpanded={openIndex === index}
                                    ariaControls={`faq-collapsible-${index}`}
                                    variant="tertiary"
                                    disclosure={openIndex === index ? 'up' : 'down'}
                                >
                                    {`${index + 1}. ${item.question}`}
                                </Button>
                            </Box>
                            <Box paddingInline="200">
                                <Collapsible
                                    open={openIndex === index}
                                    id={`faq-collapsible-${index}`}
                                    transition={{ duration: '300ms', timingFunction: 'ease' }}
                                    expandOnPrint
                                >
                                    <Box padding="300">
                                        <BlockStack gap="200">
                                            {item.answer ? (
                                                <Text as="p" variant="bodyMd">
                                                    {item.answer}
                                                </Text>
                                            ) : (
                                                <Text as="p" variant="bodyMd" tone="subdued">
                                                    No answer provided.
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </Box>
                                </Collapsible>
                            </Box>
                            <Divider />
                        </Box>
                    ))}
                </Card>
            </BlockStack>
        </Card>
    );
}
