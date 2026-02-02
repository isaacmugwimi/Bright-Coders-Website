import csrf from "csurf";
import { CSRF_COOKIE_OPTIONS } from "./cookieOptions.js";

export const csrfProtection = csrf({
  cookie: CSRF_COOKIE_OPTIONS,
});