import { aircraft } from '@/utils/sampleData';

// A curated stock gallery to pick from — this prototype has no device photo
// library or upload pipeline, so "adding a photo" means selecting from the
// same aviation photography already used across sample-data.
export const STOCK_PHOTOS = Array.from(
  new Set(aircraft.flatMap((a) => [a.heroPhotoUrl, ...a.photos])),
).slice(0, 15);
