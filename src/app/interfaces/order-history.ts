export interface MenuItem {
  type: string;
  name: string;
  options: string[];
}

export interface Order {
  id: number;
  user_id: number;
  userData?: UserData;
  order_date: string;
  allergies: string;
  has_tupper: number;
  order_type_id: number;
  orderType?: OrderType;
  order_status_id: number;
  orderStatus?: OrderStatus;
  orderDetail?: OrderDetail;
  created_at: string;
  updated_at: string;
  tupper?: string;
  menuItems?: MenuItem[];
}

export interface UserData {
  id: number;
  name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  user_type_id: number;
  created_at: string;
  updated_at: string;
}

export interface OrderType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStatus {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: number;
  option1: string;
  option2: string;
  option3: string;
  created_at: string;
  updated_at: string;
}
