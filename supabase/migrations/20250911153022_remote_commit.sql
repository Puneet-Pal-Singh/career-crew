

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."application_status_option" AS ENUM (
    'SUBMITTED',
    'VIEWED',
    'INTERVIEWING',
    'OFFERED',
    'HIRED',
    'REJECTED_BY_EMPLOYER',
    'WITHDRAWN_BY_SEEKER'
);


ALTER TYPE "public"."application_status_option" OWNER TO "postgres";


CREATE TYPE "public"."job_status" AS ENUM (
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'ARCHIVED',
    'FILLED',
    'DRAFT'
);


ALTER TYPE "public"."job_status" OWNER TO "postgres";


CREATE TYPE "public"."job_type_option" AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP',
    'TEMPORARY'
);


ALTER TYPE "public"."job_type_option" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'JOB_SEEKER',
    'EMPLOYER',
    'ADMIN'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer) RETURNS TABLE("id" "text", "applicant_name" "text", "job_title" "text", "applied_at" timestamp with time zone, "status" "public"."application_status_option", "total_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return query
  select
    app.id::text,
    prof.full_name,
    j.title,
    app.created_at,
    app.status,
    -- Get the total count of all matching records for pagination purposes
    count(*) over() as total_count
  from
    public.applications as app
  join public.jobs as j on app.job_id = j.id
  join public.profiles as prof on app.seeker_id = prof.id
  where
    j.employer_id = employer_id_param
  order by
    app.created_at desc
  limit
    page_size
  offset
    (page_number - 1) * page_size;
end;
$$;


ALTER FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer, "job_id_filter" bigint DEFAULT NULL::bigint, "status_filter" "public"."application_status_option" DEFAULT NULL::"public"."application_status_option") RETURNS TABLE("id" "text", "applicant_name" "text", "job_title" "text", "applied_at" timestamp with time zone, "status" "public"."application_status_option", "total_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return query
  select
    app.id::text,
    prof.full_name,
    j.title,
    app.created_at,
    app.status,
    count(*) over() as total_count
  from
    public.applications as app
  join public.jobs as j on app.job_id = j.id
  join public.profiles as prof on app.seeker_id = prof.id
  where
    j.employer_id = employer_id_param
    -- These new lines apply the filters ONLY if they are provided
    and (app.job_id = job_id_filter or job_id_filter is null)
    and (app.status = status_filter or status_filter is null)
  order by
    app.created_at desc
  limit
    page_size
  offset
    (page_number - 1) * page_size;
end;
$$;


ALTER FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer, "job_id_filter" bigint, "status_filter" "public"."application_status_option") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_employer_recent_applications"("employer_id_param" "uuid") RETURNS TABLE("id" "text", "applicant_name" "text", "job_title" "text", "applied_at" timestamp with time zone, "status" "public"."application_status_option")
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  select
    app.id::text,
    prof.full_name,
    j.title,
    app.created_at,
    app.status
  from
    public.applications as app
  -- Explicitly join the tables
  join public.jobs as j on app.job_id = j.id
  join public.profiles as prof on app.seeker_id = prof.id
  where
    -- Filter to only include jobs owned by the employer who is calling the function
    j.employer_id = employer_id_param
  order by
    app.created_at desc
  limit 3;
$$;


ALTER FUNCTION "public"."get_employer_recent_applications"("employer_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_role public.user_role;
  user_full_name text;
BEGIN
  -- Extract role from metadata, with fallback
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    'JOB_SEEKER'  -- Default fallback
  );

  -- Extract full name with multiple fallback options
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',  -- Google OAuth often uses 'name'
    NEW.email  -- Last resort fallback
  );

  -- Insert the new profile
  INSERT INTO public.profiles (id, full_name, email, role, has_completed_onboarding)
  VALUES (
    NEW.id,
    user_full_name,
    NEW.email,
    user_role,
    false
  );

  -- Update app_metadata for JWT claims
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
      'role', user_role,
      'onboarding_complete', false
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "seeker_id" "uuid" NOT NULL,
    "status" "public"."application_status_option" DEFAULT 'SUBMITTED'::"public"."application_status_option" NOT NULL,
    "cover_letter_snippet" "text",
    "linkedin_profile_url" "text",
    "job_id" bigint,
    "resume_file_path" "text"
);


