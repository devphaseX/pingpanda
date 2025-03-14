"use client";

import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";
import { useCategoryHasEvents } from "@/features/event_categories/api/queries/use_category_has_events";
import { EventCategory } from "@/server/__internals/db/schemas";
import { useQuery } from "@tanstack/react-query";
import { EmptyCategoryState } from "./empty_category_state";
import { useGetEventsByCategoryName } from "@/features/events/v1/api/queries/use_get_events_by_category_name";
import { TimeRange } from "@/server/__internals/constants/enums";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Card } from "@/app/components/card";
import { BarChart } from "lucide-react";
import { useEffect, useMemo } from "react";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: EventCategory;
}

type EventFieldsSummary = Record<
  string,
  { total: number; thisWeek: number; thisMonth: number; today: number }
>;

export const CategoryPageContent = ({
  hasEvents,
  category,
}: CategoryPageContentProps) => {
  const { data: pollingData } = useCategoryHasEvents(category.name, hasEvents);

  if (!pollingData?.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }

  const [{ page, perPage, period }, setURLQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(20),
    period: parseAsStringEnum<TimeRange>(Object.values(TimeRange)).withDefault(
      TimeRange.WEEK,
    ),
  });

  const { data, error, fetchNextPage, hasNextPage, isFetching, refetch } =
    useGetEventsByCategoryName(category.name, {
      page,
      perPage,
      period,
    });

  const events = data?.pages[(page ?? 1) - 1];

  useEffect(() => {
    if (isFetching) return;
    refetch();
  }, [period]);

  const numericFieldSums = useMemo<EventFieldsSummary>(() => {
    if (!events?.events || events.events.length === 0) {
      return {};
    }

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    const sums: EventFieldsSummary = {};
    events.events.forEach((event) => {
      const eventDate = new Date(event.created_at!);

      Object.entries(event.fields as object).forEach(([field, value]) => {
        if (typeof value === "number" || Number.isFinite(Number(value))) {
          if (!sums[field]) {
            sums[field] = { total: 0, thisWeek: 0, thisMonth: 0, today: 0 };
          }

          sums[field].total += value;

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[field].thisWeek += value;
          }

          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value;
          }

          if (isToday(eventDate)) {
            sums[field].today += value;
          }
        }
      });
    });

    return sums;
  }, [events?.events]);

  return (
    <div className="space-y-6">
      <Tabs
        value={period}
        onValueChange={(value) => {
          setURLQuery({ period: value as TimeRange });
        }}
      >
        <TabsList className="mb-2">
          <TabsTrigger value={TimeRange.TODAY}>Today</TabsTrigger>
          <TabsTrigger value={TimeRange.WEEK}>Week</TabsTrigger>
          <TabsTrigger value={TimeRange.MONTH}>Month</TabsTrigger>
        </TabsList>

        <TabsContent value={period}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card className="border-2 border-brand-700">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>

                <BarChart className="size-4 text-muted-foreground" />

                <div>
                  <p className="text-2xl font-bold">
                    {events?.metdata.totalRecords}
                  </p>

                  <p className="text-xs/5 text-muted-foreground">
                    Events{" "}
                    {period === TimeRange.TODAY
                      ? "today"
                      : period === TimeRange.WEEK
                        ? "this week"
                        : "this month"}
                  </p>
                </div>
              </div>
            </Card>

            <NumericFieldsSumCard
              summary={numericFieldSums}
              period={period as TimeRange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

type NumericFieldsSumCardProps = {
  summary: EventFieldsSummary;
  period: TimeRange;
};

const NumericFieldsSumCard = ({
  summary,
  period,
}: NumericFieldsSumCardProps) => {
  if (Object.keys(summary).length === 0) return null;

  return Object.entries(summary).map(([field, sums]) => {
    const relevantSum =
      period === TimeRange.TODAY
        ? sums.today
        : period === TimeRange.WEEK
          ? sums.thisWeek
          : sums.thisMonth;

    return (
      <Card key={field}>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm/6 font-medium">
            {field.charAt(0).toUpperCase() + field.slice(1).toLowerCase()}
          </p>

          <BarChart className="size-4 text-muted-foreground" />

          <div>
            <p className="text-2xl font-bold">{relevantSum.toFixed(2)}</p>

            <p className="text-xs/5 text-muted-foreground">
              Events{" "}
              {period === TimeRange.TODAY
                ? "today"
                : period === TimeRange.WEEK
                  ? "this week"
                  : "this month"}
            </p>
          </div>
        </div>
      </Card>
    );
  });
};
