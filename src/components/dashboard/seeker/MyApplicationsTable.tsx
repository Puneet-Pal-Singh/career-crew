// "use client";

// import type { ApplicationViewData, ApplicationStatusOption } from '@/types';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Eye } from 'lucide-react';

// interface MyApplicationsTableProps {
//   applications: ApplicationViewData[];
// }

// type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

// const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
//   switch (status) {
//     case 'SUBMITTED':
//       return 'secondary';
//     case 'VIEWED':
//       return 'secondary';
//     case 'INTERVIEWING':
//       return 'outline';
//     case 'OFFERED':
//       return 'default';
//     case 'HIRED':
//       return 'default';
//     case 'REJECTED':
//       return 'destructive';
//     default:
//       return 'default';
//   }
// };

// const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
// };

// export default function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
//   if (!applications || applications.length === 0) {
//     return <p className="text-center text-muted-foreground py-8">You have no job applications.</p>;
//   }

//   return (
//     <div className="border rounded-lg w-full overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="min-w-[250px]">Job Title</TableHead>
//             <TableHead className="min-w-[150px]">Company</TableHead>
//             <TableHead className="min-w-[120px]">Date Applied</TableHead>
//             <TableHead className="min-w-[150px]">Status</TableHead>
//             <TableHead className="text-right min-w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {applications.map((app) => (
//             <TableRow key={app.applicationId}>
//               <TableCell className="font-medium whitespace-nowrap">
//                 <Link href={`/jobs/${app.jobId}`} className="hover:underline text-primary">
//                   {app.jobTitle}
//                 </Link>
//               </TableCell>
//               <TableCell className="whitespace-nowrap">{app.companyName}</TableCell>
//               <TableCell className="whitespace-nowrap">{app.dateApplied}</TableCell>
//               <TableCell>
//                 <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)}>
//                   {formatApplicationStatusText(app.applicationStatus)}
//                 </Badge>
//               </TableCell>
//               <TableCell className="text-right">
//                 <Button variant="outline" size="icon" asChild title="View Original Job Posting">
//                   <Link href={`/jobs/${app.jobId}`} target="_blank">
//                     <Eye className="h-4 w-4" />
//                   </Link>
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }




"use client";

import type { ApplicationViewData, ApplicationStatusOption } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Calendar, 
  Building2, 
  FileText, 
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { generateJobSlug } from '@/lib/utils';

interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
  switch (status) {
    case 'SUBMITTED': return 'secondary';
    case 'VIEWED': return 'outline';
    case 'INTERVIEWING': return 'default';
    case 'OFFERED': return 'default';
    case 'HIRED': return 'default';
    case 'REJECTED': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: ApplicationStatusOption) => {
  switch (status) {
    case 'SUBMITTED': return <Clock className="w-3 h-3" />;
    case 'VIEWED': return <Eye className="w-3 h-3" />;
    case 'INTERVIEWING': return <Users className="w-3 h-3" />;
    case 'OFFERED': return <TrendingUp className="w-3 h-3" />;
    case 'HIRED': return <CheckCircle className="w-3 h-3" />;
    case 'REJECTED': return <XCircle className="w-3 h-3" />;
    default: return <Clock className="w-3 h-3" />;
  }
};

const getStatusColor = (status: ApplicationStatusOption): string => {
  switch (status) {
    case 'SUBMITTED': return 'text-blue-600 dark:text-black';
    case 'VIEWED': return 'text-purple-600 dark:text-black';
    case 'INTERVIEWING': return 'text-orange-900 dark:text-black';
    case 'OFFERED': return 'text-green-600 dark:text-black';
    case 'HIRED': return 'text-emerald-600 dark:text-black';
    case 'REJECTED': return 'text-red-600 dark:text-black';
    default: return 'text-gray-600 dark:text-black';
  }
};

const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

