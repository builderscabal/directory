import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartDataItem = {
  revenueGrowthRate: string;
  retentionRate: string;
  period: string;
};

const chartConfig = {
  retentionRate: {
    label: "Retention Rate",
    color: "#3b82f6",
  },
  revenueGrowthRate: {
    label: "Growth Rate",
    color: "#34d399",
  },
} satisfies ChartConfig;

export function ChartGraph({ chartData }: { chartData: ChartDataItem[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("retentionRate");

  const parsedData = chartData?.map((item) => ({
    ...item,
    revenueGrowthRate: parseFloat(item.revenueGrowthRate),
    retentionRate: parseFloat(item.retentionRate),
  }));

  const sortedData = parsedData?.sort((a, b) => {
    const aPeriod = a.period;
    const bPeriod = b.period;

    if (!aPeriod && !bPeriod) return 0;
    if (!aPeriod) return 1;
    if (!bPeriod) return -1;

    const [aMonth, aYear] = aPeriod.split(", ").map((part) => part.trim());
    const [bMonth, bYear] = bPeriod.split(", ").map((part) => part.trim());

    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    const aDate = new Date(parseInt(aYear), monthNames.indexOf(aMonth));
    const bDate = new Date(parseInt(bYear), monthNames.indexOf(bMonth));

    return aDate.getTime() - bDate.getTime(); // Sort in ascending order (past to most recent)
  });

  const total = React.useMemo(
    () => ({
      revenueGrowthRate: parsedData?.reduce(
        (acc, curr) => acc + curr.revenueGrowthRate,
        0
      ),
      retentionRate: parsedData?.reduce(
        (acc, curr) => acc + curr.retentionRate,
        0
      ),
    }),
    [parsedData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Growth & Retention Chart</CardTitle>
          <CardDescription>
            Showing combined revenue growth rate and retention rate over all
            entered periods
          </CardDescription>
        </div>
        <div className="flex">
          {Object.keys(chartConfig)?.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart]?.toLocaleString()}%
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            data={sortedData}
            margin={{
              left: 16,
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              ticks={sortedData?.map((data) => data.period)}
              tickFormatter={(value, index) => {
                return index % 2 === 0 ? value : "";
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-gray-50 dark:bg-muted/100"
                  formatter={(value, name) => (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          backgroundColor: chartConfig[activeChart].color,
                          borderRadius: "25%",
                          marginRight: 4,
                        }}
                      ></span>
                      <span>{value}%</span>
                    </>
                  )}
                  labelFormatter={(value) => value}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};