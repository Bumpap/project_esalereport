// authConfig.ts
export const msalConfig = {
    auth: {
      clientId: '',
      authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
      redirectUri: 'http://localhost:3000', // or your production URL
    },
    cache: {
      cacheLocation: 'localStorage', // or 'sessionStorage'
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: ['User.Read'], // Define the scopes you need
  };
  