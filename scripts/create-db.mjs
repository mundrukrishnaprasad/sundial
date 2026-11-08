import { neon } from "@neondatabase/serverless";

const baseUrl = process.env.BASE_DATABASE_URL;
if (!baseUrl) {
  console.error("BASE_DATABASE_URL is required");
  process.exit(1);
}

const admin = neon(baseUrl);

const existing = await admin`SELECT 1 FROM pg_database WHERE datname = 'sundial'`;
if (existing.length === 0) {
  await admin.query("CREATE DATABASE sundial");
  console.log("created:sundial");
} else {
  console.log("exists:sundial");
}

const url = new URL(baseUrl);
url.pathname = "/sundial";
console.log(url.toString());
