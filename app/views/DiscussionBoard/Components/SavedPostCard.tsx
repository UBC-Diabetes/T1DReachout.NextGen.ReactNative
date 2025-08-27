import React from 'react';
import { View, Text, Image } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Avatar from '../../../containers/Avatar';
import { getIcon, handleStar } from '../helpers';
import { loadMissedMessages } from '../../../lib/methods';
import * as allStyles from './styles';
import {
	formatSavedPostDate,
	getPostAuthorName,
	getPostAuthorUsername,
	getPostReactionsCount,
	getPostRepliesCount,
	truncatePostContent
} from '../../HomeView/savedPostsHelpers';
import { IApplicationState } from '../../../definitions';
import { goRoom } from '../../../lib/methods/helpers/goRoom';

const SavedPostCard = ({ post, server, theme }) => {
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { createSavedPostCardStyles } = allStyles;
	const styles = createSavedPostCardStyles({ theme });

	const onPress = () => {
		const { id, _raw: rawPost } = post;
		const { rid, tmid, tmsg, msg } = rawPost;

		// If the saved message is a reply inside a thread
		if (tmid) {
			goRoom({
				item: {
					rid,
					t: 'thread', // This is a placeholder, the tmid will dictate the navigation
					tmid,
					name: tmsg || 'Thread' // Pass the thread title
				},
				isMasterDetail,
				jumpToMessageId: post._raw.id // Jump to the specific reply
			});
		} else {
			// If the saved message is the start of a thread
			goRoom({
				item: {
					rid,
					t: 'thread',
					tmid: post._raw.id,
					name: msg // Use the message content as the title
				},
				isMasterDetail,
				jumpToMessageId: post._raw.id // Jump to the specific reply
			});
		}
	};

	return (
		<Touchable key={post.id} style={styles.savedPostItem} onPress={onPress} activeOpacity={0.7}>
			<View style={styles.savedPostContent}>
				<View style={styles.savedPostHeader}>
					<View style={styles.profileImageContainer}>
						<Avatar
							text={getPostAuthorUsername(post)}
							style={styles.profileImage}
							size={24}
							server={server}
							borderRadius={12}
							rid={post.rid}
						/>
					</View>
					<View style={styles.savedPostInfo}>
						<Text style={styles.savedPostAuthor} numberOfLines={1}>
							{getPostAuthorName(post)}
						</Text>
						<Text style={styles.savedPostDate}>{formatSavedPostDate(post._raw?.ts || post.ts)}</Text>
					</View>
					<Touchable
						onPress={() => {
							handleStar(post._raw || post, async () => {
								await loadMissedMessages({ rid: post.rid, lastOpen: moment().subtract(7, 'days').toDate() });
							});
						}}
						style={styles.bookmarkButton}
						activeOpacity={0.7}>
						<Image source={getIcon('solidSave')} style={styles.bookmarkIcon} resizeMode='contain' />
					</Touchable>
				</View>
				<Text style={styles.savedPostText} numberOfLines={2}>
					{truncatePostContent(post._raw?.msg || post.msg, 100)}
				</Text>
				<View style={styles.savedPostStats}>
					<Text style={styles.savedPostStat}>❤️ {getPostReactionsCount(post)}</Text>
					<Text style={styles.savedPostStat}>💬 {getPostRepliesCount(post)}</Text>
				</View>
			</View>
		</Touchable>
	);
};

export default SavedPostCard;
