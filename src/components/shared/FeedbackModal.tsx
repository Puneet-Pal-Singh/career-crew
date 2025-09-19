// src/components/shared/FeedbackModal.tsx
"use client";

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitFeedbackAction } from '@/app/actions/feedback/submitFeedbackAction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Lightbulb, PartyPopper } from 'lucide-react';

// 1. DEFINE the props for the component
interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type FeedbackType = 'ISSUE' | 'IDEA';
type ModalView = 'CHOICE' | 'FORM' | 'SUCCESS';

const initialState = {
  success: false,
  error: undefined,
  errorDetails: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Submitting...' : 'Submit Feedback'}
    </Button>
  );
}

export default function FeedbackModal({ isOpen, onOpenChange }: FeedbackModalProps) {
  
  const [view, setView] = useState<ModalView>('CHOICE');
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [state, formAction] = useActionState(submitFeedbackAction, initialState);

  useEffect(() => {
    if (state.success) {
      setView('SUCCESS');
    }
  }, [state.success]);

  const handleChoice = (type: FeedbackType) => {
    setFeedbackType(type);
    setView('FORM');
  };

  const resetFlow = () => {
    setView('CHOICE');
    setFeedbackType(null);
    // Call the onOpenChange prop to close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </DialogTrigger> */}
      <DialogContent>
        {view === 'CHOICE' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">What would you like to share?</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <button onClick={() => handleChoice('ISSUE')} className="p-4 border rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <span className="font-semibold">Report an Issue</span>
                <span className="text-xs text-muted-foreground">Let us know about a bug.</span>
              </button>
              <button onClick={() => handleChoice('IDEA')} className="p-4 border rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent">
                <Lightbulb className="h-8 w-8 text-yellow-500 mb-2" />
                <span className="font-semibold">Suggest an Idea</span>
                <span className="text-xs text-muted-foreground">Share a feature request.</span>
              </button>
            </div>
          </>
        )}

        {view === 'FORM' && (
          <form action={formAction}>
            <input type="hidden" name="feedbackType" value={feedbackType!} />
            <DialogHeader>
              <DialogTitle>
                {feedbackType === 'ISSUE' ? 'Report an Issue' : 'Suggest an Idea'}
              </DialogTitle>
              <DialogDescription>
                We appreciate you taking the time to help us improve.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                name="content"
                placeholder={feedbackType === 'IDEA' ? 'It would be great if...' : 'I encountered a problem where...'}
                rows={6}
                required
                minLength={10}
              />
              {state.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
            </div>
            <DialogFooter>
              <SubmitButton />
            </DialogFooter>
          </form>
        )}

        {view === 'SUCCESS' && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                  <PartyPopper className="h-12 w-12 text-green-500" />
              </div>
              <DialogTitle className="text-center">Thank You!</DialogTitle>
              <DialogDescription className="text-center">
                Your feedback has been submitted. We&apos;ve logged it and will take a look shortly.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={resetFlow} className="w-full">Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}