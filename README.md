# Sea Legends

A browser-based 3D action RPG prototype inspired by sea adventure games.

## How to Play

Install dependencies once:

```bash
npm install
```

Run the Next.js app:

```bash
npm run dev
```

Then visit `http://localhost:3000`.

The older static server is still available with:

```bash
npm run serve:static
```

The game loads Three.js from a CDN, so the first load needs an internet connection.

## Public information pages and production configuration

The Next.js deployment includes `/about`, `/game-guide`, `/privacy-policy`, `/terms`, and `/contact`, plus generated `/robots.txt` and `/sitemap.xml`. The current canonical origin is `https://dapolice.vercel.app`; set `NEXT_PUBLIC_SITE_URL` to the permanent canonical origin in the deployment environment if it changes. Set `NEXT_PUBLIC_CONTACT_EMAIL` to a monitored address before launch; until configured, the Contact page displays an owner setup note.

Copy `.env.example` to `.env.local` for local configuration. Environment variables prefixed with `NEXT_PUBLIC_` are public and must never contain secrets.

### AdSense

The supplied publisher ID (`ca-pub-2635367930409387`) is configured and the AdSense publisher script is emitted in the document head for site verification. This does not mean the site is approved, and this project currently renders no ad-unit placements. The repository cannot confirm whether Auto ads are enabled in the publisher account. To disable the script, set `NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED=false`. After Google approves the site and the owner completes required policy and consent setup, set `NEXT_PUBLIC_ADSENSE_ENABLED=true` and provide a real approved slot ID to the reusable `AdUnit` component on an appropriate informational page. Invalid or missing slot configuration renders no ad. Static builds bake public environment values at build time, so changing them requires a rebuild and redeploy. The standalone `server.js` serves only root static files and does not implement the Next.js informational routes; deploy the Next.js app with a compatible Next.js host/adapter for these routes.

### Multiplayer prototype

The optional WebSocket service creates First Sea world servers and enforces a maximum of 10 connected players in each. Each server process holds its rooms and player presence in memory. Players in the same room see one another's avatar and movement. Enemy combat, quest progress, currency, inventory, and saves are still local to each player's browser; this is not yet authoritative co-op gameplay. Room data is cleared when the multiplayer process restarts.

For local development, run the game and multiplayer service in separate terminals:

```bash
npm run dev
npm run multiplayer
```

The development site connects to `ws://localhost:3010/multiplayer` by default. Set `MULTIPLAYER_PORT` to change the service port. Set `MULTIPLAYER_ALLOWED_ORIGINS` to a comma-separated list of allowed browser origins. In production, deploy `multiplayer-server.js` as a persistent Node.js service, set `NEXT_PUBLIC_MULTIPLAYER_URL` to its public `wss://.../multiplayer` endpoint in the site build environment, and allow the site origin on the multiplayer service. Production multiplayer remains offline if that endpoint is unset. Multiple server rooms are hosted by the same process; running multiple backend processes requires shared room coordination and is not configured here. The service does not authenticate local profile names, so do not treat them as verified identities.

### Account and privacy limitations requiring owner action

The in-game profile screens are a client-side prototype, not a sign-in service. They store profile names and saves in browser local storage; there is no password field, server authentication, cross-device sync, or recovery service. On game startup, old profile records are migrated to remove the password and recovery fields stored by an earlier version. The client-side username-based admin shortcut has also been removed. Before presenting accounts as a real service, add server-backed authentication, verified recovery, and a reviewed privacy notice. This project does not currently implement analytics or an AdSense consent-management platform.

## Controls

- `WASD`: Move
- Right mouse drag: Rotate camera
- Left click: Attack
- `Space`: Jump
- `E`: Interact with the quest giver
- `1`: Melee
- `2`: Sword
- `3`: Gun
- `4`: Special ability after completing the first quest

Touch-screen devices also show on-screen movement, combat, interaction, and weapon buttons while in-game. Drag the game view to rotate the camera; advanced skills still use a keyboard.

## Current Features

- Choose Pirates, Marines, or Neutral
- Choose, preview, edit, create, and delete custom human avatars
- Avatar height, bulk, and outfit affect health, range, speed, damage, and defense
- First Sea with 10 progressively larger islands
- Starter Island quest giver
- Quest: defeat 5 bandits
- Money and XP rewards
- Leveling with stat points
- Five stats: melee, defense, sword, gun, and special abilities
- Bandit enemies with respawn and basic chase combat
- Special ability unlock after completing the starter quest
