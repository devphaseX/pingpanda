import { generateRandomString } from "oslo/crypto";

export const generateApiKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return generateRandomString(32, characters);
};
