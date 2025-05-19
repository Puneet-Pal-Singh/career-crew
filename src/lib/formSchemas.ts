// src/lib/formSchemas.ts
// import { z } from 'zod';

// export const jobTypeOptions = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"] as const;
// export const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"] as const;

// export const JobPostSchema = z.object({
//   title: z.string().min(5, "Title too short").max(100, "Title too long"),
//   company_name: z.string().min(2, "Company name too short").max(100, "Company name too long"),
//   company_logo_url: z.string().url("Invalid URL").optional().or(z.literal('')), // Allows empty or URL
//   location: z.string().min(2, "Location required"),
//   job_type: z.enum(jobTypeOptions, { required_error: "Job type is required" }),
//   description: z.string().min(50, "Description too short").max(5000,"Description too long"),
//   requirements: z.string().max(5000, "Requirements too long").optional().or(z.literal('')),
//   is_remote: z.boolean({ required_error: "Remote option is required" }), // Plain boolean
//   // salary_min: z.number({ invalid_type_error: "Salary must be a number" }).positive("Must be positive").int("Must be whole number").optional(),
//   // salary_max: z.number({ invalid_type_error: "Salary must be a number" }).positive("Must be positive").int("Must be whole number").optional(),
//   salary_min: z.preprocess(
//     (val) => (val === "" || val === null ? undefined : Number(val)), // Convert empty string/null to undefined, else to Number
//     z.number({ invalid_type_error: "Minimum salary must be a number." })
//       .int({ message: "Minimum salary must be a whole number." })
//       .positive({ message: "Minimum salary must be positive." })
//       .optional()
//   ),
//   salary_max: z.preprocess(
//     (val) => (val === "" || val === null ? undefined : Number(val)), // Convert empty string/null to undefined, else to Number
//     z.number({ invalid_type_error: "Maximum salary must be a number." })
//       .int({ message: "Maximum salary must be a whole number." })
//       .positive({ message: "Maximum salary must be positive." })
//       .optional()
//   ), 
//   salary_currency: z.enum(currencyOptions, { required_error: "Currency is required" }),
//   application_email: z.string().email("Invalid email").optional().or(z.literal('')),
//   application_url: z.string().url("Invalid URL").optional().or(z.literal('')),
// });
// // --- NO .refine() blocks for now ---

// export type JobPostSchemaType = z.infer<typeof JobPostSchema>;



// src/lib/formSchemas.ts
import { z } from 'zod';

export const jobTypeOptions = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"] as const;
export const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"] as const;

// Simplest Zod schema for structure and basic validation rules
export const JobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title cannot exceed 100 characters."),
  company_name: z.string().min(2, "Company name must be at least 2 characters.").max(100, "Company name cannot exceed 100 characters."),
  company_logo_url: z.string().url("Please enter a valid URL for the company logo.").optional().or(z.literal('')),
  location: z.string().min(2, "Location is required.").max(100, "Location cannot exceed 100 characters."),
  job_type: z.enum(jobTypeOptions, { required_error: "Job type is required." }),
  description: z.string().min(50, "Description must be at least 50 characters.").max(5000, "Description cannot exceed 5000 characters."),
  requirements: z.string().max(5000, "Requirements cannot exceed 5000 characters.").optional().or(z.literal('')),
  is_remote: z.boolean({ required_error: "Please specify if the job is remote." }), // RHF defaultValues will handle initial value
  salary_min: z.number({ invalid_type_error: "Minimum salary must be a number." })
    .int({ message: "Minimum salary must be a whole number." })
    .positive({ message: "Minimum salary must be positive." })
    .optional(), // RHF valueAsNumber + this handles it
  salary_max: z.number({ invalid_type_error: "Maximum salary must be a number." })
    .int({ message: "Maximum salary must be a whole number." })
    .positive({ message: "Maximum salary must be positive." })
    .optional(), // RHF valueAsNumber + this handles it
  salary_currency: z.enum(currencyOptions, { required_error: "Currency is required." }), // RHF defaultValues will handle initial value
  application_email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  application_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
})
// --- NO .refine() for now to ensure resolver stability ---
// .refine(data => { // Salary min/max check
//     if (data.salary_min && data.salary_max) {
//         return data.salary_min <= data.salary_max;
//     }
//     return true;
// }, { message: "Maximum salary cannot be less than minimum salary.", path: ["salary_max"] })
// .refine(data => { // Application method check
//     return !(!data.application_email && !data.application_url);
// }, { message: "Please provide either an application email or an application URL.", path: ["application_email"] });

export type JobPostSchemaType = z.infer<typeof JobPostSchema>;