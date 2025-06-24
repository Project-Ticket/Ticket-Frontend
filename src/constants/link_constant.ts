export const APP_LINK = {
  HOME: "/",
  TICKETS: "/tickets",
  MERCHANDISE: "/merchandise",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  REGISTER: "/register",
  DASHBOARD: {
    DEFAULT: "/dashboard",
    ORGANIZER: {
      DEFAULT: "/dashboard/organizer",
      ADDRESS: "/dashboard/organizer/address",
      PORTFOLIO: "/dashboard/organizer/portfolio",
      DOCUMENT: "/dashboard/organizer/document",
    },
    EVENT: {
      DEFAULT: "/dashboard/events",
      CREATE: "/dashboard/event/create",
      UPDATE: "/dashboard/event/:id/edit",
    },
  },
  VENDOR: {
    DEFAULT: "/vendor",
    REGISTER: "/vendor/register",
    REQUESTS: "/vendor/requests",
  },
};
