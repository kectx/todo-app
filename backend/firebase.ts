import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const serviceAccountPath = join(__dirname, "firebase-service-account.json");
  try {
    const serviceAccountFile = readFileSync(serviceAccountPath, "utf-8");
    serviceAccount = JSON.parse(serviceAccountFile);
  } catch (error) {
    throw new Error(
      `Firebase service account not found. Either set FIREBASE_SERVICE_ACCOUNT environment variable or ensure firebase-service-account.json exists at ${serviceAccountPath}`
    );
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
