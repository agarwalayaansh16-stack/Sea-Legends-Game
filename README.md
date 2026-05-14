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
