// src/components/jobs/ApplicationModal.tsx
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { submitApplicationAction } from '@/app/actions/seeker/applications/submitApplicationAction';
import { toast } from 'sonner';
import { Upload, FileText, Send, Loader2, CheckCircle } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  jobId: string;
  jobTitle: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  linkedinUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  resumeFile: z
    .instanceof(File, { message: "A resume file is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "Only .pdf, .doc, and .docx formats are supported."),
  coverLetter: z.string().max(1000, "Note cannot exceed 1000 characters.").optional(),
});

export default function ApplicationModal({ isOpen, onOpenChange, jobId, jobTitle }: ApplicationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { fullName: "", email: "", coverLetter: "", linkedinUrl: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setIsSuccess(false);
    }
  }, [isOpen, form]);

  const onSubmit = (values: z.infer<typeof applicationSchema>) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('jobId', jobId);
    if (values.linkedinUrl) formData.append('linkedinUrl', values.linkedinUrl);
    if (values.resumeFile) formData.append('resumeFile', values.resumeFile);
    if (values.coverLetter) formData.append('coverLetter', values.coverLetter);

    startTransition(() => {
      toast.info("Submitting application...");
      submitApplicationAction(formData).then(result => {
        if (result.success) {
          toast.success("Application submitted successfully!");
          setIsSuccess(true);
        } else {
          toast.error(result.error);
        }
      });
    });
  };

  const ModalContent = () => (
    isSuccess ? (
      <div className="py-8 text-center flex flex-col items-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold">Application Submitted!</h3>
        <p className="text-muted-foreground mt-2">The employer has received your application.</p>
      </div>
    ) : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField name="fullName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField name="linkedinUrl" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField 
            name="resumeFile" 
            control={form.control} 
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Resume (PDF, DOCX up to 5MB) *</FormLabel>
                <FormControl>
                  <div className="relative border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <label 
                      htmlFor="resume-upload" 
                      className="flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer"
                    >
                      {value?.name ? (
                        <div className="flex items-center justify-center gap-2 text-primary font-medium">
                          <FileText className="h-5 w-5" />
                          <span>{value.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8" />
                          <span>Click or drag & drop to upload</span>
                        </>
                      )}
                    </label>
                    <Input 
                      id="resume-upload"
                      type="file" 
                      className="hidden"
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                      // React Hook Form's 'rest' contains the necessary ref and name
                      {...rest}
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField name="coverLetter" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Cover Letter Note</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
        </form>
      </Form>
    )
  );

  const FormActions = () => (
    isSuccess ? (
      <Button onClick={() => onOpenChange(false)} className="w-full">Close</Button>
    ) : (
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
        <Button type="submit" form="applicationForm" disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Application</>}
        </Button>
      </div>
    )
  );
  
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply to: {jobTitle}</DialogTitle>
            <DialogDescription>Please fill in your details below. Good luck!</DialogDescription>
          </DialogHeader>
          <div className="py-4"><ModalContent /></div>
          <DialogFooter><FormActions /></DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl">Apply to: {jobTitle}</DrawerTitle>
          <DrawerDescription>Please fill in your details below. Good luck!</DrawerDescription>
        </DrawerHeader>
        <div className="p-4"><ModalContent /></div>
        <DrawerFooter className="pt-2"><FormActions /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}