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
      {/* Apply Card */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <Button size="lg" className="w-full text-base font-semibold h-11 shadow-sm hover:shadow-md transition-all" onClick={onApplyNow}>
             {job.applicationUrl ? (
              <>
                Apply Externally
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Apply for this Job"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Job Details Card */}
      <Card className="shadow-none border-none bg-transparent">
        <CardHeader className="px-0 pb-3 pt-0">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Job Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
            {/* Job Type */}
            {job.jobType && (
              <div className="flex items-start gap-3">
                 <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground">
                   <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Job Type</p>
                  <p className="text-sm font-semibold text-foreground">{job.jobType}</p>
                </div>
              </div>
            )}

            {/* Location */}
             <div className="flex items-start gap-3">
                 <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground">
                   <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-foreground">{job.location} {job.isRemote && '(Remote)'}</p>
                </div>
              </div>

            {/* Posted Date */}
             <div className="flex items-start gap-3">
                 <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground">
                   <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Date Posted</p>
                  <p className="text-sm font-semibold text-foreground">{formatDatePosted(job.postedDate)}</p>
                </div>
              </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {job.tags && job.tags.length > 0 && (
         <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map(tag => (
                <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs font-medium bg-background">
                  {tag}
                </Badge>
              ))}
            </div>
         </div>
      )}

      {/* Estimated Compensation - AT THE END */}
      {(job.salaryMin || job.salaryMax) && (
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyIcon currencyCode={job.salaryCurrency} className="w-4 h-4 text-muted-foreground" size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Estimated Compensation</h3>
            </div>
            <p className="text-xl font-bold text-foreground">
              {job.salaryMin ? Math.round(job.salaryMin / 1000) : ''}k 
              {job.salaryMin && job.salaryMax && ' - '}
              {job.salaryMax ? Math.round(job.salaryMax / 1000) : ''}k
              <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
