import cookie from "cookie";
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken'

// for setting token on the server side
export function setTokenCookie(token, res) {
  const MAX_AGE = 7 * 24 * 60 * 60;

  const setCookie = cookie.serialize("jwt_token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.setHeader("Set-Cookie", setCookie);
}

// for getting token on the server side
export function getTokenFromCookie(req) {
  const cookies = cookie.parse(req.headers.cookie || "");

  if (cookies.jwt_token) {
    return cookies.jwt_token;
  }

  return null;
}

// for removing token on the server side
export function removeTokenCookie(res) {
  const setCookie = cookie.serialize("jwt_token", "", {
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.setHeader("Set-Cookie", setCookie);
}

// for getting token on the client side
export function getClientTokenCookie() {
  return Cookies.get("jwt_token");
}
