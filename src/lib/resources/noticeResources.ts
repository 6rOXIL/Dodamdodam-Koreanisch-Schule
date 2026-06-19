import {
  ANNOUNCEMENT_CATEGORY_SLUG,
  NOTICE_CATEGORY_SLUG,
} from "@/lib/resources/fixedCategories";
import {
  fetchPublishedResourcesByCategorySlug,
  formatResourcePostDate,
} from "@/lib/resources/categoryResources";

export { NOTICE_CATEGORY_SLUG, ANNOUNCEMENT_CATEGORY_SLUG };

export const fetchPublishedNoticeResources = () =>
  fetchPublishedResourcesByCategorySlug(NOTICE_CATEGORY_SLUG);

export const fetchPublishedAnnouncementResources = () =>
  fetchPublishedResourcesByCategorySlug(ANNOUNCEMENT_CATEGORY_SLUG);

export const formatNoticeDate = formatResourcePostDate;
