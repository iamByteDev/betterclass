import { getDatastore } from "./datastore";

const MainDataStore = getDatastore("main");

export async function getStoredClientSecret() {
  const secret = await MainDataStore.get("secret");
  if (typeof secret === "string") {
    return secret;
  }
  return null;
}
export async function setStoredClientSecret(secret: string) {
  return await MainDataStore.set("secret", secret)
    .then(() => true)
    .catch(() => false);
}
