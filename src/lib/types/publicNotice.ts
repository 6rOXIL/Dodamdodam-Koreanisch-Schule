export type NoticeAttachment = {
  name: string;
  attachNo: string;
  url: string;
};

export type PublicNotice = {
  id: string;
  board_no: string;
  legacy_url: string;
  title: string;
  body_html: string;
  author: string | null;
  published_at: string;
  attachments: NoticeAttachment[];
  synced_at: string;
  created_at: string;
  updated_at: string;
};
