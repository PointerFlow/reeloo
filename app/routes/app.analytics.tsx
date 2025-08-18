import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import PerformanceDashborad from "app/components/analytics/PerformanceDashborad";
import {
  BlockStack,
  Page,
  Card,
  InlineGrid,
  InlineStack,
  Text,
  Button,
  DatePicker,
  Popover,
} from "@shopify/polaris";
import {
  AlertCircleIcon,
  CartIcon,
  ClockIcon,
  MoneyFilledIcon,
  ViewIcon,
  CalendarIcon,
  ChevronDownIcon,
} from "@shopify/polaris-icons";
import { useEffect, useState, useCallback } from "react";
import { useRouteLoaderData } from "@remix-run/react";
import type { Analatics } from "types/analytics.type";
import { IShopData } from "types/shop.type";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export default function AppAnalytics() {
  const { shopData } = useRouteLoaderData("root") as { shopData: IShopData };
  const storeId = shopData.shop.id;

  // analytics state
  const [analytics, setAnalytics] = useState<Record<string, number>>({});

  // date picker states
  const [{ month, year }, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date }>(
    {
      start: new Date(new Date().setDate(new Date().getDate() - 15)),
      end: new Date(),
    }
  );

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  // handle last 15 days click
  const handleLast15Days = () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 15);

    setSelectedDates({
      start: pastDate,
      end: today,
    });
  };

  // fetch analytics whenever date changes
  useEffect(() => {
    if (!selectedDates.start || !selectedDates.end) return;

    const startDate = selectedDates.start.toISOString().split("T")[0];
    const endDate = selectedDates.end.toISOString().split("T")[0];

    (async () => {
      const response = await fetch(
        `https://reelo-backend.vercel.app/api/v1/analytics/by-date?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      setAnalytics(responseData?.data.analytics);
    })();
  }, [selectedDates, storeId]);

  const AnalaticsData: Analatics[] = [
    {
      title: "Video Views",
      subtitle: "Last 15 Days",
      value: `${analytics?.totalViews || 0}`,
      icon: <ViewIcon />,
    },
    {
      title: "Avg Watch Time",
      subtitle: "Last 15 Days",
      value: `${analytics?.totalWatchTime || 0}`,
      icon: <ClockIcon />,
    },
    {
      title: "Video Orders",
      subtitle: "Last 15 Days",
      value: `${analytics?.orderConversionRate || 0}`,
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
    <Page
      backAction={{ content: "Products", onAction: () => history.back() }}
      title="Analytics"
      subtitle="Analyze, Adapt, and Elevate Your Returns Process"
      secondaryActions={[
        {
          icon: CalendarIcon,
          content: "Last 15 Days",
          onAction: handleLast15Days,
        },
        {
          content: "Choose 15-Day Window",
          onAction: togglePopoverActive,
          icon: ChevronDownIcon,
        },
      ]}
    >
      <BlockStack gap="500">
        {/* === Analytics section === */}
        <Card>
          <BlockStack gap="500">
            <InlineStack align="space-between">
              <BlockStack>
                <Text variant="headingSm" as="h6">
                  Your Video Performance at a Glance
                </Text>
                <Text as="p" variant="bodyMd">
                  Follow these tutorials to create and publish your first
                  shoppable video.
                </Text>
              </BlockStack>
              <InlineStack gap="300">
                <Popover
                  active={popoverActive}
                  activator={
                    <Button onClick={togglePopoverActive}>
                    </Button>
                  }
                  onClose={togglePopoverActive}
                >
                  <Card>
                    <DatePicker
                      month={month}
                      year={year}
                      onChange={(range) => setSelectedDates(range)}
                      onMonthChange={(month, year) => setDate({ month, year })}
                      selected={selectedDates}
                      allowRange
                    />
                  </Card>
                </Popover>
              </InlineStack>
            </InlineStack>

            <InlineGrid gap="400" columns={4}>
              {AnalaticsData.map((item, i) => (
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

        {/* === Performance Dashboard === */}
        <PerformanceDashborad analytics={analytics}/>
      </BlockStack>
    </Page>
  );
}
