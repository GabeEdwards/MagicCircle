# Magic Circle

A simple, local-first Magic: The Gathering team life tracker for a shared tablet.

## Run locally

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/`. The app has no build step, backend, account system, or
runtime dependency.

## GitHub Pages

Publish the repository root as the GitHub Pages source. The static `index.html` entry
point and relative asset paths work from a project page URL.

Game state and recent results stay in the browser's local storage. Load the page once,
then tracking continues without a network connection. Browser storage can be cleared
by the device owner.

The tracker uses fixed Team Blue and Team Green identities, alphabetized rosters,
one-point and five-point life controls, and a derived player-results table based on
completed games.

The default presentation is a dark theme with distinct dark blue and dark green team
surfaces. Existing game state and local history are unchanged by the visual theme.
