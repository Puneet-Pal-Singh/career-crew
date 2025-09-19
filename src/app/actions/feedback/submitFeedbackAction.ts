// src/app/actions/feedback/submitFeedbackAction.ts 
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { z } from 'zod';

type FieldErrors = {
  [key: string]: string[] | undefined;
};

// Schema for validating feedback input
const feedbackSchema = z.object({
  feedbackType: z.enum(['ISSUE', 'IDEA']),
  content: z.string().min(10, "Feedback must be at least 10 characters.").max(5000),
});

// 1. DEFINE THE STATE TYPE for our action
interface ActionState {
  success: boolean;
  error?: string;
  // Use our new, more specific type instead of 'any'
  errorDetails?: {
    fieldErrors?: FieldErrors;
  };
}

export async function submitFeedbackAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await getSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "You must be logged in to submit feedback." };
  }

  const validatedFields = feedbackSchema.safeParse({
    feedbackType: formData.get('feedbackType'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: "Invalid data provided.",
      // Pass the specific fieldErrors object
      errorDetails: { fieldErrors: validatedFields.error.flatten().fieldErrors }
    };
  }
  
  const { feedbackType, content } = validatedFields.data;

  const { error } = await supabase
    .from('feedback')
    .insert({
      user_id: user.id,
      feedback_type: feedbackType,
      content: content,
    });

  if (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: "Could not submit your feedback at this time. Please try again." };
  }

  return { success: true };
}