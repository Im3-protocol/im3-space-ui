import {jwtDecode} from 'jwt-decode';

const decodeToken = (token: string): any => {
  try {
    const decoded = jwtDecode<any>(token);
    console.log("Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const useGetIdentity = (token: string): string => {
  
  const decoded = decodeToken(token);

  // Access the `sub` field which represents the identity
  if (decoded && decoded.sub) {
    const identity = decoded.sub;
    console.log("Identity (sub) in Hook:", identity);
    return identity;
  }

  return "Empty-> No identity";
};

export default useGetIdentity;
