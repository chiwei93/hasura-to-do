import { removeTokenCookie } from "../../lib/cookie/cookie";

export default async function handler(req, res) {
  try {
    removeTokenCookie(res);

    res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
