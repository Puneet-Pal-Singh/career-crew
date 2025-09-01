import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface JobApplicationInstructionsProps {
  applicationEmail?: string | null;
  applicationUrl?: string | null;
}

export default function JobApplicationInstructions({ applicationEmail, applicationUrl }: JobApplicationInstructionsProps) {
  if (!applicationEmail && !applicationUrl) {
    return null; // Don't render anything if there are no instructions
  }

  return (
    <section className="border-t pt-8">
      <h2 className="text-2xl font-semibold tracking-tight mb-4">How to Apply</h2>
      {applicationEmail && (
        <p className="mb-3 text-muted-foreground">
          Please apply via email at:{' '}
          <a href={`mailto:${applicationEmail}`} className="font-medium text-primary hover:underline">
            {applicationEmail}
          </a>
        </p>
      )}
      {applicationUrl && (
        <div className="mt-4">
          <Button asChild size="lg">
            <Link href={applicationUrl} target="_blank" rel="noopener noreferrer">
              Apply on Company Site
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}