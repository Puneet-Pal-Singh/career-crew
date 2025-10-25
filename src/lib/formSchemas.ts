// src/lib/formSchemas.ts
import { z } from 'zod';
import { JOB_TYPE_OPTIONS, CURRENCY_OPTIONS } from './constants'; // Import from the new constants file

// Derive the raw enum values for Zod validation from our single source of truth.
// This ensures that our validation schema is always in sync with our display options.
const jobTypeValues = JOB_TYPE_OPTIONS.map(option => option.value) as [string, ...string[]];

// `CURRENCY_OPTIONS` is already in the correct format for z.enum
const currencyValues = CURRENCY_OPTIONS as [string, ...string[]];

// Schema for Posting a New Job
export const JobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title cannot exceed 100 characters."),
  company_name: z.string().min(2, "Company name must be at least 2 characters.").max(100, "Company name cannot exceed 100 characters."),
  company_logo_url: z.string().url("Please enter a valid URL for the company logo.").optional().or(z.literal('')),
  location: z.string().min(2, "Location is required.").max(100, "Location cannot exceed 100 characters."),
  job_type: z.enum(jobTypeValues, { required_error: "Job type is required." }),
  // This will map to the `tags` column in your database.
  skills: z.array(z.string()
    .min(2, "Each skill must be at least 2 characters.")
    .max(50, "Each skill cannot exceed 50 characters.")
  )
  .max(5, "You can add a maximum of 5 skills.")
  .optional(),
  description: z.string().min(50, "Description must be at least 50 characters.").max(5000, "Description cannot exceed 5000 characters."),
  requirements: z.string().max(5000, "Requirements cannot exceed 5000 characters.").optional().or(z.literal('')),
  is_remote: z.boolean({ required_error: "Please specify if the job is remote." }),
  salary_min: z.number({ invalid_type_error: "Minimum salary must be a number." })
    .int({ message: "Minimum salary must be a whole number." })
    .positive({ message: "Minimum salary must be positive." })
    .optional(),
  salary_max: z.number({ invalid_type_error: "Maximum salary must be a number." })
    .int({ message: "Maximum salary must be a whole number." })
    .positive({ message: "Maximum salary must be positive." })
    .optional(),
  salary_currency: z.enum(currencyValues, { required_error: "Currency is required." }),
  application_email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  application_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});
export type JobPostSchemaType = z.infer<typeof JobPostSchema>;


// --- NEW SCHEMA for Job Application Form ---
export const ApplicationFormSchema = z.object({
  // jobId will be passed programmatically, not as a user-input form field,
  // but it's part of the data packet sent to the server action.
  // It's not included here because this schema is for the *form fields* the user interacts with.
  // The server action will receive jobId as a separate argument.

  fullName: z.string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(100, { message: "Full name cannot exceed 100 characters." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." }),
  coverLetterNote: z.string()
    .max(2000, { message: "Cover letter note cannot exceed 2000 characters." }) // Increased limit slightly
    .optional()
    .or(z.literal('')), // Allow empty string, making it truly optional in the form
  resumeUrl: z.string()
    .url({ message: "Please enter a valid URL (e.g., LinkedIn, online resume/portfolio)." })
    .optional()
    .or(z.literal('')), // Allow empty string
  
  // For MVP, we might not have a direct file upload for resume yet.
  // A URL is a good start.

  // Consent is important
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms to apply.", // Simplified message
  }),
});

export type ApplicationFormSchemaType = z.infer<typeof ApplicationFormSchema>;

export const updatePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormSchema>;