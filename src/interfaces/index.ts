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
  uuid?: string;
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
  event_organizer?: OrganizerInterface;
}

export interface OrganizerInterface extends CommonInterface {
  user_id: number;
  organization_name: string;
  organization_slug: string;
  description: string;
  logo: string;
  banner: string;
  website: string;
  instagram: string;
  twitter: string;
  facebook: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  verification_status: string;
  verification_notes?: string;
  verified_at: string;
  application_status: string;
  application_fee: string;
  security_deposit: string;
  required_documents: string;
  uploaded_documents: string;
  rejection_reason?: string;
  application_submitted_at: string;
  reviewed_by: number;
  reviewed_at: string;
  status: number;
}

export interface CategoryInterface extends CommonInterface {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: boolean;
}

export interface TagInterface extends CommonInterface {
  name: string;
}

export interface EventInterface extends CommonInterface {
  title: string;
  slug: string;
  description: string;
  terms_conditions: string;
  banner_image: string;
  gallery_images?: any;
  type: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  venue_province: string;
  venue_latitude: string;
  venue_longitude: string;
  online_platform: string;
  online_link: string;
  start_datetime: string;
  end_datetime: string;
  registration_start: string;
  registration_end: string;
  min_age: number;
  max_age: number;
  status: number;
  is_featured: boolean;
  views_count: number;
  organizer: OrganizerInterface;
  category: CategoryInterface;
  tags?: TagInterface[];
}
