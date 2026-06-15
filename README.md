# Mapsy — KML Walk Visualizer

A lightweight, browser-based visualizer for walking, running, and hiking tracks stored in `.kml` or `.kmz` files. Drop a file onto the page and see the route on an interactive map, along with distance, duration, elevation, and an animated playback of the walk.

Built for my personal OpenTracks recordings, but it works with any KML/KMZ that contains a `<Track>` or `<LineString>`.

## Features

- **Drag-and-drop upload** for `.kml` and `.kmz` files
- **KMZ extraction** — automatically pulls the KML out of a zipped KMZ
- **Interactive map** using Leaflet + CartoDB Voyager tiles
- **Track stats**: distance, duration, elevation gain/loss
- **Animated playback** with play / pause / reset and a scrubber
- **Pace gradient**: when speed data is present, the ghost route is colored by pace (slower = lighter, faster = darker)
- **Customizable progress route**: change line color and thickness
- **Keyboard-accessible** file drop zone

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- [Leaflet](https://leafletjs.com/) for the map
- [JSZip](https://stuk.github.io/jszip/) for KMZ extraction
- CartoDB Voyager basemap tiles

## Usage

1. Open `index.html` in a browser, or serve the folder with any static web server.
2. Drag a `.kml` or `.kmz` file onto the upload area.
3. Use the controls at the bottom to play the animation or scrub through the route.

## Hosting

Mapsy is a static single-page app, so it can be hosted anywhere with a lightweight web server like **Caddy** or **Nginx**.

## Data Notes

- KML 2.2 and 2.3 `<Track>` elements are supported, with a fallback to `<LineString>`.
- Pace coloring requires speed data (e.g. OpenTracks `<SimpleArrayData name="speed">`).
- All processing happens in the browser; files are never uploaded to a server.
