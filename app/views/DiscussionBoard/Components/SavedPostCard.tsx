import React from 'react';
import { View, Text, Image } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import moment from 'moment';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SavedPostCard = ({ post, server, theme }) => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const { createSavedPostCardStyles } = allStyles;
	const styles = createSavedPostCardStyles({ theme });

	return (
		<Touchable
			key={post.id}
			style={styles.savedPostItem}
			onPress={() => {
				navigation.navigate('DiscussionPostView', { item: post });
			}}
			activeOpacity={0.7}
		>
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
						activeOpacity={0.7}
					>
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
