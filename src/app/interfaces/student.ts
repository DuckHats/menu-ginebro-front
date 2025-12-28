export interface Student {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  status: number;
  user_type_id?: number | null;
  balance?: number;
  avatar?: string;
}
