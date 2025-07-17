import { BlockStack, Card, InlineStack, Text, Divider, Grid, Icon } from "@shopify/polaris";
import { AlertCircleIcon } from '@shopify/polaris-icons';
import { PerformanceData } from "types/performanceData.type";


const PerformanceDashboard = () => {
    const metrics: PerformanceData[] = [
        {
            title: "Video Viewers",
            value: "2,345",
            subtitle: "(Last 15 days)",
            dataPoints: [10, 5, 0],
            dateLabels: ["01 Jan", "01 Apr", "01 Aug", "01 Dec"]
        },
        {
            title: "Avg Watch Time",
            value: "12.5%",
            subtitle: "(Last 15 days)",
            dataPoints: [10, 5, 0],
            dateLabels: ["01 Jan", "01 Apr", "01 Aug", "01 Dec"]
        },
        {
            title: "Video Orders",
            value: "47",
            subtitle: "(Last 15 days)",
            dataPoints: [10, 5, 0],
            dateLabels: ["01 Jan", "01 Apr", "01 Aug", "01 Dec"]
        },
        {
            title: "Video Revenue",
            value: "$1256",
            subtitle: "(Last 15 days)",
            dataPoints: [10, 5, 0],
            dateLabels: ["01 Jan", "01 Apr", "01 Aug", "01 Dec"]
        }
    ];

    return (
        <Card>
            <BlockStack gap="500">
                <BlockStack>
                    <Text variant="headingSm" as="h6">
                        View All Details
                    </Text>
                    <Text as="p" variant="bodyMd">
                        Access and Review All Detailed Information for Better Understanding
                    </Text>
                </BlockStack>

                <Grid>
                    {metrics && metrics.map((metric, index) => (
                        <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Card>
                                <BlockStack gap="500">
                                    <InlineStack align="space-between">
                                        <InlineStack gap="100">
                                            <Text as="h1" variant="headingSm">
                                                {metric.title}
                                            </Text>
                                            <Text as="p" variant="bodyMd">
                                                {metric.subtitle}
                                            </Text>
                                        </InlineStack>
                                        <div className="w-5 h-5">
                                            <Icon source={AlertCircleIcon} />
                                        </div>
                                    </InlineStack>

                                    <Text variant="headingLg" as="h6">
                                        {metric.value}
                                    </Text>

                                    <Divider />

                                    {metric.dataPoints.map((point, i) => (
                                        <div key={i}>
                                            <Text as="h1" variant="headingSm">
                                                {point}
                                            </Text>
                                            {i < metric.dataPoints.length - 1 && <Divider borderColor="border" />}
                                        </div>
                                    ))}

                                    <InlineStack align="space-between">
                                        {metric.dateLabels.map((date, i) => (
                                            <Text key={i} as="p" variant="bodyMd">
                                                {date}
                                            </Text>
                                        ))}
                                    </InlineStack>
                                </BlockStack>
                            </Card>
                        </Grid.Cell>
                    ))}
                </Grid>
            </BlockStack>
        </Card>
    );
};

export default PerformanceDashboard;