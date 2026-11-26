'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from '@vis.gl/react-google-maps';
import type { MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { motion } from 'motion/react';
import { Globe, LocateFixed, MapPin, Minus, Plus } from 'lucide-react';

const KATHA_COORDS = {
  lat: 26.1796778,
  lng: 85.8486927,
} as const;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const GLOBE_DEFAULT_ZOOM = 1.0;
const GLOBE_MIN_ZOOM = 0.72;
const GLOBE_APPROACH_START_ZOOM = 1.38;
const GLOBE_ENTER_MAP_ZOOM = 1.92;
const MAP_DEFAULT_ZOOM = 16;
const MAP_EXIT_TO_GLOBE_ZOOM = 11.2;

const HEX_PALETTE_RGB: [number, number, number][] = [
  [175, 142, 177], // #AF8EB1 soft mauve
  [154, 113, 156], // #9A719C muted plum
  [183, 208, 204], // #B7D0CC sage mist
  [199, 177, 202], // #C7B1CA blush lavender
  [140, 100, 142], // #8C648E deep mauve
  [165, 194, 189], // #A5C2BD warm sage
];

const INDIA_RGB: [number, number, number] = [241, 227, 196]; // #F1E3C4 warm Katha sand

type RingCoords = [number, number][];

interface PreparedCountry {
  id: string;
  rgb: [number, number, number];
  isIndia: boolean;
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
  rings: RingCoords[];
}

interface HexTile {
  x: number;
  y: number;
  z: number;
  // 6 tangent hexagon corner unit-offset vectors precomputed in 3D
  corners: Array<[number, number, number]>;
  rgb: [number, number, number];
  isIndia: boolean;
}

function latLngToUnit3D(lat: number, lng: number): [number, number, number] {
  const latR = lat * DEG2RAD;
  const lngR = lng * DEG2RAD;
  const cosLat = Math.cos(latR);
  return [
    cosLat * Math.sin(lngR),
    Math.sin(latR),
    cosLat * Math.cos(lngR),
  ];
}

function getCountryRgb(idStr: string): [number, number, number] {
  if (idStr === '356') {
    return INDIA_RGB;
  }
  let hash = 0;
  for (let i = 0; i < idStr.length; i += 1) {
    hash = (hash * 31 + idStr.charCodeAt(i)) | 0;
  }
  return HEX_PALETTE_RGB[Math.abs(hash) % HEX_PALETTE_RGB.length];
}

function pointInRing(lng: number, lat: number, ring: RingCoords): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    if (Math.abs(xi - xj) > 180) continue;

    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function prepareCountries(
  features: Array<{
    id?: string | number;
    geometry?: {
      type?: string;
      coordinates?: unknown;
    } | null;
  }>,
): PreparedCountry[] {
  const prepared: PreparedCountry[] = [];

  for (const feat of features) {
    if (!feat.geometry || !feat.geometry.coordinates) continue;
    const idStr = String(feat.id ?? '');
    const polygons: RingCoords[][] =
      feat.geometry.type === 'Polygon'
        ? [feat.geometry.coordinates as RingCoords[]]
        : feat.geometry.type === 'MultiPolygon'
          ? (feat.geometry.coordinates as RingCoords[][])
          : [];

    const outerRings: RingCoords[] = [];
    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const poly of polygons) {
      const outer = poly[0];
      if (!outer || outer.length < 3) continue;
      outerRings.push(outer);
      for (const [lng, lat] of outer) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }

    if (outerRings.length > 0) {
      prepared.push({
        id: idStr,
        rgb: getCountryRgb(idStr),
        isIndia: idStr === '356',
        minLng,
        maxLng,
        minLat,
        maxLat,
        rings: outerRings,
      });
    }
  }

  return prepared;
}

function findCountryForPoint(
  lng: number,
  lat: number,
  countries: PreparedCountry[],
): PreparedCountry | null {
  for (let i = 0; i < countries.length; i += 1) {
    const c = countries[i];
    if (
      lat < c.minLat ||
      lat > c.maxLat ||
      lng < c.minLng ||
      lng > c.maxLng
    ) {
      continue;
    }
    for (let r = 0; r < c.rings.length; r += 1) {
      if (pointInRing(lng, lat, c.rings[r])) {
        return c;
      }
    }
  }
  return null;
}

