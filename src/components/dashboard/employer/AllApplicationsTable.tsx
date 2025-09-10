// src/components/dashboard/employer/AllApplicationsTable.tsx
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllApplicationsAction, type EmployerApplication } from '@/app/actions/employer/applications/getAllApplicationsAction';
import { type JobOption } from '@/app/actions/employer/jobs/getEmployerJobOptionsAction';
import { APPLICATION_STATUS_OPTIONS, type ApplicationStatusOption } from '@/types';
import ApplicationDetailModal from './ApplicationDetailModal';
import { Eye, Filter, Calendar } from 'lucide-react';

interface AllApplicationsTableProps {
  initialApplications: EmployerApplication[];
  initialTotalCount: number;
  jobOptions: JobOption[];
}

// Helper function for status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'interviewing': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'hired': return 'bg-green-50 text-green-700 border-green-200';
    case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export default function AllApplicationsTable({ 
  initialApplications, 
  initialTotalCount,
  jobOptions
}: AllApplicationsTableProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentJobId = searchParams.get('jobId') || '';
  const currentStatus = searchParams.get('status') || '';
  
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const jobId = Number(searchParams.get('jobId')) || null;
    const status = searchParams.get('status') as ApplicationStatusOption || null;
      
    startTransition(async () => {
      const { applications: newApplications, totalCount: newTotalCount } = await getAllApplicationsAction({ page, jobId, status });
      setApplications(newApplications);
      setTotalCount(newTotalCount);
    });
  }, [searchParams]);

  const handleUrlChange = (type: 'jobId' | 'status' | 'page', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    if (type !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChangeInModal = (applicationId: string, newStatus: ApplicationStatusOption) => {
    setApplications(currentApps => 
      currentApps.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };
  
  const openModal = (appId: string) => setSelectedApplicationId(appId);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Filter by Job</label>
              <Select value={currentJobId} onValueChange={(value) => handleUrlChange('jobId', value)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Jobs" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Filter by Status</label>
              <Select value={currentStatus} onValueChange={(value) => handleUrlChange('status', value)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {APPLICATION_STATUS_OPTIONS.map(status => <SelectItem key={status} value={status} className="capitalize">{status.toLowerCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Candidates</CardTitle>
          <CardDescription>
            Showing {applications.length} of {totalCount} total applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}> */}
          <div className={isPending ? 'pointer-events-none' : ''}>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b">
                    <TableHead className="py-4 pl-6">Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Date Applied</div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length > 0 ? applications.map((app) => (
                    <TableRow key={app.id} onClick={() => openModal(app.id)} className="cursor-pointer transition-colors hover:bg-muted/50">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                            {app.applicantName.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold">{app.applicantName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>{app.appliedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize font-medium ${getStatusColor(app.status)}`}>{app.status.toLowerCase()}</Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openModal(app.id); }}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No applications found for the selected filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {applications.length > 0 ? applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 space-y-3 cursor-pointer" onClick={() => openModal(app.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {app.applicantName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{app.applicantName}</p>
                        <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`capitalize text-xs font-medium ${getStatusColor(app.status)}`}>{app.status.toLowerCase()}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />Applied on: {app.appliedAt}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-muted-foreground">No applications found for the selected filters.</div>
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t bg-muted/50">
              <div className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleUrlChange('page', String(currentPage - 1))} disabled={currentPage <= 1 || isPending}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => handleUrlChange('page', String(currentPage + 1))} disabled={currentPage >= totalPages || isPending}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ApplicationDetailModal
        applicationId={selectedApplicationId}
        isOpen={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        onStatusChange={handleStatusChangeInModal}
      />
    </div>
  );
}