export default function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatusOption | 'ALL'>('ALL');

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        {/* Header */}
        {/* <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">My Job Applications</h1>
            <Button size="lg" asChild className="shadow-lg w-fit">
              <Link href="/jobs" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse More Jobs
              </Link>
            </Button>
          </div>
        </div> */}

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-primary/60" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Ready to take the next step in your career? Start applying to jobs and track your progress here.
          </p>
          <Button size="lg" asChild className="shadow-lg">
            <Link href="/jobs" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: (ApplicationStatusOption | 'ALL')[] = [
    'ALL', 'SUBMITTED', 'VIEWED', 'INTERVIEWING', 'OFFERED', 'HIRED', 'REJECTED'
  ];

  const stats = {
    total: applications.length,
    pending: applications.filter(app => ['SUBMITTED', 'VIEWED'].includes(app.applicationStatus)).length,
    interviewing: applications.filter(app => app.applicationStatus === 'INTERVIEWING').length,
    success: applications.filter(app => ['OFFERED', 'HIRED'].includes(app.applicationStatus)).length
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      {/* <div className="mb-8 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">My Job Applications</h1>
          <Button size="lg" asChild className="shadow-lg w-fit">
            <Link href="/jobs" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse More Jobs
            </Link>
          </Button>
        </div>
      </div> */}

      <div className="space-y-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by job title or company..."
                className="pl-10 bg-background/50 dark:bg-background/80 border-border/50 focus:border-primary/50 focus:bg-background transition-colors h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatusOption | 'ALL')}
              className="w-full sm:w-auto min-w-[140px] px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm transition-colors dark:bg-background/80"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Status' : formatApplicationStatusText(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-border/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Total Applications
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {stats.total}
                </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-yellow-50/50 to-yellow-100/30 dark:from-yellow-950/30 dark:to-yellow-900/20">
            <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Pending Review
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {stats.pending}
                </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20">
            <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Interviewing
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {stats.interviewing}
                </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20">
            <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Success Rate
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {stats.success}
                </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                </div>
            </div>
            </CardContent>
        </Card>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden">
          <div className="grid gap-5 sm:grid-cols-2">
            {filteredApplications.map((app) => (
              <Card key={app.applicationId} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4 pl-2">
                      <Link 
                        href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`} 
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary line-clamp-2 mb-2 block"
                      >
                        {app.jobTitle}
                      </Link>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{app.companyName}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
                      <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(app.dateApplied)}
                    </div>
                    <Badge 
                      variant={getApplicationStatusBadgeVariant(app.applicationStatus)} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 ${getStatusColor(app.applicationStatus)} border-current/20`}
                    >
                      {getStatusIcon(app.applicationStatus)}
                      <span className="text-xs font-medium">{formatApplicationStatusText(app.applicationStatus)}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted/30 dark:bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">No applications found</p>
              <p className="text-sm text-muted-foreground/80">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 dark:bg-muted/10 border-border/30 hover:bg-muted/40">
                    <TableHead className="font-semibold text-foreground/90 py-5 px-6">Job & Company</TableHead>
                    <TableHead className="font-semibold text-foreground/90 py-5 px-6">Applied Date</TableHead>
                    <TableHead className="font-semibold text-foreground/90 py-5 px-6">Status</TableHead>
                    <TableHead className="font-semibold text-foreground/90 py-5 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app, index) => (
                    <TableRow 
                      key={app.applicationId} 
                      className={`
                        hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors border-border/30
                        ${index % 2 === 0 ? 'bg-background/30' : 'bg-muted/10'}
                      `}
                    >
                      <TableCell className="py-5 px-6">
                        <div className="space-y-2">
                          <Link 
                            href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                            className="text-lg font-semibold text-foreground hover:text-primary transition-colors block leading-tight"
                          >
                            {app.jobTitle}
                          </Link>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{app.companyName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(app.dateApplied)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-6">
                        <Badge 
                          variant={getApplicationStatusBadgeVariant(app.applicationStatus)} 
                          className={`flex items-center gap-1.5 w-fit px-3 py-1.5 ${getStatusColor(app.applicationStatus)} border-current/20`}
                        >
                          {getStatusIcon(app.applicationStatus)}
                          <span className="text-xs font-medium">{formatApplicationStatusText(app.applicationStatus)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 px-6 text-right">
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary/5 transition-colors px-4 py-2">
                          <Link 
                            href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Job</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted/30 dark:bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-lg mb-2">No applications found</p>
                <p className="text-sm text-muted-foreground/80">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </Card>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 dark:bg-muted/5 rounded-lg px-5 py-4">
          <span>
            Showing <span className="font-medium text-foreground">{filteredApplications.length}</span> of <span className="font-medium text-foreground">{applications.length}</span> applications
          </span>
          {filteredApplications.length > 0 && stats.success > 0 && (
            <span className="hidden sm:inline">
              {Math.round((stats.success / applications.length) * 100)}% success rate
            </span>
          )}
        </div>
      </div>
    </div>
  );
}