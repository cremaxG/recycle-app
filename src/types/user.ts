export interface LoginResult {
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
}
