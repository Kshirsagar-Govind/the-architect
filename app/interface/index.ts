 export interface IUser {
  id: string;
  name: string;
  email: string;
  role:   "ADMIN" | "MANAGER" | "TESTER" | "CLIENT";
  accountStatus: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog {
url:string;
email:string;
ip:string;
body:string;
method:string;
}

export interface IProject{ 
  id: string;
  title: string;
  desc: string;

  projectType: "WEBSITE" | "WEB_APP" | "MOBILE_APP" | "API";

  clientId: string;
  managerId: string;
  members: string[];

  status: "HOLD" | "INACTIVE" | "IN_PROGRESS" | "COMPLETED";

  scope: {
    websiteUrl?: string;          // https://example.com
    baseApiUrl?: string;          // https://api.example.com

    allowedDomains?: string[];
    blockedUrls?: string[];

    environment: "PROD" | "STAGING" | "DEV";

    authRequired: boolean;
    testAccounts?: {
      username: string;
      password: string;
      role?: string;
    }[];
  };

  endpoints?: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    description?: string;
  }[];

  appFile?: {
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
  };

  testingTypes: (
  "VAPT" |
  "WEB_SECURITY" |
  "API_SECURITY" |
  "AUTH_TESTING" |
  "BUSINESS_LOGIC" 
  )[];

}