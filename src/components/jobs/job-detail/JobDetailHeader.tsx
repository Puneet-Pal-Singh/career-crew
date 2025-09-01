import type { JobDetailData } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface JobDetailHeaderProps {
  job: JobDetailData;
}

export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  return (
    <header className="border-b pb-8">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {job.title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{job.companyName}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {job.isRemote && <Badge variant="secondary">Remote</Badge>}
        {job.jobType && <Badge variant="secondary">{job.jobType.replace(/_/g, ' ')}</Badge>}
        {/* We can add more key info as badges here if needed */}
      </div>
    </header>
  );
}