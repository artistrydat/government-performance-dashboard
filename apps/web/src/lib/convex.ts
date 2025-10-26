import { ConvexReactClient } from 'convex/react';

// Create a Convex client instance
export const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || 'https://dependable-cat-853.convex.cloud'
);
