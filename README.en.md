# ECHO-FALL

**Language / Język / 語言:** [Polski](README.md) · [English](README.en.md) · [繁體中文](README.zh-TW.md)

ECHO-FALL is a self-contained action game that runs offline from a single HTML file. The current main game build is `ECHO-FALL.build.0.12.5.html`.

## How to play

1. Download `ECHO-FALL.build.0.12.5.html` from the repository or the [latest release](https://github.com/krukdc/ECHO-FALL/releases/latest), then open it in a modern browser such as Chrome, Edge, or Firefox.
2. Start a run from the title screen. No installation, server, or internet connection is required.
3. On a phone, open the file in a browser. The game detects touch input and displays on-screen controls. You can rotate your phone to landscape; the layout adapts to the orientation.

Progress, unlocks, and language preferences are saved locally in the browser (`localStorage`). Clearing browser data may erase this save.

## Controls

| Action | Keyboard | Touch screen |
| --- | --- | --- |
| Move | WASD or arrow keys (rebindable) | On-screen joystick |
| Aim | IJKL (rebindable) | Automatic while firing |
| Basic attack | Z (rebindable) | A / FIRE |
| Nova | X (rebindable) | B / NOVA |
| Blink | Space (rebindable) | L / BLINK |
| Character stats | C | SELECT |
| Pause | Escape | START |

Polish, English, or Traditional Chinese (繁體中文) can be selected in Settings from the title screen or pause menu. Keyboard bindings can also be changed there. Language and bindings are saved locally in the browser. Arrow keys remain available as an alternative for movement. The ⛶ button in the header or pause menu toggles fullscreen.

## Project files

- `ECHO-FALL.build.0.12.5.html` — the current game, including its HTML, CSS, and JavaScript.
- `Older Versions/` — archive of earlier game releases.
- `docs/superpowers/specs/` — approved project specifications.
- `docs/superpowers/plans/` — implementation and campaign plans.
- `TODO.md` — known issues and ideas for future development.
- `dev/echo-fall-main-source/` — organized source for main build 0.12.5, without Debug features.
- Test Build 0.12.1 with DEBUGGING ROOM remains a local test version and is not published in this repository.

## Development source (optional)

You only need one HTML file to play. The source and build steps are for game development. Install Node.js, then run these commands from the repository folder:

```powershell
node dev/echo-fall-main-source/tools/build.mjs
```

This command builds `ECHO-FALL.build.0.12.5.html` in the repository root. Test Build 0.12.1 with Debug features remains local.

## Reporting a bug

Open the **Issues** tab and choose the **Report a bug** form. Include the game version, device, browser, screen orientation, and steps to reproduce the issue. The repository is public, so issues and comments are visible to everyone.

## Git basics

Run these commands in the project folder:

```powershell
git status
git log --oneline
git add README.md README.en.md README.zh-TW.md TODO.md
git commit -m "Short description of the change"
```

Save each substantial, independent change in its own commit. You can review changes first with `git diff`.
