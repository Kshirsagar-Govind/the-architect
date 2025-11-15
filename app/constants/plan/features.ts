export let features = {
    basic: {
        credits: 50,
        testingTime: 7, // its a time for testing team to find and report bugs/vulnerabilities
        projectClosingDays: 2, // its a time for client's dev team to fix the reported bugs
        assets: 2,
        extraCreditCost: 10, // if buys extra credit it will cost 10$ per credit
        securedCertificate: false,
        securedBadge: false,
    },
    standard: {
        credits: 150,
        testingTime: 14,// its a time for testing team to find and report bugs/vulnerabilities
        projectClosingDays: 3, // its a time for client's dev team to fix the reported bugs
        assets: 2,
        securedCertificate: true,
        extraCreditCost: 6, // if buys extra credit it will cost 10$ per credit
        securedBadge: true,
    },
    advanced: {
        credits: 500,
        testingTime: 28, // its a time for testing team to find and report bugs/vulnerabilities
        projectClosingDays: 7, // its a time for client's dev team to fix the reported bugs
        assets: 5,
        securedCertificate: true, // its a certificate given by testing org to a client
        securedBadge: true, //its a badge given by testing org to a client
        extraCreditCost: 3, // if buys extra credit it will cost 10$ per credit
    },
}