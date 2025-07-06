export const API_LINK = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    CHECK: "auth/check",
  },
  ORGANIZER: {
    STORE: "event-organizer/store",
    UPDATE: "event-organizer/:id/update",
    RESUBMIT: "event-organizer/:id/resubmit-application",
    APPLICATION: "event-organizer/get-my-status-application",
    REGENERATE_PAYMENT: "event-organizer/:uuid/regenerate-payment-invoice",
  },
  EVENT: {
    CATEGORY: "category",
    INDEX: "event",
    STORE: "event/store",
    SHOW: "event/:slug",
    UPDATE: "event/:slug/update",
    DELETE: "event/:slug/delete",
    UPDATE_STATUS: "event/:slug/update-status",
  },
  TICKET: {
    TYPE: {
      INDEX: "ticket-type",
      STORE: "ticket-type/store",
      SHOW: "ticket-type/:id",
      UPDATE: "ticket-type/:id/update",
      DELETE: "ticket-type/:id/delete",
      UPDATE_STATUS: "ticket-type/:id/update-status",
      AVAILABLE: "ticket-type/:id/available",
    },
  },
  USER: {
    UPDATE_PROFILE: "user/update-profile",
    PROFILE: "user/profile",
  },
  PAYMENT_METHOD: {
    INDEX: "payment-method",
    SHOW: "payment-method/:id/show",
  },
};

export const API_CODE = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  UNPROCESSABLE_ENTITY: 422,
  OK: 200,
};
