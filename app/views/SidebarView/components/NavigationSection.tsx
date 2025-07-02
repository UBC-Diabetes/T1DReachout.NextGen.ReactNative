import React from 'react';
import { View } from 'react-native';

import SidebarItem from '../SidebarItem';
import { CustomIcon } from '../../../containers/CustomIcon';
import { themes } from '../../../lib/constants';
import { TSupportedThemes } from '../../../theme';
import { navToTechSupport } from '../../HomeView/helpers';
import Navigation from '../../../lib/navigation/appNavigation';
import I18n from '../../../i18n';

interface INavigationSectionProps {
	theme: TSupportedThemes;
	isMasterDetail: boolean;
	currentItemKey?: string;
	isAdmin: boolean;
	onNavigate: (route: string) => void;
}

const NavigationSection = ({ 
	theme, 
	isMasterDetail, 
	currentItemKey, 
	isAdmin, 
	onNavigate 
}: INavigationSectionProps) => {
	
	const handleTechSupportPress = () => {
		navToTechSupport(Navigation);
	};

	return (
		<View>
			{/* Settings */}
			<SidebarItem
				text={I18n.t('Settings')}
				left={<CustomIcon name='administration' size={20} color={themes[theme].titleText} />}
				onPress={() => onNavigate('SettingsView')}
				testID='sidebar-settings'
				theme={theme}
				current={currentItemKey === 'SettingsView'}
			/>

			{/* Tech Support */}
			<SidebarItem
				text={I18n.t('TechSupport')}
				left={<CustomIcon name='support' size={20} color={themes[theme].titleText} />}
				onPress={handleTechSupportPress}
				testID='sidebar-tech-support'
				theme={theme}
				current={false}
			/>

			{/* Admin Panel - conditional on user role */}
			{isAdmin && (
				<SidebarItem
					text={I18n.t('Admin_Panel')}
					left={<CustomIcon name='settings' size={20} color={themes[theme].titleText} />}
					onPress={() => onNavigate('AdminPanelView')}
					testID='sidebar-admin'
					theme={theme}
					current={currentItemKey === 'AdminPanelView'}
				/>
			)}
		</View>
	);
};

export default NavigationSection;