function buildHexTiles(countries: PreparedCountry[]): HexTile[] {
  const SAMPLES = 3800;
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const HEX_RADIUS = 0.0225;
  const tiles: HexTile[] = [];

  for (let i = 0; i < SAMPLES; i += 1) {
    const y = 1 - (i / (SAMPLES - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const lat = Math.asin(y) * RAD2DEG;
    const lng = Math.atan2(x, z) * RAD2DEG;

    const matched = findCountryForPoint(lng, lat, countries);
    if (!matched) continue;

    // Build orthonormal tangent basis (u, v) on the sphere surface at (x, y, z)
    const refX = Math.abs(y) > 0.9 ? 1 : 0;
    const refY = Math.abs(y) > 0.9 ? 0 : 1;
    const refZ = 0;

    // u = normalize(ref x n)
    let ux = refY * z - refZ * y;
    let uy = refZ * x - refX * z;
    let uz = refX * y - refY * x;
    const uLen = Math.hypot(ux, uy, uz) || 1;
    ux /= uLen;
    uy /= uLen;
    uz /= uLen;

    // v = n x u
    const vx = y * uz - z * uy;
    const vy = z * ux - x * uz;
    const vz = x * uy - y * ux;

    const lift = matched.isIndia ? 1.016 : 1.007;
    const tileRadius = matched.isIndia ? HEX_RADIUS * 1.04 : HEX_RADIUS;
    const corners: Array<[number, number, number]> = [];

    for (let k = 0; k < 6; k += 1) {
      const a = (k * Math.PI) / 3;
      const ca = Math.cos(a) * tileRadius;
      const sa = Math.sin(a) * tileRadius;
      corners.push([
        x * lift + ux * ca + vx * sa,
        y * lift + uy * ca + vy * sa,
        z * lift + uz * ca + vz * sa,
      ]);
    }

    tiles.push({
      x: x * lift,
      y: y * lift,
      z: z * lift,
      corners,
      rgb: matched.rgb,
      isIndia: matched.isIndia,
    });
  }

  return tiles;
}

function rotatePoint(
  px: number,
  py: number,
  pz: number,
  cosY: number,
  sinY: number,
  cosX: number,
  sinX: number,
): [number, number, number] {
  // Rotate around Y (longitude) first, then around X (latitude tilt)
  const x1 = px * cosY - pz * sinY;
  const z1 = px * sinY + pz * cosY;
  const y2 = py * cosX - z1 * sinX;
  const z2 = py * sinX + z1 * cosX;
  return [x1, y2, z2];
}

interface GlobeViewState {
  yaw: number;
  pitch: number;
  zoom: number;
  targetYaw: number;
  targetPitch: number;
  targetZoom: number;
}

interface MapControllerBridgeProps {
  onMapReady: (map: google.maps.Map | null) => void;
}

function MapControllerBridge({ onMapReady }: MapControllerBridgeProps) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
    return () => onMapReady(null);
  }, [map, onMapReady]);

  return null;
}

interface KathaGlobeMapProps {
  initialApiKey?: string;
}

