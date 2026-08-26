import { redirect } from "next/navigation";
import { ENROLLMENT_GOOGLE_FORM_URL } from "@/lib/forms/enrollment";

export default function ApplyPage() {
  redirect(ENROLLMENT_GOOGLE_FORM_URL);
}
