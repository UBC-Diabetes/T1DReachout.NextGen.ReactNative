import { useEffect, useState } from 'react';

import { Services } from '../../../../lib/services';

// Cache to store user data to avoid repeated API calls
const userDataCache = new Map<string, { roles: string[]; age?: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserData = (userId?: string) => {
	const [userData, setUserData] = useState<{ roles: string[]; age?: number }>({ roles: [] });

	useEffect(() => {
		if (!userId) {
			setUserData({ roles: [] });
			return;
		}

		const fetchUserData = async () => {
			try {
				// Check cache first
				const cached = userDataCache.get(userId);
				if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
					setUserData({ roles: cached.roles, age: cached.age });
					return;
				}

				// Fetch from API
				const result = await Services.getUserInfo(userId);
				if (result?.user) {
					const userRoles = result.user.roles || [];
					const age = result.user.customFields?.Age ? parseInt(result.user.customFields.Age, 10) : undefined;

					// Cache the result
					userDataCache.set(userId, {
						roles: userRoles,
						age,
						timestamp: Date.now()
					});

					setUserData({ roles: userRoles, age });
				} else {
					setUserData({ roles: [] });
				}
			} catch (error) {
				console.log('Error fetching user data:', error);
				setUserData({ roles: [] });
			}
		};

		fetchUserData();
	}, [userId]);

	return userData;
};
