-- Create a new ENUM type to categorize feedback
CREATE TYPE public.feedback_type AS ENUM (
    'ISSUE',
    'IDEA'
);

-- Create the feedback table
CREATE TABLE public.feedback (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to the user who submitted it
    feedback_type public.feedback_type NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) > 10),
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add comments for clarity
COMMENT ON TABLE public.feedback IS 'Stores user-submitted feedback and bug reports.';
COMMENT ON COLUMN public.feedback.user_id IS 'The user who submitted the feedback. Can be null for anonymous submissions in the future.';
COMMENT ON COLUMN public.feedback.is_resolved IS 'Allows admins to mark feedback as actioned.';

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only insert feedback for themselves.
CREATE POLICY "Users can submit feedback"
ON public.feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Admins can see everything.
-- (We will create a proper 'admin' role later. For now, this is a placeholder or can be adjusted)
CREATE POLICY "Admins can view all feedback"
ON public.feedback
FOR SELECT
USING (true); -- In a real app, you would check for an admin role: USING (get_my_claim('user_role') = 'ADMIN')