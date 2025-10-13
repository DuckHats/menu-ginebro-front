export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  user_type_id: number;
  status: number;
  password?: string;
  remember_token?: string;
}