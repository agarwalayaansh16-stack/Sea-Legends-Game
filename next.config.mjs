import nextConstants from "next/constants.js";

const { PHASE_DEVELOPMENT_SERVER } = nextConstants;

export default (phase) => ({
  reactStrictMode: true,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
