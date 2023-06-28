const accTokenExp = 60 * 60 * 3;
const refTokenExp = 24 * 60 * 60;
export const accessTokenOptions = {
  expiresIn: accTokenExp,
  secret: process.env.JWT_ACCESS_SECRET ?? "access_secret",
};
export const refreshTokenOptions = {
  expiresIn: refTokenExp,
  secret: process.env.JWT_REFRESH_SECRET ?? "refresh_secret",
};
