#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runRoot = process.env.LOCAL_DEV_DIR || "/private/tmp/courses-shop-local-dev";
const port = process.env.PORT || "3000";

const env = {
  ...process.env,
  DATABASE_URL: normalizeDatabaseUrl(process.env.DATABASE_URL || readEnvValue(".env", "DATABASE_URL") || readEnvValue(".env.example", "DATABASE_URL")),
  NEXT_PUBLIC_APP_URL: `http://localhost:${port}`,
  APP_VERSION: process.env.APP_VERSION || "local-dev"
};

function main() {
  log(`Preparing local runtime in ${runRoot}`);
  syncProject();
  ensureDependencies();

  if (process.env.LOCAL_DEV_SKIP_DB !== "1") {
    run("docker", ["compose", "up", "-d", "db"], { cwd: sourceRoot });
    run("npm", ["run", "prisma:generate"], { cwd: runRoot });
    run("npm", ["run", "prisma:migrate:deploy"], { cwd: runRoot });
    run("npm", ["run", "prisma:seed"], { cwd: runRoot });
  }

  log(`Starting Next at http://localhost:${port}`);
  const child = spawn("npm", ["run", "dev", "--", "--turbo", "-p", port], {
    cwd: runRoot,
    env,
    stdio: "inherit"
  });

  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 0);
  });
}

function syncProject() {
  mkdirSync(runRoot, { recursive: true });
  run("rsync", [
    "-a",
    "--delete",
    "--exclude",
    ".git",
    "--exclude",
    ".next",
    "--exclude",
    ".next.*",
    "--exclude",
    "node_modules",
    "--exclude",
    "tsconfig.tsbuildinfo",
    `${sourceRoot}/`,
    `${runRoot}/`
  ]);
}

function ensureDependencies() {
  const markerPath = path.join(runRoot, "node_modules", ".local-dev-install-hash");
  const currentHash = hashFiles(["package.json", "package-lock.json"]);
  const installedHash = existsSync(markerPath) ? readFileSync(markerPath, "utf8").trim() : "";

  if (installedHash === currentHash) {
    log("Dependencies are already installed");
    return;
  }

  run("npm", ["ci"], { cwd: runRoot });
  writeFileSync(markerPath, currentHash);
}

function hashFiles(files) {
  const hash = createHash("sha256");

  for (const file of files) {
    hash.update(readFileSync(path.join(sourceRoot, file)));
  }

  return hash.digest("hex");
}

function run(command, args, options = {}) {
  log(`${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: options.cwd || sourceRoot,
    env,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function readEnvValue(fileName, key) {
  const filePath = path.join(sourceRoot, fileName);
  if (!existsSync(filePath)) return "";

  const line = readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .find((item) => item.trim().startsWith(`${key}=`));

  if (!line) return "";

  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

function normalizeDatabaseUrl(value) {
  if (!value) return value;

  return value.replace("@localhost:", "@127.0.0.1:");
}

function log(message) {
  console.info(`[local-dev] ${message}`);
}

main();
