#!/usr/bin/env node
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

// Proxy to the tailwindcss CLI that is installed alongside @arron/tailwind.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cli = path.resolve(__dirname, "../node_modules/tailwindcss/lib/cli.js")

const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
})

child.on("exit", (code) => process.exit(code ?? 1))

