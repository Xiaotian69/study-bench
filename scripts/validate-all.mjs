import { spawnSync } from "node:child_process";

const commands = [
  ["run", "validate:content"],
  ["run", "validate:tutor-providers"],
  ["run", "validate:ai-contract"],
  ["run", "validate:tutor-api"],
  ["run", "validate:exercise-ai-grading"],
  ["run", "validate:vision-grading"],
  ["run", "validate:progress-state"],
  ["run", "validate:mastery-state"],
  ["run", "build"]
];

function runNpm(args) {
  if (process.platform === "win32") {
    return spawnSync("cmd.exe", ["/d", "/s", "/c", "npm", ...args], {
      stdio: "inherit"
    });
  }

  return spawnSync("npm", args, {
    stdio: "inherit"
  });
}

for (const args of commands) {
  const label = `npm ${args.join(" ")}`;
  console.log(`\n> ${label}`);
  const result = runNpm(args);

  if (result.error) {
    throw new Error(`validation command failed: ${label}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`validation command failed: ${label}`);
  }
}

console.log("\nall validation checks passed");