export default function KathaGlobeMap({
  initialApiKey = '',
}: KathaGlobeMapProps) {
  const [apiKey, setApiKey] = useState<string>(
    initialApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  );
  const [viewMode, setViewMode] = useState<'globe' | 'map'>('globe');
  const [globeReady, setGlobeReady] = useState(false);
  const [globeApproach, setGlobeApproach] = useState(0);

  const portalRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelRef = useRef<HTMLButtonElement | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const viewModeRef = useRef<'globe' | 'map'>('globe');
  const transitionLockUntilRef = useRef<number>(0);

  // Initial orientation faces Darbhanga / Katha Restaurant directly
  const defaultYaw = KATHA_COORDS.lng * DEG2RAD;
  const defaultPitch = KATHA_COORDS.lat * DEG2RAD;

  const globeStateRef = useRef<GlobeViewState>({
    yaw: defaultYaw,
    pitch: defaultPitch,
    zoom: GLOBE_DEFAULT_ZOOM,
    targetYaw: defaultYaw,
    targetPitch: defaultPitch,
    targetZoom: GLOBE_DEFAULT_ZOOM,
  });

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  // Resolve runtime Maps JS API key if not already provided at SSR/build time
  useEffect(() => {
    if (apiKey) return;
    let active = true;
    fetch('/api/maps-config', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { apiKey?: string } | null) => {
        if (active && data?.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(() => {
        // Silent fallback if endpoint unavailable
      });
    return () => {
      active = false;
    };
  }, [apiKey]);

  const enterMapMode = useCallback(() => {
    const now = Date.now();
    if (viewModeRef.current === 'map' || now < transitionLockUntilRef.current) {
      return;
    }
    transitionLockUntilRef.current = now + 780;
    viewModeRef.current = 'map';
    setGlobeApproach(1);
    setViewMode('map');

    const st = globeStateRef.current;
    st.targetYaw = defaultYaw;
    st.targetPitch = defaultPitch;
    st.targetZoom = 2.45;

    const gMap = googleMapRef.current;
    if (gMap) {
      gMap.setCenter(KATHA_COORDS);
      gMap.setZoom(MAP_DEFAULT_ZOOM);
    }
  }, [defaultPitch, defaultYaw]);

  const exitMapMode = useCallback(() => {
    const now = Date.now();
    if (
      viewModeRef.current === 'globe' ||
      now < transitionLockUntilRef.current
    ) {
      return;
    }
    transitionLockUntilRef.current = now + 820;
    viewModeRef.current = 'globe';
    setGlobeApproach(0);
    setViewMode('globe');

    const st = globeStateRef.current;
    st.yaw = defaultYaw;
    st.pitch = defaultPitch;
    st.zoom = 1.52;
    st.targetYaw = defaultYaw;
    st.targetPitch = defaultPitch;
    st.targetZoom = GLOBE_DEFAULT_ZOOM;

    window.setTimeout(() => {
      if (googleMapRef.current && viewModeRef.current === 'globe') {
        googleMapRef.current.setCenter(KATHA_COORDS);
        googleMapRef.current.setZoom(MAP_DEFAULT_ZOOM);
      }
    }, 560);
  }, [defaultPitch, defaultYaw]);

  // Render interactive 3D Hexed-Polygon Globe on high-DPI 2D canvas (60 FPS, zero WebGL failures)
  useEffect(() => {
    const canvas = canvasRef.current;
    const portal = portalRef.current;
    if (!canvas || !portal) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let rafId = 0;
    let tiles: HexTile[] = [];
    let cssSize = Math.max(
      260,
      Math.round(portal.getBoundingClientRect().width || 440),
    );
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const kathaUnit = latLngToUnit3D(KATHA_COORDS.lat, KATHA_COORDS.lng);

    const syncCanvasSize = (nextSize: number) => {
      cssSize = Math.max(240, Math.round(nextSize));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssSize * dpr);
      canvas.height = Math.round(cssSize * dpr);
    };

    syncCanvasSize(cssSize);

    // Load local world countries TopoJSON and precompute 3D hexed-polygon tiles
    Promise.all([
      import('topojson-client'),
      fetch('/data/countries-110m.json').then((r) => r.json()),
    ])
      .then(([topojsonModule, topology]) => {
        if (disposed) return;
        const typedTopo = topology as Parameters<
          typeof topojsonModule.feature
        >[0] & {
          objects: {
            countries: Parameters<typeof topojsonModule.feature>[1];
          };
        };
        const geo = topojsonModule.feature(
          typedTopo,
          typedTopo.objects.countries,
        );
        const rawFeatures = 'features' in geo ? geo.features : [];
        const countries = prepareCountries(rawFeatures);
        tiles = buildHexTiles(countries);
        if (!disposed) {
          setGlobeReady(true);
        }
      })
      .catch(() => {
        if (!disposed) setGlobeReady(true);
      });

    // Pointer drag & pinch-zoom interaction handlers
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const activePointers = new globalThis.Map<
      number,
      { x: number; y: number }
    >();
    let lastPinchDist = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (viewModeRef.current !== 'globe') return;
      canvas.setPointerCapture(e.pointerId);
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size === 1) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      } else if (activePointers.size === 2) {
        dragging = false;
        const pts = Array.from(activePointers.values());
        lastPinchDist = Math.hypot(
          pts[0].x - pts[1].x,
          pts[0].y - pts[1].y,
        );
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (viewModeRef.current !== 'globe') return;
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (lastPinchDist > 0) {
          const factor = dist / lastPinchDist;
          const st = globeStateRef.current;
          st.targetZoom = Math.min(
            2.3,
            Math.max(GLOBE_MIN_ZOOM, st.targetZoom * factor),
          );
        }
        lastPinchDist = dist;
        return;
      }

      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const st = globeStateRef.current;
      const sensitivity = 0.0065 / Math.max(0.8, st.zoom);
      st.targetYaw -= dx * sensitivity;
      st.targetPitch = Math.max(
        -1.25,
        Math.min(1.25, st.targetPitch + dy * sensitivity),
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        lastPinchDist = 0;
      }
      if (activePointers.size === 0) {
        dragging = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (viewModeRef.current !== 'globe') return;
      e.preventDefault();
      const st = globeStateRef.current;
      const zoomDelta = -e.deltaY * 0.0014;
      st.targetZoom = Math.min(
        2.3,
        Math.max(GLOBE_MIN_ZOOM, st.targetZoom + zoomDelta),
      );
      // Gently steer toward Katha Restaurant as the guest zooms in
      if (zoomDelta > 0 && st.targetZoom > 1.25) {
        st.targetYaw += (defaultYaw - st.targetYaw) * 0.14;
        st.targetPitch += (defaultPitch - st.targetPitch) * 0.14;
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      const entry = entries[0];
      if (!entry) return;
      syncCanvasSize(entry.contentRect.width);
    });
    resizeObserver.observe(portal);

    let lastReportedApproach = -1;

    const renderFrame = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(renderFrame);

      const st = globeStateRef.current;
      // Smooth spring damping
      st.yaw += (st.targetYaw - st.yaw) * 0.12;
      st.pitch += (st.targetPitch - st.pitch) * 0.12;
      st.zoom += (st.targetZoom - st.zoom) * 0.12;

      // Check seamless zoom transition from Globe -> Google Maps
      if (
        viewModeRef.current === 'globe' &&
        Date.now() >= transitionLockUntilRef.current
      ) {
        const approach = Math.min(
          1,
          Math.max(
            0,
            (st.zoom - GLOBE_APPROACH_START_ZOOM) /
              (GLOBE_ENTER_MAP_ZOOM - GLOBE_APPROACH_START_ZOOM),
          ),
        );
        if (Math.abs(approach - lastReportedApproach) > 0.04) {
          lastReportedApproach = approach;
          setGlobeApproach(approach);
        }
        if (st.zoom >= GLOBE_ENTER_MAP_ZOOM) {
          enterMapMode();
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssSize, cssSize);

      const cx = cssSize * 0.5;
      const cy = cssSize * 0.5;
      const R = cssSize * 0.365 * st.zoom;

      // 1. Soft mauve atmospheric aura around the 3D sphere
      const atmoGrad = ctx.createRadialGradient(
        cx,
        cy,
        R * 0.88,
        cx,
        cy,
        R * 1.18,
      );
      atmoGrad.addColorStop(0, 'rgba(175, 142, 177, 0.34)');
      atmoGrad.addColorStop(0.55, 'rgba(175, 142, 177, 0.14)');
      atmoGrad.addColorStop(1, 'rgba(175, 142, 177, 0)');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // 2. Deep plum-velvet ocean sphere with soft directional lighting
      const sphereGrad = ctx.createRadialGradient(
        cx - R * 0.3,
        cy - R * 0.32,
        R * 0.1,
        cx,
        cy,
        R,
      );
      sphereGrad.addColorStop(0, '#553858');
      sphereGrad.addColorStop(0.55, '#342037');
      sphereGrad.addColorStop(1, '#1E1120');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // 3. Crisp 3D-foreshortened Hexed Polygons across visible hemisphere
      const cosY = Math.cos(st.yaw);
      const sinY = Math.sin(st.yaw);
      const cosX = Math.cos(st.pitch);
      const sinX = Math.sin(st.pitch);

      // Normalized light direction (upper-left key light)
      const lx = -0.35;
      const ly = 0.4;
      const lz = 0.84;

      for (let i = 0; i < tiles.length; i += 1) {
        const tile = tiles[i];
        const [rx, ry, rz] = rotatePoint(
          tile.x,
          tile.y,
          tile.z,
          cosY,
          sinY,
          cosX,
          sinX,
        );
        if (rz < 0.02) continue;

        // Soft Lambertian lighting + horizon rim falloff
        const ndl = Math.max(0, rx * lx + ry * ly + rz * lz);
        const shade = tile.isIndia
          ? 0.72 + ndl * 0.34
          : 0.56 + ndl * 0.48;
        const alpha = Math.min(1, rz * 3.2);

        const cr = Math.min(255, Math.round(tile.rgb[0] * shade));
        const cg = Math.min(255, Math.round(tile.rgb[1] * shade));
        const cb = Math.min(255, Math.round(tile.rgb[2] * shade));

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(2)})`;
        ctx.beginPath();

        for (let k = 0; k < 6; k += 1) {
          const c = tile.corners[k];
          const [cx3, cy3] = rotatePoint(
            c[0],
            c[1],
            c[2],
            cosY,
            sinY,
            cosX,
            sinX,
          );
          const sx = cx + cx3 * R;
          const sy = cy - cy3 * R;
          if (k === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.closePath();
        ctx.fill();
      }

      // Subtle inner specular highlight rim on the globe edge
      ctx.strokeStyle = 'rgba(241, 227, 196, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Permanent small red location pin + expanding pulse + boxless text label
      const [kx, ky, kz] = rotatePoint(
        kathaUnit[0] * 1.022,
        kathaUnit[1] * 1.022,
        kathaUnit[2] * 1.022,
        cosY,
        sinY,
        cosX,
        sinX,
      );

      const labelEl = labelRef.current;
      if (kz > 0.05) {
        const mx = cx + kx * R;
        const my = cy - ky * R;
        const vis = Math.min(1, (kz - 0.05) / 0.2);

        // Expanding soft red pulse ring anchored at pin tip (mx, my)
        const ringPhase = (now % 2400) / 2400;
        const ringRad = 3 + ringPhase * 15;
        ctx.strokeStyle = `rgba(239, 68, 68, ${((1 - ringPhase) * 0.72 * vis).toFixed(2)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(mx, my, ringRad, 0, Math.PI * 2);
        ctx.stroke();

        // Crisp small classic red teardrop location pin pointing down onto (mx, my)
        const pinHeadY = my - 9.5;
        const pinHeadR = 4.5;
        ctx.save();
        ctx.globalAlpha = vis;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1.5;

        ctx.fillStyle = '#EF4444';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.bezierCurveTo(
          mx - 2.4,
          my - 3.6,
          mx - pinHeadR,
          pinHeadY + 1.4,
          mx - pinHeadR,
          pinHeadY,
        );
        ctx.arc(mx, pinHeadY, pinHeadR, Math.PI, 0, false);
        ctx.bezierCurveTo(
          mx + pinHeadR,
          pinHeadY + 1.4,
          mx + 2.4,
          my - 3.6,
          mx,
          my,
        );
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Clean white center dot inside red pin head
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(mx, pinHeadY, 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (labelEl) {
          labelEl.style.transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0) translate(9px, -11px)`;
          labelEl.style.opacity = vis.toFixed(2);
          labelEl.style.pointerEvents = vis > 0.3 ? 'auto' : 'none';
        }
      } else if (labelEl) {
        labelEl.style.opacity = '0';
        labelEl.style.pointerEvents = 'none';
      }

      ctx.restore();
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [defaultPitch, defaultYaw, enterMapMode]);

  const handleMapReady = useCallback((map: google.maps.Map | null) => {
    googleMapRef.current = map;
  }, []);

  const handleMapCameraChanged = useCallback(
    (event: MapCameraChangedEvent) => {
      if (viewModeRef.current !== 'map') return;
      if (Date.now() < transitionLockUntilRef.current) return;

      const zoom = event.detail.zoom;
      if (typeof zoom === 'number' && zoom <= MAP_EXIT_TO_GLOBE_ZOOM) {
        exitMapMode();
      }
    },
    [exitMapMode],
  );

  const handleZoomIn = useCallback(() => {
    if (viewModeRef.current === 'globe') {
      const st = globeStateRef.current;
      st.targetYaw = defaultYaw;
      st.targetPitch = defaultPitch;
      const nextZoom = st.targetZoom * 1.32;
      if (nextZoom >= GLOBE_ENTER_MAP_ZOOM - 0.08) {
        enterMapMode();
      } else {
        st.targetZoom = nextZoom;
      }
    } else {
      const gMap = googleMapRef.current;
      if (gMap) {
        const currentZoom = gMap.getZoom() ?? MAP_DEFAULT_ZOOM;
        gMap.setZoom(Math.min(20, currentZoom + 1));
      }
    }
  }, [defaultPitch, defaultYaw, enterMapMode]);

  const handleZoomOut = useCallback(() => {
    if (viewModeRef.current === 'map') {
      const gMap = googleMapRef.current;
      if (!gMap) {
        exitMapMode();
        return;
      }
      const currentZoom = gMap.getZoom() ?? MAP_DEFAULT_ZOOM;
      const nextZoom = currentZoom - 2;
      if (nextZoom <= MAP_EXIT_TO_GLOBE_ZOOM + 0.6) {
        exitMapMode();
      } else {
        gMap.setZoom(nextZoom);
      }
    } else {
      const st = globeStateRef.current;
      st.targetZoom = Math.max(GLOBE_MIN_ZOOM, st.targetZoom * 0.78);
    }
  }, [exitMapMode]);

  const handleRecenter = useCallback(() => {
    if (viewModeRef.current === 'globe') {
      const st = globeStateRef.current;
      st.targetYaw = defaultYaw;
      st.targetPitch = defaultPitch;
      st.targetZoom = GLOBE_DEFAULT_ZOOM;
    } else {
      const gMap = googleMapRef.current;
      if (gMap) {
        gMap.panTo(KATHA_COORDS);
        gMap.setZoom(MAP_DEFAULT_ZOOM);
      }
    }
  }, [defaultPitch, defaultYaw]);

  const globeOpacity =
    viewMode === 'map' ? 0 : Math.max(0.28, 1 - globeApproach * 0.55);
  const globeScale = viewMode === 'map' ? 1.18 : 1 + globeApproach * 0.1;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Circular Round Faded Invisible-Border Portal shared by Globe & Google Maps */}
      <div className="relative mx-auto w-full max-w-[275px] sm:max-w-[400px] lg:max-w-[440px] aspect-square">
        {/* Soft ambient plum/mauve halo behind the circular globe inside darker box */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-full bg-radial from-[#774D78]/36 via-[#AF8EB1]/14 to-transparent blur-2xl"
        />

        <div
          ref={portalRef}
          className="circular-faded-portal relative w-full h-full rounded-full overflow-hidden select-none"
        >
          {/* Live Circular Google Map Layer (pre-mounted underneath for seamless zero-flash transition) */}
          <motion.div
            initial={false}
            animate={{
              opacity: viewMode === 'map' ? 1 : 0,
              scale: viewMode === 'map' ? 1 : 0.9,
            }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 w-full h-full ${
              viewMode === 'map'
                ? 'pointer-events-auto z-20'
                : 'pointer-events-none z-10'
            }`}
          >
            {apiKey ? (
              <APIProvider apiKey={apiKey} language="en" region="IN">
                <div className="w-full h-full">
                  <GoogleMap
                    mapId="DEMO_MAP_ID"
                    defaultCenter={KATHA_COORDS}
                    defaultZoom={MAP_DEFAULT_ZOOM}
                    minZoom={10}
                    maxZoom={20}
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                    clickableIcons={true}
                    onCameraChanged={handleMapCameraChanged}
                    internalUsageAttributionIds={[
                      'gmp_mcp_codeassist_v1_aistudio',
                    ]}
                    className="w-full h-full"
                  >
                    <MapControllerBridge onMapReady={handleMapReady} />
                    <AdvancedMarker
                      position={KATHA_COORDS}
                      title="Katha Restaurant — Inside Bhupa Greens, Darbhanga"
                      onClick={() => {
                        googleMapRef.current?.panTo(KATHA_COORDS);
                        googleMapRef.current?.setZoom(17);
                      }}
                    >
                      <div className="flex items-center gap-1 cursor-pointer -translate-y-1">
                        <MapPin
                          className="h-5 w-5 fill-[#EF4444] text-white stroke-[1.75] drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] shrink-0"
                          aria-hidden="true"
                        />
                        <span className="katha-map-label-shadow font-serif text-sm font-bold tracking-wide text-[#2A1C2B] whitespace-nowrap leading-none">
                          Katha Restaurant
                        </span>
                      </div>
                    </AdvancedMarker>
                  </GoogleMap>
                </div>
              </APIProvider>
            ) : (
              <iframe
                title="Katha by Bhupa Greens - Google Maps"
                src="https://maps.google.com/maps?q=26.1796778,85.8486927+(Katha+by+Bhupa+Greens)&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </motion.div>

          {/* 3D Hexed-Polygon Globe Layer (fades circularly out on zoom-in, back in on zoom-out) */}
          <motion.div
            initial={false}
            animate={{
              opacity: globeOpacity,
              scale: globeScale,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 w-full h-full ${
              viewMode === 'globe'
                ? 'pointer-events-auto z-20 cursor-grab active:cursor-grabbing'
                : 'pointer-events-none z-10'
            }`}
          >
            <canvas
              ref={canvasRef}
              aria-label="Interactive 3D hexed-polygon globe centered on Katha Restaurant in Darbhanga"
              className="w-full h-full touch-none block"
            />

            {/* Permanent Boxless "Katha Restaurant" Text Label Anchored to Exact 3D Coordinates */}
            <button
              ref={labelRef}
              type="button"
              onClick={enterMapMode}
              aria-label="Zoom into Katha Restaurant on Google Maps"
              className="katha-globe-label-shadow absolute top-0 left-0 z-30 bg-transparent border-0 p-0 text-[#FBF7EE] font-serif text-[14px] sm:text-[15px] font-semibold tracking-wide whitespace-nowrap leading-none cursor-pointer opacity-0 transition-opacity duration-150"
            >
              Katha Restaurant
            </button>

            {!globeReady && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-44 w-44 rounded-full bg-[#301F32]/20 animate-pulse" />
              </div>
            )}
          </motion.div>

          {/* Subtle Circular Dark-Box-Matched Invisible-Edge Veil */}
          <div
            aria-hidden="true"
            className="circular-faded-veil-dark pointer-events-none absolute inset-0 z-30 rounded-full"
          />
        </div>
      </div>

      {/* Tactile Dark-Themed Mode & Zoom Controls Below the Circle */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <div
          role="group"
          aria-label="Switch between 3D Globe and Google Map"
          className="inline-flex items-center rounded-full border border-[#AF8EB1]/25 bg-white/[0.08] p-1 gap-1 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={exitMapMode}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === 'globe'
                ? 'bg-[#774D78] text-white shadow-sm ring-1 ring-[#F1E3C4]/30'
                : 'text-[#D8C8D9] hover:text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            3D Globe
          </button>
          <button
            type="button"
            onClick={enterMapMode}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-[#774D78] text-white shadow-sm ring-1 ring-[#F1E3C4]/30'
                : 'text-[#D8C8D9] hover:text-white'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Google Map
          </button>
        </div>

        <div className="inline-flex items-center rounded-full border border-[#AF8EB1]/25 bg-white/[0.08] p-1 gap-0.5 backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#FBF7EE] hover:bg-white/15 hover:text-[#F1E3C4]"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#FBF7EE] hover:bg-white/15 hover:text-[#F1E3C4]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Center on Katha Restaurant"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#FBF7EE] hover:bg-white/15 hover:text-[#F1E3C4]"
          >
            <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#D8C8D9]/85 max-w-sm px-4">
        {viewMode === 'globe'
          ? 'Drag to spin the globe, or zoom in on Katha Restaurant to step straight into Google Maps.'
          : 'Explore Bhupa Greens on live Google Maps — zoom back out anytime to return to the globe.'}
      </p>
    </div>
  );
}
