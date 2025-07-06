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
      EDIT: "/dashboard/event/edit?uid=:uid",
      SHOW: "/dashboard/event/:uid",
      TICKET: {
        CREATE: "/dashboard/event/:uid/create",
        EDIT: "/dashboard/event/:uid/edit?ticket_uid=:ticket_uid",
      },
    },
  },
  VENDOR: {
    DEFAULT: "/vendor",
    REGISTER: "/vendor/register",
    REQUEST: "/vendor/request",
    EDIT: "/vendor/request/edit",
  },
  SETTINGS: {
    DEFAULT: "/settings",
  },
};
