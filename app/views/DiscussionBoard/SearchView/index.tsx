import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Q } from '@nozbe/watermelondb';
import { useDebounce } from 'use-debounce';

import database from '../../../lib/database';
import SearchBox from '../../../containers/SearchBox';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState, SubscriptionType } from '../../../definitions';
import { themes } from '../../../lib/constants';
import createStyles from './styles';
import DiscussionPostCard from '../Components/DiscussionPostCard';
import { handleStar } from '../helpers';
import { loadMissedMessages } from '../../../lib/methods';
import moment from 'moment';
import { makeThreadName } from '../../../lib/methods/helpers';

type SearchProps = {
	route: any;
};

const SearchView: React.FC<SearchProps> = ({ route }) => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();

	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();
	const styles = createStyles(theme);

	const [searchText, setSearchText] = useState('');
	const [debounceValue] = useDebounce(searchText, 1000);
	const [filteredData, setFilteredData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const searchItem = ({ item, index }: searchItemProps) => {
		const formattedItem = { ...item };

		try {
			if (item?._raw?.u?.length && typeof item._raw.u === 'string' && item._raw.u !== '[]') {
				formattedItem._raw.u = JSON.parse(item._raw.u);
			}
			if (item?._raw?.attachments?.length > 0 && typeof item._raw.attachments === 'string') {
				formattedItem._raw.attachments = JSON.parse(item._raw.attachments);
			}
			if (item?._raw?.replies?.length > 0 && typeof item._raw.replies === 'string' && item._raw.replies !== '[]') {
				formattedItem._raw.replies = JSON.parse(item._raw.replies);
			}
			if (item?._raw?.reactions?.length > 0 && typeof item._raw.reactions === 'string' && item._raw.reactions !== '[]') {
				formattedItem._raw.reactions = JSON.parse(item._raw.reactions);
			}
		} catch (e) {
			// console.log('err', e);
		}

		return (
			<DiscussionPostCard
				item={formattedItem}
				onPress={(params: any) => navigation.navigate('DiscussionPostView', params)}
				starPost={(message: any) =>
					handleStar(message, async () => {
						await loadMissedMessages({ rid: message.rid, lastOpen: moment().subtract(7, 'days').toDate() });
						search();
					})
				}
			/>
		);
	};

	const search = () => {
		const db = database.active;

		setIsLoading(true);
		try {
			const whereClause = [Q.where('msg', Q.like(`%${searchText}%`))];

			if (route?.params?.roomIDs && route?.params?.roomIDs.length > 0) {
				whereClause.push(Q.where('rid', Q.oneOf(route.params.roomIDs)));
			}

			const messagesObservable = db
				.get('messages')
				.query(...whereClause, Q.sortBy('ts', Q.desc), Q.skip(0))
				.observe();
			messagesObservable.subscribe((data: any) => {
				setFilteredData(data);
			});
		} catch (e) {
			console.error('err', e);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		// ignoring the search quries that are empty
		const stringWithoutSpaces = debounceValue.replace(/\s+/g, '');
		setFilteredData([]);
		if (debounceValue && debounceValue !== '' && stringWithoutSpaces !== '') {
			search();
		}
	}, [debounceValue]);

	return (
		<View style={styles.mainContainer}>
			{isLoading && <ActivityIndicator size='large' color={themes[theme].auxiliaryText} />}
			<SearchBox onChangeText={setSearchText} onSubmitEditing={search} />
			<FlatList
				data={filteredData}
				renderItem={searchItem}
				ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
				ListFooterComponent={() => <View style={{ height: 40 }} />}
			/>
		</View>
	);
};

export default withTheme(SearchView);
