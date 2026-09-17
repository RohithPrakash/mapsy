# Mapsy - KML Walk Visualizer

A lightweight, browser-based visualizer for walking, running, and hiking tracks stored in `.kml` or `.kmz` files. Drop a file onto the page and see the route on an interactive map, along with distance, duration, elevation, and an animated playback of the walk.

Built for my personal OpenTracks recordings, but it works with any KML/KMZ that contains a `<Track>` or `<LineString>`.

## Demo

<video src="demo/walk-preview-2026-09-17.webm" controls loop muted playsinline width="100%"></video>

A share preview exported straight from Mapsy - [download the clip](demo/walk-preview-2026-09-17.webm) if it doesn't play inline.

Want to try it with real data? Grab [`demo/run.kml`](demo/run.kml) and drop it onto the upload area.

## Features

- **Drag-and-drop upload** for `.kml` and `.kmz` files
- **KMZ extraction** - automatically pulls the KML out of a zipped KMZ
- **Interactive map** using Leaflet + CartoDB tiles
- **Track stats**: distance, duration, elevation gain/loss displayed in a sidebar panel
- **Start/end markers** placed at the first and last track points
- **Animated playback** with play / pause / reset controls and a scrubber
- **Pace gradient**: when speed data is present, both the ghost route and the animated progress line are colored by pace - slower segments are lighter, faster segments are darker; a legend in the stats panel shows the min/max pace range
- **Pace color toggle**: switch the animated progress line between pace gradient and a solid color
- **Customizable line**: change color and thickness of the animated progress line; color picker and width slider in the control bar
- **Basemap toggle**: switch the map between CartoDB Voyager, Positron, and Dark Matter
- **Share preview**: generate a looping route animation (3–60 seconds) as MP4 or WebM, with selectable basemap and aspect ratio (1:1, 16:9, 9:16)
- **Mobile-friendly controls**: the bottom control bar scrolls horizontally on small screens

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- [Leaflet](https://leafletjs.com/) for the map
- [JSZip](https://stuk.github.io/jszip/) for KMZ extraction
- [html2canvas](https://html2canvas.hertzen.com/) for preview background capture
- CartoDB basemap tiles (Voyager, Positron, Dark Matter)

## Usage

1. Open `index.html` in a browser, or serve the folder with any static web server.
2. Drag a `.kml` or `.kmz` file onto the upload area, or click to select a file.
3. Use the controls at the bottom to play, pause, or scrub through the animation.
4. Adjust line color, thickness, and pace coloring from the control bar.
5. Click **Share preview** to export a video of the route animation in MP4 or WebM format.

## Hosting

Mapsy is a static single-page app - no backend required. Host it with any static file server such as **Caddy**, **Nginx**, or GitHub Pages.

## Data Notes

- KML 2.2 and 2.3 `<Track>` elements are supported, with a fallback to `<LineString>`.
- Pace coloring requires per-point speed data (e.g. OpenTracks `<SimpleArrayData name="speed">`). If speed data is absent, a plain grey ghost route is shown and the pace toggle is hidden.
- All processing happens in the browser; files are never uploaded to a server.
