// src/components/dashboard/employer/JobPostSuccessDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

interface JobPostSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPostAnother: () => void;
  onViewJobs: () => void;
  jobTitle: string;
}

export default function JobPostSuccessDialog({
  isOpen,
  onOpenChange,
  onPostAnother,
  onViewJobs,
  jobTitle,
}: JobPostSuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <PartyPopper className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Success!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your job post for &quot;{jobTitle}&quot; has been submitted and is now pending approval.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onPostAnother} className="w-full">
            Post Another Job
          </Button>
          <Button onClick={onViewJobs} className="w-full">
            View My Jobs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}