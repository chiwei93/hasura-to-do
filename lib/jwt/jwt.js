import { promisify } from "util";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken(token) {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, {
      algorithm: "HS256",
    });

    if (!decoded) {
      throw new Error("Failed to decode jwt token");
    }

    const hasuraHeaders = decoded["https://hasura.io/jwt/claims"];

    if (hasuraHeaders) {
      const userId = hasuraHeaders["x-hasura-user-id"];

      if (userId) {
        return userId;
      }

      return null;
    }

    return null;
  } catch (err) {
    console.log(err);
    console.log(err.message);

    throw err;
  }
}
