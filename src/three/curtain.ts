import {
  Color,
  Mesh,
  NoBlending,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

/**
 * Procedural silk curtain — two drapes rendered analytically in a single fragment shader.
 * No geometry simulation, no textures: one full-screen quad → runs at 60fps on mid-range phones.
 *
 *  - uOpen  (0 → 1) parts the drapes into a classic tie-back silhouette; folds compress naturally
 *  - uMouse  pushes a travelling ripple through the fabric
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpen;
  uniform float uAspect;
  uniform float uFolds;
  uniform float uPush;
  uniform float uPx;
  uniform vec2  uMouse;
  uniform vec3  uDeep;
  uniform vec3  uMid;
  uniform vec3  uLight;

  #define TAU 6.28318530718

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(float x) {
    float i = floor(x); float f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
  }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise2(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 w = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), w.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), w.x), w.y);
  }
  float grain(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
  vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

  const float TIE = 0.40;

  // panel half-width (in screen uv) at height y for the current opening (motion unchanged)
  float panelWidth(float y, float open) {
    float above = smoothstep(TIE, 1.0, y);
    float below = smoothstep(TIE, 0.0, y);
    float wOpen = 0.05 + 0.085 * pow(above, 0.85) + 0.07 * below;
    float e = open * open * (3.0 - 2.0 * open);
    return mix(0.505, wOpen, e);
  }

  // fabric geometry. x is panel-local (0 = outer edge). Returns (height, depth, u, width)
  vec4 fabric(float x, float y, float side) {
    float W = panelWidth(y, uOpen);

    // mouse ripple (aspect-correct) (interaction unchanged)
    vec2 p = vec2((side < 0.5 ? x : 1.0 - x) * uAspect, y);
    vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
    float d = distance(p, m);
    float ripple = uPush * exp(-d * d * 9.0) * sin(d * 22.0 - uTime * 7.0);

    // silhouette: the leading edge sways and turns with the folds it carries
    float sway = 0.006 * sin(y * 9.0 + uTime * 0.9 + side * 2.0) * (1.0 - uOpen * 0.6);
    float edgeTurn = 0.006 * (noise(y * 5.0 + side * 9.0) - 0.5) * (1.0 + uOpen);
    float Wv = W + sway + edgeTurn + ripple * 0.012;
    float u = clamp(x / Wv, 0.0, 1.0);

    // gravity: the pleated header keeps folds regular at the top, they turn organic towards the hem
    float organic = mix(1.0, 0.3, smoothstep(0.8, 1.0, y));
    float warp = organic * (0.55 * noise(u * 3.0 + side * 13.0 + y * 0.45)
               + 0.28 * noise(u * 7.0 + side * 5.0 - y * 0.9)
               + 0.12 * noise(u * 15.0 + side * 3.0 + y * 1.7) - 0.47);
    float breathe = 0.035 * sin(uTime * 0.55 + y * 2.4 + side * 1.7);
    // gathered cloth collapses into fewer, deeper tubes
    float gather = smoothstep(0.0, 1.0, uOpen);
    float folds = uFolds * mix(1.0, 0.5, gather);
    float phi = u * folds + warp * 1.5 + breathe + ripple * 0.35;

    // fold profile: broad rounded ridges, narrow deep valleys, unequal neighbours
    float s = 0.5 + 0.5 * sin(TAU * phi);
    float prof = 1.0 - pow(1.0 - s, 1.35);
    prof = mix(prof, 0.5 + 0.5 * sin(TAU * phi * 0.5 + 1.3), 0.25);

    // depth from fabric fullness: the same cloth squeezed into less width folds deeper
    float sp = Wv * uAspect / folds;
    float lf = 2.1 * 0.505 * uAspect / folds;
    float depth = 0.24 * sqrt(max(lf * lf - sp * sp, 1e-5));
    depth *= 0.6 + 0.75 * noise(phi * 0.9 + side * 7.0);         // every fold falls a little differently
    depth *= mix(1.0, 0.75, smoothstep(0.84, 1.0, y));          // pinched header
    depth *= mix(1.0, 0.45, smoothstep(0.965, 1.0, u));          // flat double hem on the leading edge
    depth *= 1.0 - 0.35 * uOpen * exp(-pow((y - TIE) / 0.045, 2.0)); // cinch at the tie-back

    // anti-alias: fade relief when folds get thinner than a few pixels
    float fw = fwidth(phi);
    depth *= mix(0.3, 1.0, 1.0 - smoothstep(0.18, 0.55, fw));

    return vec4(depth * prof, depth, u, Wv);
  }

  vec4 drape(float x, float y, float side, float screenX) {
    vec4 f = fabric(x, y, side);
    float e = uPx * 1.25;
    float ey = e * uAspect;
    float hx = fabric(x + e, y, side).x;
    float hy = fabric(x, y + ey, side).x;

    // normal from the height field (aspect units)
    float dX = (hx - f.x) / (e * uAspect);
    float dY = (hy - f.x) / ey;
    if (side > 0.5) dX = -dX;
    vec3 N = normalize(vec3(-dX, -dY, 1.0));
    vec3 V = vec3(0.0, 0.0, 1.0);

    float h01 = f.x / max(f.y, 1e-5);
    float u = f.z;

    // albedo: dyed silk with slubs and a faint vertical warp
    vec3 base = toLinear(uMid);
    vec3 deep = toLinear(uDeep);
    float slub = noise2(vec2(u * uFolds * 6.0 + side * 40.0, y * 1.2));
    float warpThread = noise2(vec2(u * uFolds * 90.0 + side * 17.0, y * 60.0));
    vec3 albedo = base * (0.95 + 0.08 * slub + 0.03 * warpThread);
    albedo = mix(deep * 1.7, albedo, 0.55 + 0.45 * h01);

    // light: soft key from an upper-left window, fill from the right
    vec3 Lk = normalize(vec3(-0.5, 0.45, 0.75));
    vec3 Lf = normalize(vec3(0.65, 0.05, 0.75));
    float wrap = 0.3;
    float key = max((dot(N, Lk) + wrap) / (1.0 + wrap), 0.0);
    float fill = max((dot(N, Lf) + wrap) / (1.0 + wrap), 0.0);

    // anisotropic satin highlight: vertical threads give long vertical streaks on the ridges
    vec3 H = normalize(Lk + V);
    vec2 nxz = normalize(vec2(N.x, N.z));
    vec2 hxz = normalize(vec2(H.x, H.z));
    float ndh = max(dot(nxz, hxz), 0.0);
    float satin = pow(ndh, 22.0) * 0.42 + pow(ndh, 6.0) * 0.14;
    satin *= 0.75 + 0.5 * noise2(vec2(u * uFolds * 3.0 + side * 11.0, y * 2.5)); // sheen breaks up along the drop

    // grazing sheen on the turning flanks
    float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 3.0);

    // cavity occlusion + extra shade in the tie-back cinch
    float ao = mix(0.22, 1.0, smoothstep(0.0, 0.9, h01));
    ao *= 1.0 - 0.3 * uOpen * exp(-pow((y - TIE) / 0.06, 2.0));

    // light through the cloth: brighter where it faces you, darker where layers stack
    float thick = 1.0 / max(N.z, 0.12);
    float trans = exp(-thick * 1.4);

    // light field: falls off under the rod, pools mid-height, softer near the floor
    float vert = mix(0.5, 1.0, smoothstep(0.0, 0.62, y)) * (1.0 - 0.5 * smoothstep(0.86, 1.0, y));
    float pool = 1.3 - 0.75 * length(vec2((screenX - 0.42) * uAspect * 0.55, (y - 0.66) * 1.1));
    float light = vert * max(pool, 0.38);

    vec3 sheenCol = toLinear(uLight);
    vec3 col = albedo * (key * 1.05 + fill * 0.22 + 0.035) * ao;
    col += albedo * sheenCol * trans * 0.22 * ao;
    col += sheenCol * satin * 0.32 * mix(0.3, 1.0, ao);
    col += sheenCol * rim * 0.05 * ao;
    col *= light;

    // leading-edge hem: a sewn seam line and the edge's own shadow
    float seam = smoothstep(0.955, 0.962, u) * (1.0 - smoothstep(0.962, 0.97, u));
    col *= 1.0 - 0.18 * seam;
    col *= 1.0 - 0.25 * smoothstep(0.992, 1.0, u);

    col = mix(col, vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), 0.1);
    col = aces(col * 0.8);
    col = pow(col, vec3(1.0 / 2.2));

    float aa = uPx * 1.5;
    float alpha = 1.0 - smoothstep(f.w - aa, f.w + aa, x);
    return vec4(col, alpha);
  }

  void main() {
    float x = vUv.x;
    float y = vUv.y;
    vec4 L = drape(x, y, 0.0, x);
    vec4 R = drape(1.0 - x, y, 1.0, x);

    // right drape sits over the left one where they overlap at the centre
    vec3 col = mix(L.rgb, R.rgb, R.a);
    float a = max(L.a, R.a);

    // soft shadow cast onto the room behind, beside each leading edge (stronger up high)
    float wl = panelWidth(y, uOpen);
    float sl = exp(-max(x - wl, 0.0) / 0.035) * (1.0 - L.a);
    float sr = exp(-max((1.0 - x) - wl, 0.0) / 0.035) * (1.0 - R.a);
    float shadow = max(sl, sr) * 0.32 * uOpen * mix(0.7, 1.0, y);

    col += (grain(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.025;
    gl_FragColor = vec4(col * a, max(a, shadow));
  }
`

export type CurtainScene = {
  setOpen: (v: number) => void
  setPointer: (x: number, y: number) => void
  start: () => void
  stop: () => void
  resize: () => void
  dispose: () => void
}

export function createCurtain(canvas: HTMLCanvasElement): CurtainScene | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance', premultipliedAlpha: true })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const uniforms = {
    uTime: { value: 0 },
    uOpen: { value: 0 },
    uAspect: { value: 1 },
    uFolds: { value: 9 },
    uPush: { value: 0 },
    uPx: { value: 0.001 },
    uMouse: { value: new Vector2(0.5, 0.5) },
    uDeep: { value: new Color('#3e1d10') },
    uMid: { value: new Color('#a85f38') },
    uLight: { value: new Color('#f6cfa8') },
  }
  // Color() stores linear values; this raw shader writes straight to an sRGB canvas, so convert back
  ;(['uDeep', 'uMid', 'uLight'] as const).forEach((k) => uniforms[k].value.convertLinearToSRGB())

  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, blending: NoBlending, depthTest: false })
  const mesh = new Mesh(new PlaneGeometry(2, 2), material)
  scene.add(mesh)

  let raf = 0
  let running = false
  let last = performance.now()
  const target = { open: 0, mx: 0.5, my: 0.5 }
  let push = 0

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 ? 1.5 : 1.75))
    renderer.setSize(w, h, false)
    uniforms.uAspect.value = w / h
    uniforms.uPx.value = 1 / w
    uniforms.uFolds.value = w < 768 ? 6.5 : 10
  }

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    uniforms.uTime.value += dt
    uniforms.uOpen.value += (target.open - uniforms.uOpen.value) * Math.min(1, dt * 7)
    const m = uniforms.uMouse.value
    m.x += (target.mx - m.x) * Math.min(1, dt * 5)
    m.y += (target.my - m.y) * Math.min(1, dt * 5)
    push *= Math.pow(0.12, dt)
    uniforms.uPush.value = push
    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(tick)
  }

  resize()

  return {
    setOpen: (v) => {
      target.open = v
    },
    setPointer: (x, y) => {
      const dx = x - target.mx
      const dy = y - target.my
      push = Math.min(1, push + Math.hypot(dx, dy) * 6)
      target.mx = x
      target.my = y
    },
    start: () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    },
    stop: () => {
      running = false
      cancelAnimationFrame(raf)
    },
    resize,
    dispose: () => {
      running = false
      cancelAnimationFrame(raf)
      material.dispose()
      mesh.geometry.dispose()
      renderer.dispose()
    },
  }
}
