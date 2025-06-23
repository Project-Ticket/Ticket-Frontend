export interface FormStateInterface {
  error?: any;
  validation?: any;
  success?: any;
  values?: any;
}

export interface PaginationInterface {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  count: number;
  from: number;
  to: number;
  has_more_pages: boolean;
  path: string;
}

export interface ResponseApiInterface {
  success: boolean;
  code: number;
  message: string;
  data?: any;
  meta: {
    pagination: PaginationInterface;
  };
}

export interface CommonInterface {
  id: number;
  uuid?: number;
  created_at?: number;
  updated_at?: number;
}

export interface UserInterface extends CommonInterface {
  name: string;
  email: string;
  email_verified_at: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  avatar?: string;
  status: boolean;
  is_event_organizer: boolean;
}
