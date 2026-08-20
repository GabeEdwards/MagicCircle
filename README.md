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
