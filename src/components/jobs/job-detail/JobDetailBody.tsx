interface JobDetailBodyProps {
  description: string;
  requirements?: string | null;
}

export default function JobDetailBody({ description, requirements }: JobDetailBodyProps) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none py-8">
      {/* The whitespace-pre-wrap ensures that paragraphs and line breaks from the database are respected */}
      <div className="whitespace-pre-wrap">{description}</div>
      
      {requirements && (
        <>
          <h2 className="mt-8">What You&apos;ll Need</h2>
          <div className="whitespace-pre-wrap">{requirements}</div>
        </>
      )}
    </article>
  );
}