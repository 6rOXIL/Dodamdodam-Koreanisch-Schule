export type SiteFormFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "date"
  | "radio"
  | "select";

export type SiteFormFieldOption = {
  value: string;
  label_ko: string;
  label_en: string;
  label_de: string;
};

export type SiteFormField = {
  id: string;
  name: string;
  type: SiteFormFieldType;
  required: boolean;
  label_ko: string;
  label_en: string;
  label_de: string;
  placeholder_ko?: string;
  placeholder_en?: string;
  placeholder_de?: string;
  help_ko?: string;
  help_en?: string;
  help_de?: string;
  options?: SiteFormFieldOption[];
};

export type SiteForm = {
  id: string;
  slug: string;
  title_ko: string;
  title_en: string;
  title_de: string;
  description_ko: string;
  description_en: string;
  description_de: string;
  success_message_ko: string;
  success_message_en: string;
  success_message_de: string;
  fields: SiteFormField[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteFormSubmission = {
  id: string;
  form_id: string;
  payload: Record<string, string>;
  created_at: string;
};
