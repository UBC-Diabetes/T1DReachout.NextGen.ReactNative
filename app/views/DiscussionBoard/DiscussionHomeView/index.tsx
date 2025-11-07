import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as HeaderButton from '../../../containers/HeaderButton';
import { MESSAGE_TYPE_ANY_LOAD, SortBy, themes } from '../../../lib/constants';
import { withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import DiscussionBoardCard from '../Components/DiscussionBoardCard';
import SavedPostCard from '../Components/SavedPostCard';
import Header from '../Components/Header';
import { DiscussionTabs } from './interaces';
import makeStyles from './styles';
import { messageTypesToRemove } from '../data';
import { getRoomAvatar, isGroupChat } from '../../../lib/methods/helpers';
import { loadMissedMessages } from '../../../lib/methods';
import moment from 'moment';
import { handleStar } from '../helpers';
import { goRoom } from '../../../lib/methods/helpers/goRoom';
import * as Services from '../../../lib/services/restApi';

const VIRTUAL_HUDDLE = {
	ROOM_RID: 'jRXA42HyPKpjAmZpX'
};

const DiscussionHomeView: React.FC = ({ route, theme }) => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { sortBy, showUnread, showFavorites, groupByType } = useSelector((state: IApplicationState) => state.sortPreferences);
	const useRealName = useSelector((state: IApplicationState) => state.settings.UI_Use_Real_Name);
	const server = useSelector((state: IApplicationState) => state.server.server);

	const [selectedTab, setSelectedTab] = useState(route?.params?.selectedTab ?? DiscussionTabs.DISCUSSION_BOARDS);
	const [boards, setBoards] = useState([]);
	const [starredPosts, setStarredPosts] = useState([]);
	const isFocused = useIsFocused();

	const themeColors = themes[theme];
	const styles = makeStyles(themeColors);

	useLayoutEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<View style={{ marginLeft: 8 }}>
						<HeaderButton.Drawer navigation={navigation} testID='display-view-drawer' color={themes[theme].superGray} />
					</View>
				),
				headerRight: () => (
					<View style={{ marginRight: 8 }}>
						<HeaderButton.Container>
							<HeaderButton.Item
								iconName='search'
								color={themes[theme].superGray}
								onPress={() => navigation.navigate('DiscussionSearchView', { roomIDs: boards.map((board: any) => board.id) })}
							/>
						</HeaderButton.Container>
					</View>
				)
			});
		}
	});

	useEffect(() => {
		if (isFocused && selectedTab === DiscussionTabs.SAVED_POSTS) {
			getSavedChat();
		}
	}, [isFocused]);

	useEffect(() => {
		const getPublicChannels = async () => {
			try {
				const response = await Services.getChannelsList({
					offset: 0,
					count: 50,
					sort: sortBy === SortBy.Alphabetical ? { name: 1 } : { usersCount: -1 }
				});

				if (response.success && response.channels) {
					const formattedData = response.channels.map((d: any) => {
						return {
							...d,
							id: d._id,
							rid: d._id,
							title: d.fname || d.name,
							description: d.topic,
							avatar: getRoomAvatar(d),
							isGrouChat: isGroupChat(d),
							_raw: {
								id: d._id,
								...d
							}
						};
					});

					// Filter out unwanted channels
					const boards = formattedData.filter((d: any) => {
						// Keep public channels, exclude specific rooms
						return d._id !== 'GENERAL' && d._id !== VIRTUAL_HUDDLE.ROOM_RID;
					});

					setBoards(boards);
				}
			} catch (error) {
				console.log('Error fetching public channels:', error);
				setBoards([]);
			}
		};

		if (selectedTab === DiscussionTabs.DISCUSSION_BOARDS) {
			getPublicChannels();
		}
	}, [isFocused, selectedTab, sortBy]);

	const getSavedChat = async () => {
		const messagesObservable = db.get('messages').query(Q.where('starred', true), Q.sortBy('ts', Q.desc), Q.skip(0)).observe();

		messagesObservable?.subscribe(messages => {
			// filter out messages
			messages = messages.filter(m => {
				return !(MESSAGE_TYPE_ANY_LOAD.includes(m.t) || messageTypesToRemove.includes(m.t));
			});

			const formattedData = messages.map(m => {
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
				} catch (error) {}

				return object;
			});

			setStarredPosts(formattedData);
		});
	};

	// get starred posts
	useEffect(() => {
		if (selectedTab === DiscussionTabs.SAVED_POSTS) {
			getSavedChat();
		}
	}, [selectedTab]);

	// Handle route parameter changes
	useEffect(() => {
		if (route?.params?.selectedTab !== undefined && route.params.selectedTab !== selectedTab) {
			setSelectedTab(route.params.selectedTab);
		}
		// Check if there's a post to open from navigation params
		if (route?.params?.postToOpen) {
			const { postToOpen } = route.params;
			// Navigate to the post view
			navigation.navigate('RoomView', {
				rid: postToOpen.rid,
				tmid: postToOpen.tmid || postToOpen.id,
				name: makeThreadName(postToOpen),
				t: SubscriptionType.THREAD
			});
			// Clear the param so it doesn't trigger again on re-render
			navigation.setParams({ postToOpen: null });
		}
	}, [route?.params?.selectedTab, route?.params?.postToOpen]);

	return (
		<View style={styles.mainContainer}>
			<Header selectedTab={selectedTab} onTabChange={(tab: DiscussionTabs) => setSelectedTab(tab)} />
			<View style={{ width: '100%', flex: 1, backgroundColor: themeColors.nextGenBackground }}>
				{selectedTab === DiscussionTabs.DISCUSSION_BOARDS && (
					<FlatList
						data={boards}
						renderItem={({ item }) => <DiscussionBoardCard item={item} onPress={() => goRoom({ item, isMasterDetail })} />}
						keyExtractor={item => item._raw.id}
						style={{ padding: 16 }}
						ListFooterComponent={<View style={styles.footer} />}
						showsVerticalScrollIndicator={false}
					/>
				)}
				{selectedTab === DiscussionTabs.SAVED_POSTS && (
					<FlatList
						data={starredPosts}
						renderItem={({ item }) => (
							<SavedPostCard
								post={item}
								theme={theme}
								server={server}
							/>
						)}
						keyExtractor={item => item._raw.id}
						style={{ paddingHorizontal: 20, paddingVertical: 4, marginBottom: 32 }}
						ListFooterComponent={<View style={styles.footer} />}
					/>
				)}
			</View>
		</View>
	);
};

export default withTheme(DiscussionHomeView);
