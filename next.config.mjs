import nextConstants from "next/constants.js";

const { PHASE_DEVELOPMENT_SERVER } = nextConstants;

export default (phase) => ({
  reactStrictMode: true,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  // public/index.html is a build copy of the game shell; send visitors and crawlers to the real home page
  // so Google does not see a second, canonical-less copy of it.
  async redirects() {
    return [{ source: "/index.html", destination: "/", permanent: true }];
  },
});
