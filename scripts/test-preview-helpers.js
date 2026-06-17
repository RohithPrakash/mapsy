const assert = require('assert');

function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeRouteDistances(coords) {
  const dists = [0];
  for (let i = 1; i < coords.length; i++) {
    dists.push(dists[i - 1] + haversine(coords[i - 1], coords[i]));
  }
  return dists;
}

function getPointAlongRoute(coords, distances, t) {
  const clamped = Math.max(0, Math.min(1, t));
  const total = distances[distances.length - 1];
  if (total === 0 || coords.length === 0) return coords[0];
  const target = clamped * total;
  let i = 1;
  while (i < distances.length && distances[i] < target) i++;
  const segStart = distances[i - 1];
  const segEnd = distances[i];
  const segLen = segEnd - segStart;
  const f = segLen === 0 ? 0 : (target - segStart) / segLen;
  return [coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * f,
          coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * f];
}

function computeCanvasSize(containerWidth, containerHeight, ratioStr) {
  const ratios = { square: 1, landscape: 16 / 9, portrait: 9 / 16 };
  const ratio = ratios[ratioStr];
  if (!ratio) return { width: containerWidth, height: containerHeight };
  const containerRatio = containerWidth / containerHeight;
  if (containerRatio > ratio) {
    return { width: Math.round(containerHeight * ratio), height: containerHeight };
  }
  return { width: containerWidth, height: Math.round(containerWidth / ratio) };
}

// Tests
const coords = [[0, 0], [0, 1], [0, 2]];
const distances = computeRouteDistances(coords);
assert.strictEqual(distances.length, 3);
assert.ok(distances[2] > distances[1]);

const mid = getPointAlongRoute(coords, distances, 0.5);
assert.ok(Math.abs(mid[0] - 0) < 1e-9);
assert.ok(Math.abs(mid[1] - 1) < 1e-6);

const start = getPointAlongRoute(coords, distances, 0);
assert.deepStrictEqual(start, coords[0]);

const end = getPointAlongRoute(coords, distances, 1);
assert.deepStrictEqual(end, coords[coords.length - 1]);

const beyondEnd = getPointAlongRoute(coords, distances, 1.5);
assert.deepStrictEqual(beyondEnd, coords[coords.length - 1]);

const beforeStart = getPointAlongRoute(coords, distances, -0.5);
assert.deepStrictEqual(beforeStart, coords[0]);

const square = computeCanvasSize(1920, 1080, 'square');
assert.strictEqual(square.width, 1080);
assert.strictEqual(square.height, 1080);

const landscape = computeCanvasSize(1920, 1080, 'landscape');
assert.strictEqual(landscape.width, 1920);
assert.strictEqual(landscape.height, 1080);

const portrait = computeCanvasSize(1920, 1080, 'portrait');
assert.strictEqual(portrait.width, 608);
assert.strictEqual(portrait.height, 1080);

console.log('All preview helper tests passed');
