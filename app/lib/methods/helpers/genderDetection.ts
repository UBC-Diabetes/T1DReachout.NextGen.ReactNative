import { detect } from 'gender-detection';

/**
 * Custom gender mappings for names that are unisex/unknown in the library
 * or need correction based on our user base
 */
const GENDER_OVERRIDES: Record<string, 'male' | 'female'> = {
	// Unisex names with known gender in our user base
	simran: 'female',
	sina: 'female',
	sydney: 'female',
	vera: 'female',
	vidhi: 'female',
	wella: 'female',
	zulaika: 'female',
	'lori-dawn': 'female',
	lybbie: 'female',
	maleeha: 'female',
	pearlsa: 'female',
	randy: 'male',
	regan: 'female',
	ryley: 'female',
	saffron: 'female',
	shalet: 'female',
	jonath: 'male',
	'jessie-anne': 'female',
	kaleim: 'male',
	lareina: 'female',
	lawrna: 'female',
	len: 'male',
	leslie: 'female',
	agam: 'male',
	akshay: 'male',
	alaana: 'female',
	alea: 'female',
	alex: 'unisex',
	andrea: 'female',
	'ann-marie': 'female',
	baray: 'male',
	bernie: 'unisex',
	carol: 'female',
	dany: 'female',
	paige: 'female',
	sandy: 'female',
	george: 'male',
	nilou: 'female',
	fareeq: 'male',
	xue: 'unisex',
	lee: 'unisex'
};

/**
 * Detects gender from first name with custom overrides
 * @param fullName - Full name or first name
 * @returns Object with gender and firstName (for tracking when gender is unknown/unisex)
 */
export const detectGender = (
	fullName: string | undefined
): {
	gender: 'male' | 'female' | 'unisex' | 'unknown';
	firstName: string;
} => {
	if (!fullName || typeof fullName !== 'string') {
		return { gender: 'unknown', firstName: 'unknown' };
	}

	// Extract first name
	const firstName = fullName.trim().split(' ')[0].toLowerCase();

	if (!firstName) {
		return { gender: 'unknown', firstName: 'unknown' };
	}

	// Check custom overrides first
	if (GENDER_OVERRIDES[firstName]) {
		return {
			gender: GENDER_OVERRIDES[firstName],
			firstName
		};
	}

	// Use library detection
	const detected = detect(firstName);

	if (detected === 'male' || detected === 'female') {
		return { gender: detected, firstName };
	}

	if (detected === 'unisex') {
		return { gender: 'unisex', firstName };
	}

	// Unknown
	return { gender: 'unknown', firstName };
};

/**
 * Gets age group from age for analytics segmentation
 */
export const getAgeGroup = (age: number | string | undefined): string => {
	if (!age) return 'unknown';

	const numAge = typeof age === 'string' ? parseInt(age, 10) : age;

	if (isNaN(numAge)) return 'unknown';

	if (numAge < 13) return 'under_13';
	if (numAge <= 17) return '13_17';
	if (numAge <= 24) return '18_24';
	if (numAge <= 34) return '25_34';
	if (numAge <= 44) return '35_44';
	if (numAge <= 54) return '45_54';
	if (numAge <= 64) return '55_64';
	return '65_plus';
};

/**
 * Gets T1D duration group from diagnosis year for analytics segmentation
 */
export const getT1DDuration = (t1dSince: number | string | undefined): string => {
	if (!t1dSince) return 'unknown';

	const diagnosisYear = typeof t1dSince === 'string' ? parseInt(t1dSince, 10) : t1dSince;

	if (isNaN(diagnosisYear)) return 'unknown';

	const currentYear = new Date().getFullYear();
	const duration = currentYear - diagnosisYear;

	if (duration < 0) return 'unknown';
	if (duration < 1) return 'less_than_1_year';
	if (duration <= 5) return '1_5_years';
	if (duration <= 10) return '5_10_years';
	if (duration <= 20) return '10_20_years';
	return 'over_20_years';
};
