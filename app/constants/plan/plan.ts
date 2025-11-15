// PLAN TYPES (enum-like)
export const PLAN_TYPES = {
    BASIC: 'basic',
    STANDARD: 'standard',
    ADVANCED: 'advanced',
} as const;

// PLAN FEATURES
export const PLAN_FEATURES = {
    [PLAN_TYPES.BASIC]: {
        credits: 50,
        testingTime: 7,
        projectClosingDays: 2,
        assets: 2,
        extraCreditCost: 10,
        securedCertificate: false,
        securedBadge: false,
    },

    [PLAN_TYPES.STANDARD]: {
        credits: 150,
        testingTime: 14,
        projectClosingDays: 3,
        assets: 2,
        securedCertificate: true,
        extraCreditCost: 6,
        securedBadge: true,
    },

    [PLAN_TYPES.ADVANCED]: {
        credits: 500,
        testingTime: 28,
        projectClosingDays: 7,
        assets: 5,
        securedCertificate: true,
        securedBadge: true,
        extraCreditCost: 3,
    },
};

// PLAN PRICING (optional but cleaner)
export const PLAN_PRICING = {
    [PLAN_TYPES.BASIC]: 100,
    [PLAN_TYPES.STANDARD]: 200,
    [PLAN_TYPES.ADVANCED]: 280,
};

