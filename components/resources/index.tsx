"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CheckCheck, Copy, FileUp, Send, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "../ui/use-toast";
import LoaderSpinner from "../loader-spinner";
import CardResource from "./card";

interface UserProps {
  userId: string;
}

export default function StartupResources({ userId }: UserProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const resources = useQuery(api.resources.getAllResources);

  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!resources) return <LoaderSpinner />;

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      !selectedCategory || resource.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = filteredResources.length;
  const totalResources = Math.ceil(totalItems / itemsPerPage);

  const displayedResources =
    selectedCategory || searchTerm
      ? filteredResources.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : resources.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const placeholderText = selectedCategory
    ? `Search under "${selectedCategory}" category`
    : "Search for any resource using a title, tag, or description";

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 md:p-8 p-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            _resources
          </h2>
        </div>
        <div className="space-y-4">
          <main className="grid flex-1">
            <section className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-10 mt-10 w-full">
              {displayedResources.map(
                ({ _id, title, category, fileUrl, description, videoUrl }) => (
                  <CardResource
                    key={_id}
                    resourceId={_id}
                    title={title}
                    category={category}
                    description={description as string}
                    fileUrl={fileUrl as string}
                    videoUrl={videoUrl as string}
                  />
                )
              )}
            </section>

            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalResources }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className={`px-3 py-1 mx-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "border-primary border"
                      }`}
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalResources
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </main>
        </div>
      </div>
    </div>
  );
};