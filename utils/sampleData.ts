import activityJson from '@/sample-data/activity.json';
import aircraftJson from '@/sample-data/aircraft.json';
import commentsJson from '@/sample-data/comments.json';
import postsJson from '@/sample-data/posts.json';
import usersJson from '@/sample-data/users.json';

import type { ActivityItem, Aircraft, Comment, Post, User } from '@/utils/types';

export const users = usersJson as User[];
export const aircraft = aircraftJson as Aircraft[];
export const posts = postsJson as Post[];
export const comments = commentsJson as Comment[];
export const activity = activityJson as ActivityItem[];
