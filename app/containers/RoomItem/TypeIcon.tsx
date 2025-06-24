import React from 'react';

import RoomTypeIcon from '../RoomTypeIcon';
import { ITypeIconProps } from './interfaces';

const TypeIcon = React.memo(({ userId, type, prid, status, isGroupChat, teamMain, size, style, sourceType, roomName }: ITypeIconProps) => (
	<RoomTypeIcon
		userId={userId}
		type={prid ? 'discussion' : type}
		isGroupChat={isGroupChat}
		status={status}
		teamMain={teamMain}
		size={size}
		style={style}
		sourceType={sourceType}
		roomName={roomName}
	/>
));

export default TypeIcon;