ALTER TABLE "public"."applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "employer_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "company_name" "text" NOT NULL,
    "company_logo_url" "text",
    "location" "text" NOT NULL,
    "description" "text" NOT NULL,
    "requirements" "text",
    "job_type" "public"."job_type_option" NOT NULL,
    "salary_min" integer,
    "salary_max" integer,
    "salary_currency" "text" DEFAULT 'USD'::"text",
    "is_remote" boolean DEFAULT false NOT NULL,
    "application_email" "text",
    "application_url" "text",
    "status" "public"."job_status" DEFAULT 'PENDING_APPROVAL'::"public"."job_status" NOT NULL,
    "id" bigint NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    CONSTRAINT "jobs_company_name_check" CHECK (("char_length"("company_name") > 0)),
    CONSTRAINT "jobs_salary_max_check" CHECK ((("salary_max" >= 0) OR ("salary_max" IS NULL))),
    CONSTRAINT "jobs_salary_min_check" CHECK ((("salary_min" >= 0) OR ("salary_min" IS NULL))),
    CONSTRAINT "jobs_title_check" CHECK (("char_length"("title") > 0)),
    CONSTRAINT "salary_check" CHECK ((("salary_min" IS NULL) OR ("salary_max" IS NULL) OR ("salary_min" <= "salary_max")))
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


ALTER TABLE "public"."jobs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."jobs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "role" "public"."user_role" DEFAULT 'JOB_SEEKER'::"public"."user_role" NOT NULL,
    "has_completed_onboarding" boolean DEFAULT false NOT NULL,
    "phone" "text",
    "intended_role" "public"."user_role"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "handle_job_update" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_seeker_id_fkey" FOREIGN KEY ("seeker_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can update job statuses" ON "public"."jobs" FOR UPDATE TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'ADMIN'::"public"."user_role")) WITH CHECK (true);



CREATE POLICY "Admins can view all job postings" ON "public"."jobs" FOR SELECT TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'ADMIN'::"public"."user_role"));



CREATE POLICY "Employers can create jobs" ON "public"."jobs" FOR INSERT WITH CHECK ((("auth"."uid"() = "employer_id") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'EMPLOYER'::"public"."user_role")));



CREATE POLICY "Employers can delete certain jobs" ON "public"."jobs" FOR DELETE USING ((("auth"."uid"() = "employer_id") AND (("status" = 'DRAFT'::"public"."job_status") OR ("status" = 'PENDING_APPROVAL'::"public"."job_status"))));



CREATE POLICY "Employers can update application status for their jobs" ON "public"."applications" FOR UPDATE TO "authenticated" USING (((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'EMPLOYER'::"public"."user_role") AND ("job_id" IN ( SELECT "jobs"."id"
   FROM "public"."jobs"
  WHERE ("jobs"."employer_id" = "auth"."uid"())))));



CREATE POLICY "Employers can update their own jobs" ON "public"."jobs" FOR UPDATE USING (("auth"."uid"() = "employer_id")) WITH CHECK (("auth"."uid"() = "employer_id"));



CREATE POLICY "Employers can view applications for their jobs" ON "public"."applications" FOR SELECT TO "authenticated" USING (((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'EMPLOYER'::"public"."user_role") AND ("job_id" IN ( SELECT "jobs"."id"
   FROM "public"."jobs"
  WHERE ("jobs"."employer_id" = "auth"."uid"())))));



CREATE POLICY "Employers can view their own jobs" ON "public"."jobs" FOR SELECT USING (("auth"."uid"() = "employer_id"));



CREATE POLICY "Public can view approved jobs" ON "public"."jobs" FOR SELECT USING (("status" = 'APPROVED'::"public"."job_status"));



CREATE POLICY "Seekers can create applications" ON "public"."applications" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'JOB_SEEKER'::"public"."user_role"));



CREATE POLICY "Seekers can delete their own applications" ON "public"."applications" FOR DELETE USING ((("auth"."uid"() = "seeker_id") AND ("status" = 'SUBMITTED'::"public"."application_status_option")));



CREATE POLICY "Seekers can update their own applications" ON "public"."applications" FOR UPDATE USING (("auth"."uid"() = "seeker_id")) WITH CHECK (("auth"."uid"() = "seeker_id"));



CREATE POLICY "Seekers can view their own applications" ON "public"."applications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "seeker_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own profile." ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer, "job_id_filter" bigint, "status_filter" "public"."application_status_option") TO "anon";
GRANT ALL ON FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer, "job_id_filter" bigint, "status_filter" "public"."application_status_option") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_employer_applications"("employer_id_param" "uuid", "page_size" integer, "page_number" integer, "job_id_filter" bigint, "status_filter" "public"."application_status_option") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_employer_recent_applications"("employer_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_employer_recent_applications"("employer_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_employer_recent_applications"("employer_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."applications" TO "anon";
GRANT ALL ON TABLE "public"."applications" TO "authenticated";
GRANT ALL ON TABLE "public"."applications" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
