import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { requestCurrentLocation, setManualLocation, getStoredUserLocation, AREA_LOCATIONS } from '../src/lib/location.ts';

const originals = Object.fromEntries(['window', 'navigator', 'sessionStorage'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
after(() => {
  for (const [key, descriptor] of Object.entries(originals)) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});
function setup(getCurrentPosition, secure = true) {
  const values = new Map();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { isSecureContext: secure } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { geolocation: getCurrentPosition ? { getCurrentPosition } : undefined } });
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  } });
  return values;
}
const position = { coords: { latitude: 6.9, longitude: 79.8 } };

test('high-accuracy failure retries coarse location and stores success', async () => {
  const calls = [];
  setup((success, failure, options) => {
    calls.push(options.enableHighAccuracy);
    if (options.enableHighAccuracy) failure({ code: 2 });
    else success(position);
  });
  const result = await requestCurrentLocation(true);
  assert.deepEqual(calls, [true, false]);
  assert.equal(result.status, 'ready');
  assert.equal(result.location.source, 'current');
  assert.deepEqual(getStoredUserLocation(), result.location);
});

test('failed refresh preserves the selected area', async () => {
  setup((success, failure) => failure({ code: 1 }));
  setManualLocation(AREA_LOCATIONS[1]);
  const result = await requestCurrentLocation(true);
  assert.equal(result.status, 'ready');
  assert.deepEqual(result.location, AREA_LOCATIONS[1]);
  assert.deepEqual(getStoredUserLocation(), AREA_LOCATIONS[1]);
  assert.match(result.message, /Using Nugegoda/);
});

test('old cached denial does not block a fresh browser request', async () => {
  const values = setup((success) => success(position));
  values.set('surgimap-location-unavailable', 'true');
  assert.equal((await requestCurrentLocation()).status, 'ready');
});

test('permission denial is reported without repeatedly prompting', async () => {
  let calls = 0;
  setup((success, failure) => { calls++; failure({ code: 1 }); });
  const result = await requestCurrentLocation(true);
  assert.equal(result.status, 'denied');
  assert.equal(calls, 1);
  assert.match(result.message, /browser and device settings/);
});

test('timeout retries once then reports timeout', async () => {
  let calls = 0;
  setup((success, failure) => { calls++; failure({ code: 3 }); });
  assert.equal((await requestCurrentLocation(true)).status, 'timeout');
  assert.equal(calls, 2);
});

test('insecure context and missing provider resolve with guidance', async () => {
  setup(() => assert.fail('Must not call geolocation'), false);
  assert.equal((await requestCurrentLocation()).status, 'insecure');
  setup(undefined);
  assert.equal((await requestCurrentLocation()).status, 'unavailable');
});

test('manual selection wins over an in-flight device response', async () => {
  let complete;
  setup((success) => { complete = success; });
  const pending = requestCurrentLocation(true);
  setManualLocation(AREA_LOCATIONS[2]);
  complete(position);
  assert.deepEqual((await pending).location, AREA_LOCATIONS[2]);
  assert.deepEqual(getStoredUserLocation(), AREA_LOCATIONS[2]);
});

test('stored invalid coordinates are rejected and browser exceptions resolve', async () => {
  const values = setup(() => { throw new Error('Provider failure'); });
  values.set('surgimap-user-location', JSON.stringify({ latitude: 100, longitude: 0 }));
  assert.equal(getStoredUserLocation(), null);
  assert.equal((await requestCurrentLocation()).status, 'unavailable');
});
