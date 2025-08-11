import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import FastImage from 'react-native-fast-image';
import { shallowEqual, useSelector } from 'react-redux';

import { IApplicationState } from '../../../definitions';
import { getUserSelector } from '../../../selectors/login';
import { getAvatarURL } from '../../../lib/methods/helpers/getAvatarUrl';
import { useAvatarETag } from '../../../containers/Avatar/useAvatarETag';

type ResizeMode = 'cover' | 'stretch' | 'contain' | 'center';

interface BoardIconStripProps {
  avatarText?: string;
  type?: string;
  rid?: string;
  style?: any;
  resizeMode?: ResizeMode;
  children?: React.ReactNode;
}

// Renders the room/avatar PNG as a background filling the left strip
const BoardIconStrip: React.FC<BoardIconStripProps> = ({
  avatarText = '',
  type = '',
  rid,
  style,
  resizeMode = 'cover',
  children
}) => {
  const [measuredHeight, setMeasuredHeight] = useState<number>(160);

  const { server, serverVersion, settings, auth, cdnPrefix } = useSelector(
    (state: IApplicationState) => ({
      server: state.server.server,
      serverVersion: state.server.version,
      settings: state.settings,
      auth: getUserSelector(state),
      cdnPrefix: state.settings.CDN_PREFIX as string
    }),
    shallowEqual
  );

  const { avatarExternalProviderUrl, roomAvatarExternalProviderUrl, blockUnauthenticatedAccess } = useMemo(
    () => ({
      avatarExternalProviderUrl: settings?.Accounts_AvatarExternalProviderUrl as string,
      roomAvatarExternalProviderUrl: settings?.Accounts_RoomAvatarExternalProviderUrl as string,
      blockUnauthenticatedAccess: (settings?.Accounts_AvatarBlockUnauthenticatedAccess ?? true) as boolean
    }),
    [settings]
  );

  const { avatarETag } = useAvatarETag({
    username: auth?.username || '',
    text: avatarText,
    type,
    rid,
    id: auth?.id || ''
  });

  const uri = useMemo(() => {
    // Use measured height for a sharper image on tall strips
    const size = Math.max(56, Math.min(measuredHeight, 512));
    return getAvatarURL({
      type: type as any,
      text: avatarText,
      rid,
      size,
      userId: auth?.id,
      token: auth?.token,
      avatar: undefined,
      server,
      avatarETag,
      serverVersion,
      blockUnauthenticatedAccess,
      avatarExternalProviderUrl,
      roomAvatarExternalProviderUrl,
      cdnPrefix
    });
  }, [type, avatarText, rid, measuredHeight, auth?.id, auth?.token, server, avatarETag, serverVersion, blockUnauthenticatedAccess, avatarExternalProviderUrl, roomAvatarExternalProviderUrl, cdnPrefix]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height || 0);
    if (h && h !== measuredHeight) {
      setMeasuredHeight(h);
    }
  }, [measuredHeight]);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {/* Full-bleed background image */}
      <FastImage source={{ uri }} style={StyleSheet.absoluteFill} resizeMode={resizeMode} />
      {/* Optional overlay content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default BoardIconStrip;

