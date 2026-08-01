import type { PostCategory } from '@/utils/types';

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  upgrade: 'Upgrade',
  flight: 'Flight',
  inspection: 'Inspection',
  milestone: 'Milestone',
  overhaul: 'Overhaul',
  flyout: 'Fly-Out',
  event: 'Event',
  trip: 'Trip',
};

export const POST_CATEGORIES = Object.keys(CATEGORY_LABELS) as PostCategory[];
