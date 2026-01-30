/**
 * User Demographics Cache
 * Stores user demographic data for inclusion in analytics events
 */

interface UserDemographics {
	gender?: string;
	age_group?: string;
	t1d_duration?: string;
	glucose_method?: string;
	insulin_method?: string;
	stage_of_life?: string;
	location?: string;
	first_name?: string;
}

let cachedDemographics: UserDemographics = {};

/**
 * Set the current user's demographics (called on login)
 */
export const setUserDemographics = (demographics: UserDemographics): void => {
	cachedDemographics = { ...demographics };
};

/**
 * Get the current user's demographics for inclusion in event parameters
 * Returns a copy to prevent mutation
 */
export const getUserDemographics = (): UserDemographics => {
	return { ...cachedDemographics };
};

/**
 * Clear cached demographics (called on logout)
 */
export const clearUserDemographics = (): void => {
	cachedDemographics = {};
};

/**
 * Helper to merge event parameters with user demographics
 * Use this to automatically include demographics in analytics events
 */
export const withDemographics = (eventParams: Record<string, any> = {}): Record<string, any> => {
	const merged = {
		...eventParams,
		...cachedDemographics
	};
	console.log('[withDemographics] Cached demographics:', cachedDemographics);
	console.log('[withDemographics] Merged params:', merged);
	return merged;
};
