import csrf from "csurf";

export const CSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // important
  path: "/",
};

export const csrfProtection = csrf({
  cookie: CSRF_COOKIE_OPTIONS,
});
