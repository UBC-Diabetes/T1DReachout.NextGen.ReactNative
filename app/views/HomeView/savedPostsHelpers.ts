import { Q } from '@nozbe/watermelondb';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import database from '../../lib/database';
import { MESSAGE_TYPE_ANY_LOAD } from '../../lib/constants';

// Message types to filter out (from DiscussionBoard/data.ts)
const messageTypesToRemove = [
  'jitsi_call_started',
  'uj',
  'ul',
  'ru',
  'au',
  'mute_unmute',
  'r',
  'ut',
  'wm',
  'rm',
  'subscription_role_added',
  'subscription_role_removed',
  'room_archived',
  'room_unarchived'
];

interface SavedPost {
  id: string;
  msg: string;
  ts: Date;
  u: {
    _id: string;
    username: string;
    name?: string;
  };
  rid: string;
  starred: boolean;
  attachments?: any[];
  replies?: any[];
  reactions?: any[];
  _raw?: any;
}

/**
 * Fetches recent saved/starred posts from the local database
 * @param limit - Maximum number of posts to return (default: 5)
 * @returns Promise<SavedPost[]> - Array of recent saved posts
 */
export const getRecentSavedPosts = async (limit: number = 5): Promise<SavedPost[]> => {
  try {
    const db = database.active;
    const messages = await db
      .get('messages')
      .query(
        Q.where('starred', true),
        Q.sortBy('ts', Q.desc),
        Q.take(limit * 2) // Take more to account for filtering
      )
      .fetch();

    // Filter out system messages and unwanted message types
    const filteredMessages = messages.filter(m => {
      return !(MESSAGE_TYPE_ANY_LOAD.includes(m.t) || messageTypesToRemove.includes(m.t));
    });

    // Format the messages and parse JSON fields
    const formattedPosts = filteredMessages.slice(0, limit).map(m => {
      let object = { ...m };
      try {
        if (m?._raw?.u?.length && m._raw.u.length > 0 && m._raw.u !== '[]') {
          object._raw.u = JSON.parse(m._raw.u);
        }
        if (m?._raw?.attachments?.length && m._raw.attachments.length > 0) {
          object._raw.attachments = JSON.parse(m._raw.attachments);
        }
        if (m?._raw?.replies?.length && m._raw.replies.length > 0 && m._raw.replies !== '[]') {
          object._raw.replies = JSON.parse(m._raw.replies);
        }
        if (m?._raw?.reactions?.length && m._raw.reactions.length > 0 && m._raw.reactions !== '[]') {
          object._raw.reactions = JSON.parse(m._raw.reactions);
        }
      } catch (error) {
        console.warn('Error parsing saved post JSON fields:', error);
      }

      return object as SavedPost;
    });

    return formattedPosts;
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    return [];
  }
};

/**
 * Formats the timestamp of a saved post for display
 * @param timestamp - Date object or ISO string
 * @returns Formatted date string (e.g., "Today", "Yesterday", "July 3rd 2024, 2:00 pm")
 */
export const formatSavedPostDate = (timestamp: Date | string): string => {
  try {
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return 'Unknown date';
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM do yyyy, h:mm a');
    }
  } catch (error) {
    return 'Unknown date';
  }
};

/**
 * Truncates post content for display in Home View
 * @param content - The post message content
 * @param maxLength - Maximum length to display (default: 80)
 * @returns Truncated content with ellipsis if needed
 */
export const truncatePostContent = (content: string, maxLength: number = 80): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength).trim() + '...';
};

/**
 * Gets the display name for a post author
 * @param post - The saved post object
 * @returns Display name (real name or username)
 */
export const getPostAuthorName = (post: SavedPost): string => {
  // Access user data from _raw field
  const user = post._raw?.u || post.u;
  if (user) {
    return user.name || user.username || 'Unknown user';
  }
  return 'Unknown user';
};

/**
 * Gets the username for a post author
 * @param post - The saved post object
 * @returns Username
 */
export const getPostAuthorUsername = (post: SavedPost): string => {
	// Access user data from _raw field
	const user = post._raw?.u || post.u;
	if (user) {
		return user.username || 'Unknown user';
	}
	return 'Unknown user';
};

/**
 * Gets the number of reactions/likes on a post
 * @param post - The saved post object
 * @returns Number of reactions
 */
export const getPostReactionsCount = (post: SavedPost): number => {
  try {
    const reactions = post._raw?.reactions || post.reactions;
    if (!reactions || typeof reactions !== 'object') {
      return 0;
    }
    
    // Count total reactions across all emoji types
    return Object.values(reactions).reduce((total: number, reactionData: any) => {
      if (reactionData && reactionData.usernames) {
        return total + reactionData.usernames.length;
      }
      return total;
    }, 0);
  } catch (error) {
    return 0;
  }
};

/**
 * Gets the number of replies/comments on a post
 * @param post - The saved post object
 * @returns Number of replies
 */
export const getPostRepliesCount = (post: SavedPost): number => {
  try {
    // Check thread count first (tcount) - prioritize _raw field
    const tcount = post._raw?.tcount || post.tcount;
    if (tcount && tcount > 0) {
      return tcount;
    }
    
    // Fallback to replies array length
    const replies = post._raw?.replies || post.replies;
    if (Array.isArray(replies)) {
      return replies.length;
    }
    
    return 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Creates a reactive observable for saved posts (for real-time updates)
 * @param limit - Maximum number of posts to observe
 * @param callback - Callback function to handle updates
 * @returns Subscription object that can be unsubscribed
 */
export const observeSavedPosts = (limit: number = 5, callback: (posts: SavedPost[]) => void) => {
  try {
    const db = database.active;
    const messagesObservable = db
      .get('messages')
      .query(
        Q.where('starred', true),
        Q.sortBy('ts', Q.desc),
        Q.take(limit * 2)
      )
      .observe();

    return messagesObservable.subscribe(messages => {
      // Filter and format messages
      const filteredMessages = messages.filter(m => {
        return !(MESSAGE_TYPE_ANY_LOAD.includes(m.t) || messageTypesToRemove.includes(m.t));
      });

      const formattedPosts = filteredMessages.slice(0, limit).map(m => {
        let object = { ...m };
        try {
          if (typeof m?._raw?.u === 'string' && m._raw.u.length > 0 && m._raw.u !== '[]') {
            object._raw.u = JSON.parse(m._raw.u);
          }
          if (typeof m?._raw?.attachments === 'string' && m._raw.attachments.length > 0) {
            object._raw.attachments = JSON.parse(m._raw.attachments);
          }
          if (typeof m?._raw?.replies === 'string' && m._raw.replies.length > 0 && m._raw.replies !== '[]') {
            object._raw.replies = JSON.parse(m._raw.replies);
          }
          if (typeof m?._raw?.reactions === 'string' && m._raw.reactions.length > 0 && m._raw.reactions !== '[]') {
            object._raw.reactions = JSON.parse(m._raw.reactions);
          }
        } catch (error) {
          console.log('Error parsing saved post JSON fields:', m._raw);
        }

        return object as SavedPost;
      });

      callback(formattedPosts);
    });
  } catch (error) {
    console.error('Error observing saved posts:', error);
    return { unsubscribe: () => {} }; // Return dummy subscription
  }
};