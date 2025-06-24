export const API_LINK = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    CHECK: "auth/check",
    PROFILE: "auth/profile",
  },
  ORGANIZER: {
    STORE: "event-organizer/store",
    UPDATE: "event-organizer/:id/update",
  },
  USER: {},
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
