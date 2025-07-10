import { Check, FileText, Globe, X } from "lucide-react";

export const TOKEN_SETTING = {
  TOKEN: "auth_token",
  USER: "APP_USER",
};

export const PENDING = "pending";
export const APPROVED = "approved";
export const VERIFIED = "verified";
export const UNDER_REVIEW = "under_review";
export const REJECTED = "rejected";

export const DRAFT = 1;
export const PUBLISHED = 2;
export const CANCELLED = 3;
export const COMPLETED = 4;

export const EVENT_TYPE_OBJECT = {
  ONLINE: "online",
  OFFLINE: "offline",
  HYBRID: "hybrid",
};
export const EVENT_TYPE_ARRAY = [
  {
    key: "online",
    value: "Online",
  },
  {
    key: "offline",
    value: "Offline",
  },
  {
    key: "hybrid",
    value: "Hybrid",
  },
];

export const EVENT_STATUS_ARRAY = [
  {
    key: 1,
    value: "Draft",
    color: "",
    icon: FileText,
    description: "Event is being prepared and not visible to public",
  },
  {
    key: 2,
    value: "Published",
    color: "bg-green-400 hover:bg-green-500",
    icon: Globe,
    description: "Event is live and accepting registrations",
  },
  {
    key: 3,
    value: "Cancelled",
    color: "bg-red-400 hover:bg-red-500",
    icon: X,
    description: "Event has been cancelled and refunds processed",
  },
  {
    key: 4,
    value: "Completed",
    color: "bg-blue-400 hover:bg-blue-500",
    icon: Check,
    description: "Event has finished successfully",
  },
];

export const GENDER = [
  {
    key: "male",
    value: "Male",
  },
  {
    key: "female",
    value: "Female",
  },
];
