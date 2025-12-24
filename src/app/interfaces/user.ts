import { Allergy } from "./allergy";

export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  user_type_id: number;
  status: number;
  password?: string;
  remember_token?: string;
  allergies?: Allergy[];
  custom_allergies?: string;
  balance: number;
}