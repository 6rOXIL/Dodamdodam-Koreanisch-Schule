export type UserRole = 'general' | 'member' | 'teacher' | 'admin';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  general: '일반',
  member: '멤버',
  teacher: '교사',
  admin: '어드민',
};

export const ROLE_RANK: Record<UserRole, number> = {
  general: 1,
  member: 2,
  teacher: 3,
  admin: 4,
};

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ResourceCategory {
  id: string;
  slug: string;
  name_ko: string;
  sort_order: number;
  created_at: string;
}

export interface ResourceClass {
  id: string;
  slug: string;
  name_ko: string;
  sort_order: number;
  created_at: string;
}

export interface Resource {
  id: string;
  category_id: string | null;
  class_slug: string | null;
  title: string;
  description: string | null;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicNotice {
  id: string;
  board_no: string;
  legacy_url: string;
  title: string;
  body_html: string;
  author: string | null;
  published_at: string;
  attachments: { name: string; attachNo: string; url: string }[];
  synced_at: string;
  created_at: string;
  updated_at: string;
}
