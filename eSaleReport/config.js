// config.js
export const microsoftConfig = {
    issuer: 'https://login.microsoftonline.com/8dc6957b-4869-4877-a511-6563f990d59e/v2.0',
    clientId: '{2fb75217-e2f4-455a-8f2d-105f1cd4c455}',
    redirectUrl: 'exp://tasken', 
    scopes: ['openid', 'profile', 'email', 'offline_access', 'User.Read'],
  };
  