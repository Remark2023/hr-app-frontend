// src/utils/userUtils.js

export const getUserData = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser.data;
    console.log(token);

    // Decode the JWT payload
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    const payloadObject = JSON.parse(decodedPayload);

    // Extract specific details
    const username = payloadObject.sub;
    const role = payloadObject.roles;
    const issuedAt = new Date(payloadObject.iat * 1000);
    const expiration = new Date(payloadObject.exp * 1000);

    return { token, username, role, issuedAt, expiration };
  } else {
    return null; // Return null if no user data is found in localStorage
  }
};
