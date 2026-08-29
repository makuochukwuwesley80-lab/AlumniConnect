export type Announcement = {
  id: string;
  title: string;
  body?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  venue?: string | null;
  action_label?: string | null;
  action_url?: string | null;
  featured?: boolean | null;
  created_at: string;
};

export type AdminAnnouncement = Announcement & {
  created_by: string;
  updated_at: string;
  is_published: boolean;
};
