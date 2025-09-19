"use client";

// 1. IMPORT the correct, modern hooks from 'react'
import { useState, useEffect, useActionState } from 'react';
// 2. IMPORT useFormStatus, which is still in 'react-dom'
import { useFormStatus } from 'react-dom';

// Import your server action and its types
import { submitFeedbackAction, type ActionState } from '@/app/actions/feedback/submitFeedbackAction';

// Import UI components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Lightbulb, PartyPopper } from 'lucide-react';

// Define the props for this component
interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Define local types for controlling the modal's view
type FeedbackType = 'ISSUE' | 'IDEA';
type ModalView = 'CHOICE' | 'FORM' | 'SUCCESS';

// Define the initial state for the server action
const initialState: ActionState = {
  success: false,
  error: undefined,
  errorDetails: undefined,
};

// A small component for the submit button to get the pending state
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

  // 3. USE THE NEW, CORRECT HOOK. This is the main fix.
  const [state, formAction] = useActionState(submitFeedbackAction, initialState);

  // This effect listens for a successful submission from the server action
  useEffect(() => {
    if (state.success) {
      setView('SUCCESS');
    }
  }, [state.success]);

  // Handler for when the user chooses "Issue" or "Idea"
  const handleChoice = (type: FeedbackType) => {
    setFeedbackType(type);
    setView('FORM');
  };

  // Resets the entire modal flow to its initial state and closes it
  const resetFlow = () => {
    setView('CHOICE');
    setFeedbackType(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        {view === 'CHOICE' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">What would you like to share?</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <button onClick={() => handleChoice('ISSUE')} className="p-4 border rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent transition-colors">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <span className="font-semibold">Report an Issue</span>
                <span className="text-xs text-muted-foreground">Let us know about a bug.</span>
              </button>
              <button onClick={() => handleChoice('IDEA')} className="p-4 border rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent transition-colors">
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
              {state.errorDetails?.content && 
                <p className="text-sm text-destructive mt-2">{state.errorDetails.content[0]}</p>
              }
              {state.error && !state.errorDetails &&
                <p className="text-sm text-destructive mt-2">{state.error}</p>
              }
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