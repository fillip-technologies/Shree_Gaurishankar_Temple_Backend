export const httpOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// Long-lived cookie that marks a device as "trusted" so it won't be
// challenged with an OTP on subsequent logins.
export const deviceCookieOptions = {
  ...httpOptions,
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
};

// Short-lived cookie that binds a pending (password-verified) login to the
// OTP verification step for a new device.
export const challengeCookieOptions = {
  ...httpOptions,
  maxAge: 1000 * 60 * 10, // 10 minutes
};
