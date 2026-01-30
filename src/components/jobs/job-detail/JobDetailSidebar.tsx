"use client";

import { JobDetailData } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, Calendar, ExternalLink } from 'lucide-react';
import CurrencyIcon from '@/components/shared/CurrencyIcon';
import { formatDatePosted } from '@/lib/utils';

interface JobDetailSidebarProps {
  job: JobDetailData;
  onApplyNow: () => void;
}

export default function JobDetailSidebar({ job, onApplyNow }: JobDetailSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Apply Card (Desktop - sticky-like behavior can be handled by parent or class here) */}
      <Card className="border-primary/10 shadow-md">
        <CardContent className="pt-6">
          <Button size="lg" className="w-full text-lg h-12 shadow-lg hover:shadow-primary/25 transition-all" onClick={onApplyNow}>
             {job.applicationUrl ? (
              <>
                Apply on Company Site
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Apply for this Job"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Job Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                   <CurrencyIcon currencyCode={job.salaryCurrency} className="w-5 h-5" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salary</p>
                  <p className="font-semibold text-foreground">
                    {job.salaryMin ? Math.round(job.salaryMin / 1000) : ''}k 
                    {job.salaryMin && job.salaryMax && ' - '}
                    {job.salaryMax ? Math.round(job.salaryMax / 1000) : ''}k
                  </p>
                </div>
              </div>
            )}

            {/* Job Type */}
            {job.jobType && (
              <div className="flex items-start gap-3">
                 <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                   <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Type</p>
                  <p className="font-semibold text-foreground">{job.jobType}</p>
                </div>
              </div>
            )}

            {/* Location */}
             <div className="flex items-start gap-3">
                 <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                   <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">{job.location} {job.isRemote && '(Remote)'}</p>
                </div>
              </div>

            {/* Posted Date */}
             <div className="flex items-start gap-3">
                 <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                   <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posted</p>
                  <p className="font-semibold text-foreground">{formatDatePosted(job.postedDate)}</p>
                </div>
              </div>

        </CardContent>
      </Card>

      {/* Skills */}
      {job.tags && job.tags.length > 0 && (
         <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Tags</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
