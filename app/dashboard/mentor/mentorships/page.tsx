// src/app/mentor/mentorships/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, X, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";


// Types based on your Prisma schema
type MentorshipStatus = "ACTIVE" | "COMPLETED" | "TERMINATED";
type ProductStatus = "PENDING" | "APPROVED" | "REJECTED" | "FUNDED";
type Category =
  | "TECHNOLOGY"
  | "HEALTH"
  | "EDUCATION"
  | "FINANCE"
  | "FOOD"
  | "RETAIL"
  | "ENTERTAINMENT"
  | "SUSTAINABILITY"
  | "OTHER";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: ProductStatus;
  user: User;
  fundingAmount: number | null;
  createdAt: string;
}

interface Mentorship {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: MentorshipStatus;
  notes: string | null;
  product: Product;
}

interface UpdateMentorshipData {
  status?: MentorshipStatus;
  notes?: string;
}

const MentorshipManagement = () => {
  
  
  // State
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<MentorshipStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<Category | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">("newest");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed" | "terminated">("all");
  const router=useRouter();
  // Edit mentorship state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMentorship, setCurrentMentorship] = useState<Mentorship | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<MentorshipStatus>("ACTIVE");
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Fetch mentorships from API
  const fetchMentorships = async () => {
    setLoading(true);
    try {
      // Build query string for filters
      const queryParams = new URLSearchParams();
      
      if (statusFilter !== "ALL") {
        queryParams.append("status", statusFilter);
      }
      
      if (categoryFilter !== "ALL") {
        queryParams.append("category", categoryFilter);
      }
      
      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }
      
      queryParams.append("sort", sortBy);
      
      const response = await fetch(`/api/mentor/mentorships?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch mentorships");
      }
      
      const data = await response.json();
      setMentorships(data);
    } catch (error) {
      console.error("Error fetching mentorships:", error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to load mentorships. Please try again.",
    //     variant: "destructive",
    //   });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch on initial load and when filters change
  useEffect(() => {
    fetchMentorships();
  }, [statusFilter, categoryFilter, sortBy]);
  
  // Only refetch when search is submitted or cleared
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMentorships();
  };
  
  // Filter mentorships by tab
  const filteredMentorships = mentorships.filter((mentorship) => {
    return (
      activeTab === "all" ||
      (activeTab === "active" && mentorship.status === "ACTIVE") ||
      (activeTab === "completed" && mentorship.status === "COMPLETED") ||
      (activeTab === "terminated" && mentorship.status === "TERMINATED")
    );
  });
  
  // Open edit dialog
  const handleEditMentorship = (mentorship: Mentorship) => {
    setCurrentMentorship(mentorship);
    setEditNotes(mentorship.notes || "");
    setEditStatus(mentorship.status);
    setIsEditDialogOpen(true);
  };
  
  // Update mentorship
  const handleUpdateMentorship = async () => {
    if (!currentMentorship) return;
    
    setUpdateLoading(true);
    
    try {
      const updateData: UpdateMentorshipData = {
        status: editStatus,
        notes: editNotes,
      };
      
      const response = await fetch(`/api/mentor/mentorships/${currentMentorship.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update mentorship");
      }
      
      const updatedMentorship = await response.json();
      
      // Update mentorship in state
      setMentorships((prev) =>
        prev.map((m) =>
          m.id === updatedMentorship.id ? updatedMentorship : m
        )
      );
      
    //   toast({
    //     title: "Success",
    //     description: "Mentorship updated successfully",
    //   });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating mentorship:", error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to update mentorship. Please try again.",
    //     variant: "destructive",
    //   });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSortBy("newest");
    fetchMentorships();
  };
  
  // Get status badge color
  const getStatusBadge = (status: MentorshipStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "TERMINATED":
        return <Badge className="bg-red-500">Terminated</Badge>;
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorship Management</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your mentorship activities
          </p>
        </div>
        
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="terminated">Terminated</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search mentorships..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as MentorshipStatus | "ALL")}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as Category | "ALL")}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                  <SelectItem value="HEALTH">Health</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="RETAIL">Retail</SelectItem>
                  <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                  <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Sort by
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    Newest first
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    Oldest first
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>
                    Alphabetical
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                title="Reset filters"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredMentorships.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-gray-100 p-3 inline-flex mx-auto mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No mentorships found</h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your filters or search term
              </p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Entrepreneur</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMentorships.map((mentorship) => (
                    <TableRow key={mentorship.id}>
                      <TableCell className="font-medium">
                        {mentorship.product.title}
                      </TableCell>
                      <TableCell>{mentorship.product.user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {mentorship.product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(mentorship.status)}</TableCell>
                      <TableCell>{formatDate(mentorship.createdAt)}</TableCell>
                      <TableCell>{formatDate(mentorship.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=> router.push(`/dashboard/mentor/mentorships/${mentorship.id}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditMentorship(mentorship)}>
                              Edit Mentorship
                            </DropdownMenuItem>
                            <DropdownMenuItem>Contact Entrepreneur</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Mentorship Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-blue-500">
          <DialogHeader>
            <DialogTitle>Edit Mentorship</DialogTitle>
            <DialogDescription>
              Update the status and notes for this mentorship.
            </DialogDescription>
          </DialogHeader>
          {currentMentorship && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Product</h3>
                <p>{currentMentorship.product.title}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Status</h3>
                <Select
                  value={editStatus}
                  onValueChange={(value) => setEditStatus(value as MentorshipStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                {editStatus === "COMPLETED" && (
                  <p className="text-sm text-gray-500">
                    Marking as completed means you've finished all mentorship activities.
                  </p>
                )}
                {editStatus === "TERMINATED" && (
                  <p className="text-sm text-gray-500">
                    Terminating will end the mentorship early and allow other mentors to pick up this product.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Notes</h3>
                <Textarea
                  placeholder="Add notes about this mentorship"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateMentorship} 
              disabled={updateLoading}
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorshipManagement;