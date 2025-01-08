"use client";

import React, { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/loader-spinner";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  FileX2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChartGraph } from "./chart";
import Link from "next/link";

interface StartupProps {
  startupId: Id<"startups">;
}

type ChartDataItem = {
  revenueGrowthRate: string;
  retentionRate: string;
  period: string;
};

export type TractionData = {
  id?: string | undefined;
  timestamp?: string | undefined;
  period?: string | undefined;
  revenueGrowthRate?: string | undefined;
  retentionRate?: string | undefined;
  customersAcquired?: string | undefined;
  activeUsers?: string | undefined;
  report?: string | undefined;
};

const TractionDetails = ({ startupId }: StartupProps) => {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [metricId, setMetricId] = useState<string>("");
  const [isConfirmAdd, setIsConfirmAdd] = useState<boolean>(false);
  const [isConfirmEdit, setIsConfirmEdit] = useState<boolean>(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  // Retention Rate
  const [calculateRetention, setCalculateRetention] = useState<boolean>(false);
  const [customersStart, setCustomersStart] = useState("");
  const [customersEnd, setCustomersEnd] = useState("");
  const [customersAcquired, setCustomersAcquired] = useState("");

  // Revenue Growth Rate
  const [calculateGrowth, setCalculateGrowth] = useState<boolean>(false);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState("");
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState("");

  const [metricData, setMetricData] = useState({
    activeUsers: "",
    customersAcquired: "",
    period: "",
    report: "",
    retentionRate: "",
    revenueGrowthRate: "",
    timestamp: "",
  });

  const startup = useQuery(api.startups.getStartupById, {
    startupId,
  });

  const addNewReport = useMutation(api.startups.addNewMetric);

  const deleteMetric = useMutation(api.startups.deleteMetric);

  const updateMetric = useMutation(api.startups.updateSingleMetric);

  useEffect(() => {
    if (!isConfirmEdit && !isConfirmAdd) {
      setMetricData({
        activeUsers: "",
        customersAcquired: "",
        period: "",
        report: "",
        retentionRate: "",
        revenueGrowthRate: "",
        timestamp: "",
      });
    }
  }, [isConfirmEdit, isConfirmAdd]);

  const handleEditMetric = (
    id: string,
    activeUsers: string,
    customersAcquired: string,
    period: string,
    report: string,
    retentionRate: string,
    revenueGrowthRate: string,
    timestamp: string
  ) => {
    setMetricId(id);
    setMetricData({
      activeUsers,
      customersAcquired,
      period,
      report,
      retentionRate,
      revenueGrowthRate,
      timestamp,
    });
    setIsConfirmEdit(true);
  };

  const handleDeleteMetric = (id: string) => {
    setMetricId(id);
    setIsConfirmDelete(true);
  };

  const calculateRetentionRate = () => {
    const start = Number(customersStart);
    const end = Number(customersEnd);
    const acquired = Number(customersAcquired);

    if (start === 0) return 0;
    return ((end - acquired) / start) * 100;
  };

  const calculateRevenueGrowthRate = (): number | null => {
    const previousRevenue = Number(previousMonthRevenue);
    const currentRevenue = Number(currentMonthRevenue);

    if (!previousMonthRevenue || !currentMonthRevenue) return null;

    if (previousRevenue === 0) return 0;
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  };

  const columns: ColumnDef<TractionData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("period")}</div>
      ),
    },
    {
      accessorKey: "revenueGrowthRate",
      header: "Revenue Growth Rate (%)",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("revenueGrowthRate")}</div>
      ),
    },
    {
      accessorKey: "customersAcquired",
      header: "Customers Acquired",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("customersAcquired")}</div>
      ),
    },
    {
      accessorKey: "activeUsers",
      header: "Active Users",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("activeUsers")}</div>
      ),
    },
    {
      accessorKey: "retentionRate",
      header: "Retention Rate (%)",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("retentionRate")}</div>
      ),
    },
    {
      accessorKey: "report",
      header: "Report",
      cell: ({ row }) => (
        <div>{row.getValue("report")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const metric = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-muted-foreground">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleEditMetric(
                    metric?.id as string,
                    metric.activeUsers as string,
                    metric.customersAcquired as string,
                    metric.period as string,
                    metric.report as string,
                    metric.retentionRate as string,
                    metric.revenueGrowthRate as string,
                    metric.timestamp as string
                  )
                }
              >
                <FilePenLine className="h-4 w-4 mr-1" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => handleDeleteMetric(metric?.id as string)}
              >
                <FileX2 className="h-4 w-4 mr-1" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: startup?.metrics || [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (startup === undefined) {
    return <LoaderSpinner />;
  }

  function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  return (
    <>
      <Dialog open={calculateRetention} onOpenChange={setCalculateRetention}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Calculate Retention Rate</DialogTitle>
            <DialogDescription>
              To calculate simply fill the following inputs
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-2">
            <div>
              <Label>
                Number of customers at the start of{" "}
                {metricData.period || "current month"}
              </Label>
              <Input
                value={customersStart}
                placeholder=""
                className="mb-2.5"
                onChange={(e) => setCustomersStart(e.target.value)}
              />
            </div>

            <div>
              <Label>
                Customers acquired in {metricData.period || "current month"}
              </Label>
              <Input
                value={customersAcquired}
                placeholder=""
                className="mb-2.5"
                onChange={(e) => setCustomersAcquired(e.target.value)}
              />
            </div>
            <div>
              <Label>
                Number of customers at the end of{" "}
                {metricData.period || "current month"}
              </Label>
              <Input
                value={customersEnd}
                placeholder=""
                className="mb-2.5"
                onChange={(e) => setCustomersEnd(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center">
            <div className="mb-2">
              <Label className="text-muted-foreground">Retention Rate:</Label>
              <span className="text-lg font-semibold ml-1">
                {calculateRetentionRate()
                  ? `${calculateRetentionRate().toFixed(2)}%`
                  : "0.00%"}
              </span>
            </div>
          </div>

          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Button
              className="text-center justify-center"
              onClick={() => {
                const calculatedRate = calculateRetentionRate();
                setMetricData((prev) => ({
                  ...prev,
                  retentionRate: `${calculatedRate.toFixed(2)}%`,
                }));
                setCalculateRetention(false);
              }}
            >
              Use value
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={calculateGrowth} onOpenChange={setCalculateGrowth}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Calculate Revenue Growth Rate</DialogTitle>
            <DialogDescription>
              To calculate simply fill the following inputs
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-2">
            <div>
              <Label>
                Revenue at the start of {metricData.period || "current month"}
              </Label>
              <Input
                value={previousMonthRevenue}
                placeholder=""
                className="mb-2.5"
                onChange={(e) => setPreviousMonthRevenue(e.target.value)}
              />
            </div>

            <div>
              <Label>
                Revenue at the end of {metricData.period || "current month"}
              </Label>
              <Input
                value={currentMonthRevenue}
                placeholder=""
                className="mb-2.5"
                onChange={(e) => setCurrentMonthRevenue(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center">
            <div className="mb-2">
              <Label className="text-muted-foreground">
                Revenue Growth Rate:
              </Label>
              <span className="text-lg font-semibold ml-1">
                {calculateRevenueGrowthRate() !== null
                  ? `${calculateRevenueGrowthRate()?.toFixed(2)}%`
                  : "0.00%"}
              </span>
            </div>
          </div>

          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Button
              className="text-center justify-center"
              onClick={() => {
                const calculatedRate = calculateRevenueGrowthRate();

                if (calculatedRate !== null) {
                  setMetricData((prev) => ({
                    ...prev,
                    revenueGrowthRate: `${calculatedRate.toFixed(2)}%`,
                  }));
                } else {
                  console.log("Revenue growth rate is not available.");
                }

                setCalculateGrowth(false);
              }}
            >
              Use value
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmAdd} onOpenChange={setIsConfirmAdd}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>New Report</DialogTitle>
            <DialogDescription>
              Add a new report update about your startup
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <Label>Active users</Label>
            <Input
              value={metricData.activeUsers || ""}
              onChange={(e) =>
                setMetricData({ ...metricData, activeUsers: e.target.value })
              }
              placeholder="Active Users"
              className="mb-2.5"
            />
            <Label>Customers acquired</Label>
            <Input
              value={metricData.customersAcquired || ""}
              onChange={(e) =>
                setMetricData({
                  ...metricData,
                  customersAcquired: e.target.value,
                })
              }
              placeholder="Customers Acquired"
              className="mb-2.5"
            />

            <Label>
              Retention rate (%){" "}
              <span
                onClick={() => setCalculateRetention(true)}
                className="text-blue-500 underline text-xs ml-1"
              >
                Calculate
              </span>
            </Label>
            <Input
              value={metricData.retentionRate || ""}
              onChange={(e) =>
                setMetricData({ ...metricData, retentionRate: e.target.value })
              }
              placeholder="Retention Rate"
              className="mb-2.5"
            />
            <Label>
              Revenue growth rate (%){" "}
              <span
                onClick={() => setCalculateGrowth(true)}
                className="text-blue-500 underline text-xs ml-1"
              >
                Calculate
              </span>
            </Label>
            <Input
              value={metricData.revenueGrowthRate || ""}
              onChange={(e) =>
                setMetricData({
                  ...metricData,
                  revenueGrowthRate: e.target.value,
                })
              }
              placeholder="Revenue Growth Rate"
              className="mb-2.5"
            />
            <Label>Report</Label>
            <Textarea
              rows={4}
              value={metricData.report || ""}
              onChange={(e) =>
                setMetricData({ ...metricData, report: e.target.value })
              }
              placeholder="Give a brief report on activities that led to your growth..."
              className=""
            />
          </div>
          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Button
              className="text-center justify-center"
              onClick={async () => {
                const id = generateUUID();
                const date = new Date();
                const month = new Intl.DateTimeFormat("en-US", {
                  month: "long",
                }).format(date);
                const year = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                }).format(date);

                const period = `${month}, ${year}`.trim();

                const timestamp = new Date().toISOString();

                const existingMetrics = startup?.metrics || [];
                const periodExists = existingMetrics.some(
                  (metric) =>
                    metric.period &&
                    metric.period.trim().toLowerCase() === period.toLowerCase()
                );

                if (periodExists) {
                  toast({
                    variant: "default",
                    title: "Error",
                    description:
                      "A report for this period already exists. Please update the existing report.",
                  });
                  return;
                }

                await addNewReport({
                  startupId: startup?._id as Id<"startups">,
                  metrics: [
                    {
                      id,
                      period,
                      revenueGrowthRate: metricData.revenueGrowthRate,
                      retentionRate: metricData.retentionRate,
                      customersAcquired: metricData.customersAcquired,
                      activeUsers: metricData.activeUsers,
                      report: metricData.report,
                      timestamp,
                    },
                  ],
                });

                setIsConfirmAdd(false);
                toast({
                  variant: "default",
                  title: "Success",
                  description: "A new report has been successfully added!",
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmEdit} onOpenChange={setIsConfirmEdit}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Period: {metricData.period}</DialogTitle>
            <DialogDescription>Update details of your report</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <Label>Active users</Label>
            <Input
              value={metricData.activeUsers || ""}
              onChange={(e) =>
                setMetricData({ ...metricData, activeUsers: e.target.value })
              }
              placeholder="Active Users"
              className="mb-2.5"
            />
            <Label>Customers acquired</Label>
            <Input
              value={metricData.customersAcquired || ""}
              onChange={(e) =>
                setMetricData({
                  ...metricData,
                  customersAcquired: e.target.value,
                })
              }
              placeholder="Customers Acquired"
              className="mb-2.5"
            />

            <Label>
              Retention rate (%){" "}
              <span
                onClick={() => setCalculateRetention(true)}
                className="text-blue-500 underline text-xs ml-1"
              >
                Calculate
              </span>
            </Label>
            <Input
              value={metricData.retentionRate || ""}
              onChange={(e) =>
                setMetricData({ ...metricData, retentionRate: e.target.value })
              }
              placeholder="Retention Rate"
              className="mb-2.5"
            />
            <Label>
              Revenue growth rate (%){" "}
              <span
                onClick={() => setCalculateGrowth(true)}
                className="text-blue-500 underline text-xs ml-1"
              >
                Calculate
              </span>
            </Label>
            <Input
              value={metricData.revenueGrowthRate || ""}
              onChange={(e) =>
                setMetricData({
                  ...metricData,
                  revenueGrowthRate: e.target.value,
                })
              }
              placeholder="Revenue Growth Rate"
              className="mb-2.5"
            />
            <Label>Report</Label>
            <Textarea
              rows={4}
              value={metricData.report || ""}
              onChange={(e) =>
                setMetricData({ ...metricData, report: e.target.value })
              }
              placeholder="Give a brief report on activities that led to your growth..."
              className=""
            />
          </div>
          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Button
              className="text-center justify-center"
              onClick={async () => {
                await updateMetric({
                  startupId: startup?._id as Id<"startups">,
                  metricId,
                  updatedMetric: metricData,
                });
                setIsConfirmEdit(false);
                setMetricData({
                  activeUsers: "",
                  customersAcquired: "",
                  period: "",
                  report: "",
                  retentionRate: "",
                  revenueGrowthRate: "",
                  timestamp: "",
                });
                toast({
                  variant: "default",
                  title: "Success",
                  description: "Your report has been edited successfully!",
                });
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDelete} onOpenChange={setIsConfirmDelete}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              report.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center sm:justify-start sm:ml-auto">
            <Button
              className="text-center justify-center"
              onClick={async () => {
                if (!startup?.metrics || startup.metrics.length <= 1) {
                  toast({
                    variant: "default",
                    title: "Error",
                    description:
                      "You must have at least one report left, please edit this report or add another to delete this one.",
                  });
                  return;
                }

                await deleteMetric({
                  startupId: startup?._id as Id<"startups">,
                  metricId,
                });
                setIsConfirmDelete(false);
                toast({
                  variant: "default",
                  title: "Success",
                  description: "Your report has been deleted.",
                });
              }}
            >
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 md:p-8 p-0">
          <Link
            href="/dashboard"
            className="inline-flex hover:underline text-lg sm:text-xl font-bold tracking-tight"
          >
            <ArrowLeft className="h-4 w-4 mr-1 mt-1" />
            Back
          </Link>
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              _traction report: {startup?.name}
            </h2>
          </div>

          <Button
            className="flex ml-auto"
            onClick={() => setIsConfirmAdd(true)}
          >
            Add new report
          </Button>

          <ChartGraph chartData={startup?.metrics as ChartDataItem[]} />

          <main className="w-full grid flex-1 items-start">
            <div className="flex items-center py-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Customize view <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    ?.map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id === "revenueGrowthRate" ? (
                            <span>Revenue Growth Rate (%)</span>
                          ) : column.id === "retentionRate" ? (
                            <span>Retention Rate (%)</span>
                          ) : column.id === "customersAcquired" ? (
                            <span>Customers Acquired</span>
                          ) : column.id === "activeUsers" ? (
                            <span>Active Users</span>
                          ) : (
                            column.id
                          )}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups()?.map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers?.map((header, index) => {
                        return (
                          <TableHead
                            key={header.id}
                            className={index >= 3 ? "hidden md:table-cell" : ""}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table
                      .getRowModel()
                      .rows?.sort((a, b) => {
                        const aPeriod = a.original.period;
                        const bPeriod = b.original.period;

                        if (!aPeriod && !bPeriod) return 0;
                        if (!aPeriod) return 1;
                        if (!bPeriod) return -1;

                        const [aMonth, aYear] = aPeriod
                          .split(", ")
                          .map((part) => part.trim());
                        const [bMonth, bYear] = bPeriod
                          .split(", ")
                          .map((part) => part.trim());

                        const monthNames = [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ];

                        const aDate = new Date(
                          parseInt(aYear),
                          monthNames.indexOf(aMonth)
                        );
                        const bDate = new Date(
                          parseInt(bYear),
                          monthNames.indexOf(bMonth)
                        );

                        return bDate.getTime() - aDate.getTime(); // Sort in descending order (most recent first)
                      })
                      .map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells()?.map((cell, index) => (
                            <TableCell
                              key={cell.id}
                              className={
                                cell.column.id === "actions" || index < 3
                                  ? ""
                                  : "hidden md:table-cell"
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No traction report.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2 inline-flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-5 w-5 mb-0.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                  <ChevronRight className="h-5 w-5 mb-0.5" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default TractionDetails;