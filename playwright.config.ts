import { defineConfig } from "@playwright/test";
import { config } from "dotenv";
import "./extensions";

config();

export default defineConfig({
	testDir: "./src/tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	use: {
		trace: "on-first-retry",
	},
});
