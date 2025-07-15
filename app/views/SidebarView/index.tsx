import React, { Component } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerNavigationState } from '@react-navigation/native';
import { Alert, View, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { dequal } from 'dequal';
import { Dispatch } from 'redux';

import { events, logEvent } from '../../lib/methods/helpers/log';
import I18n from '../../i18n';
import userPreferences from '../../lib/methods/userPreferences';
import { NOTIFICATION_PRESENCE_CAP, themes } from '../../lib/constants';
import { TSupportedThemes, withTheme } from '../../theme';
import { getUserSelector } from '../../selectors/login';
import SafeAreaView from '../../containers/SafeAreaView';
import Navigation from '../../lib/navigation/appNavigation';
import styles from './styles';
import { DrawerParamList } from '../../stacks/types';
import { IApplicationState, IUser, TSVStatus } from '../../definitions';
import * as List from '../../containers/List';
import { IActionSheetProvider, withActionSheet } from '../../containers/ActionSheet';
import { setNotificationPresenceCap } from '../../actions/app';

import { ProfileSection, CalendarButton, NavigationSection, BrandingFooter } from './components';

interface ISidebarState {
	showStatus: boolean;
}

interface ISidebarProps {
	baseUrl: string;
	navigation?: DrawerNavigationProp<DrawerParamList>;
	dispatch: Dispatch;
	state?: DrawerNavigationState<DrawerParamList>;
	Site_Name: string;
	user: IUser;
	theme?: TSupportedThemes;
	loadingServer: boolean;
	useRealName: boolean;
	allowStatusMessage: boolean;
	notificationPresenceCap: boolean;
	Presence_broadcast_disabled: boolean;
	supportedVersionsStatus: TSVStatus;
	isMasterDetail: boolean;
	viewStatisticsPermission: string[];
	viewRoomAdministrationPermission: string[];
	viewUserAdministrationPermission: string[];
	viewPrivilegedSettingPermission: string[];
	showActionSheet: IActionSheetProvider['showActionSheet'];
}

class Sidebar extends Component<ISidebarProps, ISidebarState> {
	constructor(props: ISidebarProps) {
		super(props);
		this.state = {
			showStatus: false
		};
	}

	shouldComponentUpdate(nextProps: ISidebarProps, nextState: ISidebarState) {
		const { showStatus } = this.state;
		const {
			Site_Name,
			user,
			baseUrl,
			state,
			isMasterDetail,
			notificationPresenceCap,
			useRealName,
			theme,
			Presence_broadcast_disabled,
			viewStatisticsPermission,
			viewRoomAdministrationPermission,
			viewUserAdministrationPermission,
			viewPrivilegedSettingPermission
		} = this.props;
		// Drawer navigation state
		if (state?.index !== nextProps.state?.index) {
			return true;
		}
		if (nextState.showStatus !== showStatus) {
			return true;
		}
		if (nextProps.Site_Name !== Site_Name) {
			return true;
		}
		if (nextProps.Site_Name !== Site_Name) {
			return true;
		}
		if (nextProps.baseUrl !== baseUrl) {
			return true;
		}
		if (nextProps.theme !== theme) {
			return true;
		}
		if (!dequal(nextProps.user, user)) {
			return true;
		}
		if (nextProps.isMasterDetail !== isMasterDetail) {
			return true;
		}
		if (nextProps.notificationPresenceCap !== notificationPresenceCap) {
			return true;
		}
		if (nextProps.useRealName !== useRealName) {
			return true;
		}
		if (nextProps.Presence_broadcast_disabled !== Presence_broadcast_disabled) {
			return true;
		}
		if (!dequal(nextProps.viewStatisticsPermission, viewStatisticsPermission)) {
			return true;
		}
		if (!dequal(nextProps.viewRoomAdministrationPermission, viewRoomAdministrationPermission)) {
			return true;
		}
		if (!dequal(nextProps.viewUserAdministrationPermission, viewUserAdministrationPermission)) {
			return true;
		}
		if (!dequal(nextProps.viewPrivilegedSettingPermission, viewPrivilegedSettingPermission)) {
			return true;
		}
		return false;
	}

	getIsAdmin() {
		const {
			user,
			viewStatisticsPermission,
			viewRoomAdministrationPermission,
			viewUserAdministrationPermission,
			viewPrivilegedSettingPermission
		} = this.props;
		const { roles } = user;
		const allPermissions = [
			viewStatisticsPermission,
			viewRoomAdministrationPermission,
			viewUserAdministrationPermission,
			viewPrivilegedSettingPermission
		];
		let isAdmin = false;

		if (roles) {
			isAdmin = allPermissions.reduce((result: boolean, permission) => {
				if (permission) {
					return result || permission.some(r => roles.indexOf(r) !== -1);
				}
				return result;
			}, false);
		}
		return isAdmin;
	}

	sidebarNavigate = (route: string) => {
		// @ts-ignore
		logEvent(events[`SIDEBAR_GO_${route.replace('View', '').toUpperCase()}`]);
		Navigation.navigate(route);
	};

	get currentItemKey() {
		const { state } = this.props;
		return state?.routeNames[state?.index];
	}

	onPressUser = () => {
		const { navigation, isMasterDetail, user } = this.props;
		if (isMasterDetail) {
			return;
		}
		
		// Navigate to RoomInfoView showing the user's own profile
		// Create a direct message room ID with the user themselves
		const directRoomId = `${user.id}${user.id}`;
		
		
		Navigation.navigate('RoomInfoView', {
			rid: directRoomId,
			t: 'd', // direct message type
			member: user,
			itsMe: true,
			showCloseModal: false
		});
		navigation?.closeDrawer();
	};

	onPressLearnMorePresenceCap = () => {
		Linking.openURL('https://go.rocket.chat/i/presence-cap-learn-more');
	};

	onPressPresenceLearnMore = () => {
		const { dispatch } = this.props;
		dispatch(setNotificationPresenceCap(false));
		userPreferences.setBool(NOTIFICATION_PRESENCE_CAP, false);

		Alert.alert(
			I18n.t('Presence_Cap_Warning_Title'),
			I18n.t('Presence_Cap_Warning_Description'),
			[
				{
					text: I18n.t('Learn_more'),
					onPress: this.onPressLearnMorePresenceCap,
					style: 'cancel'
				},
				{
					text: I18n.t('Close'),
					style: 'default'
				}
			],
			{ cancelable: false }
		);
	};

	render() {
		const { user, Site_Name, baseUrl, useRealName, isMasterDetail, theme } = this.props;

		if (!user) {
			return null;
		}

		return (
			<View style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<View
					style={[
						styles.container,
						{
							backgroundColor: isMasterDetail ? themes[theme!].backgroundColor : themes[theme!].focusedBackground
						}
					]}>
					{/* Profile Section */}
					<ProfileSection
						user={user}
						siteName={Site_Name}
						baseUrl={baseUrl}
						useRealName={useRealName}
						theme={theme!}
						isMasterDetail={isMasterDetail}
						onPress={this.onPressUser}
					/>

					{/* Calendar Button */}
					<CalendarButton theme={theme!} />

					{/* Spacing after calendar button */}
					<View style={{ height: 16 }} />

					{/* Custom Divider Line */}
					<View style={styles.customDivider} />

					{/* Navigation Section */}
					<NavigationSection
						theme={theme!}
						isMasterDetail={isMasterDetail}
						currentItemKey={this.currentItemKey}
						isAdmin={this.getIsAdmin()}
						onNavigate={this.sidebarNavigate}
					/>

					{/* T1D Branding Footer */}
					<BrandingFooter theme={theme!} />
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state: IApplicationState) => ({
	Site_Name: state.settings.Site_Name as string,
	user: getUserSelector(state),
	baseUrl: state.server.server,
	loadingServer: state.server.loading,
	useRealName: state.settings.UI_Use_Real_Name as boolean,
	allowStatusMessage: state.settings.Accounts_AllowUserStatusMessageChange as boolean,
	Presence_broadcast_disabled: state.settings.Presence_broadcast_disabled as boolean,
	notificationPresenceCap: state.app.notificationPresenceCap,
	isMasterDetail: state.app.isMasterDetail,
	viewStatisticsPermission: state.permissions['view-statistics'] as string[],
	viewRoomAdministrationPermission: state.permissions['view-room-administration'] as string[],
	viewUserAdministrationPermission: state.permissions['view-user-administration'] as string[],
	viewPrivilegedSettingPermission: state.permissions['view-privileged-setting'] as string[]
});

export default connect(mapStateToProps)(withActionSheet(withTheme(Sidebar)));
