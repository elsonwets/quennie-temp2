import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  WebGLRenderer,
  MathUtils,
  Path,
} from 'three'

/**
 * "O projeto ganha vida em 3D" — a living room that assembles itself with scroll:
 *   0.00–0.25  floor plan (flat line drawing)
 *   0.25–0.50  walls & furniture extrude (wireframe)
 *   0.50–0.75  materials fade in
 *   0.75–1.00  warm light on, lamp glows, drapes breathe
 */

type Piece = {
  group: Group
  mats: MeshStandardMaterial[]
  lines: LineBasicMaterial
  order: number
}

const C = {
  floor: '#d8c6ae',
  wall: '#efe6da',
  wallSide: '#e6d9c7',
  sofa: '#2f4a3c',
  wood: '#8a5a3a',
  brass: '#c9a35b',
  terra: '#a85f38',
  linen: '#f3ebe0',
  rug: '#cdb79a',
  plant: '#4f6b48',
  line: '#7a3a1c',
}

export type RoomScene = {
  setProgress: (p: number) => void
  start: () => void
  stop: () => void
  resize: () => void
  dispose: () => void
}

export function createRoom(canvas: HTMLCanvasElement): RoomScene | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 100)
  const pivot = new Group()
  scene.add(pivot)

  // ── lights
  const hemi = new HemisphereLight('#fff4e6', '#7a5a44', 0.9)
  const ambient = new AmbientLight('#ffffff', 0.25)
  const sun = new DirectionalLight('#ffe2bf', 1.6)
  sun.position.set(-4, 6, 5)
  const lampLight = new PointLight('#ffb36b', 0, 6, 1.6)
  lampLight.position.set(2.05, 2.05, -0.9)
  scene.add(hemi, ambient, sun, lampLight)

  const pieces: Piece[] = []
  const disposables: Array<{ dispose: () => void }> = []

  const lineMat = () => {
    const m = new LineBasicMaterial({ color: C.line, transparent: true, opacity: 0 })
    disposables.push(m)
    return m
  }
  const stdMat = (color: string, extra: Partial<MeshStandardMaterial> = {}) => {
    const m = new MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, transparent: true, opacity: 0, ...extra })
    disposables.push(m)
    return m
  }

  /** Adds meshes + their edges to one animated piece. Pieces grow from y=0 (scale.y). */
  const piece = (order: number, parts: Array<[BufferGeometry, MeshStandardMaterial, [number, number, number], [number, number, number]?]>) => {
    const group = new Group()
    const lines = lineMat()
    const mats: MeshStandardMaterial[] = []
    for (const [geo, mat, pos, rot] of parts) {
      disposables.push(geo)
      const mesh = new Mesh(geo, mat)
      mesh.position.set(...pos)
      if (rot) mesh.rotation.set(...rot)
      const edges = new EdgesGeometry(geo, 28)
      disposables.push(edges)
      const seg = new LineSegments(edges, lines)
      seg.position.copy(mesh.position)
      seg.rotation.copy(mesh.rotation)
      group.add(mesh, seg)
      if (!mats.includes(mat)) mats.push(mat)
    }
    pivot.add(group)
    pieces.push({ group, mats, lines, order })
    return group
  }

  // ── architecture (room 6 × 5, origin at floor centre)
  piece(0, [[new BoxGeometry(6, 0.08, 5), stdMat(C.floor, { roughness: 0.7 }), [0, -0.04, 0]]])

  // back wall with an arched window (extruded shape with a hole)
  const wallShape = new Shape()
  wallShape.moveTo(-3, 0)
  wallShape.lineTo(3, 0)
  wallShape.lineTo(3, 3.2)
  wallShape.lineTo(-3, 3.2)
  wallShape.lineTo(-3, 0)
  const arch = new Path()
  const ax = -0.6
  arch.moveTo(ax - 0.75, 0.55)
  arch.lineTo(ax + 0.75, 0.55)
  arch.lineTo(ax + 0.75, 2.05)
  arch.absarc(ax, 2.05, 0.75, 0, Math.PI, false)
  arch.lineTo(ax - 0.75, 0.55)
  wallShape.holes.push(arch)
  const wallGeo = new ExtrudeGeometry(wallShape, { depth: 0.12, bevelEnabled: false, curveSegments: 24 })
  piece(1, [[wallGeo, stdMat(C.wall), [0, 0, -2.56]]])
  piece(1, [[new BoxGeometry(0.12, 3.2, 5), stdMat(C.wallSide), [-3.06, 1.6, 0]]])

  // drapes either side of the window — folded planes (vertex displacement once, at build time)
  const drapeGeo = (w: number, h: number) => {
    const g = new PlaneGeometry(w, h, 40, 1)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      pos.setZ(i, Math.sin((x / w) * Math.PI * 9) * 0.045)
    }
    g.computeVertexNormals()
    return g
  }
  const drapeMat = stdMat(C.terra, { side: DoubleSide, roughness: 0.6 })
  const drapes = piece(3, [
    [drapeGeo(0.55, 2.75), drapeMat, [ax - 1.12, 1.42, -2.42]],
    [drapeGeo(0.55, 2.75), drapeMat, [ax + 1.12, 1.42, -2.42]],
  ])
  piece(3, [[new CylinderGeometry(0.018, 0.018, 2.9, 8), stdMat(C.brass, { metalness: 0.8, roughness: 0.3 }), [ax, 2.84, -2.4], [0, 0, Math.PI / 2]]])

  // rug
  piece(2, [[new CylinderGeometry(1.45, 1.45, 0.02, 48), stdMat(C.rug, { roughness: 1 }), [0.35, 0.01, 0.35]]])

  // sofa (deep green, the TikTok signature)
  const sofaMat = stdMat(C.sofa, { roughness: 0.95 })
  piece(4, [
    [new BoxGeometry(2.4, 0.42, 0.95), sofaMat, [0.35, 0.21, -1.55]],
    [new BoxGeometry(2.4, 0.55, 0.22), sofaMat, [0.35, 0.62, -1.95]],
    [new BoxGeometry(0.22, 0.62, 0.95), sofaMat, [-0.96, 0.31, -1.55]],
    [new BoxGeometry(0.22, 0.62, 0.95), sofaMat, [1.66, 0.31, -1.55]],
  ])

  // armchair
  const chairMat = stdMat(C.terra, { roughness: 0.9 })
  piece(5, [
    [new BoxGeometry(0.85, 0.4, 0.85), chairMat, [-1.7, 0.2, 0.75]],
    [new BoxGeometry(0.85, 0.5, 0.18), chairMat, [-1.7, 0.6, 0.42], [0, 0, 0]],
  ])

  // round coffee table (brass base, wood top)
  piece(6, [
    [new CylinderGeometry(0.55, 0.55, 0.06, 40), stdMat(C.wood, { roughness: 0.5 }), [0.35, 0.42, 0.25]],
    [new CylinderGeometry(0.08, 0.16, 0.39, 16), stdMat(C.brass, { metalness: 0.85, roughness: 0.3 }), [0.35, 0.195, 0.25]],
  ])

  // low TV / sideboard on the left wall
  piece(5, [[new BoxGeometry(0.45, 0.5, 2.2), stdMat(C.wood, { roughness: 0.55 }), [-2.75, 0.25, -0.6]]])

  // floor lamp (glows at the end)
  const shadeMat = stdMat(C.linen, { emissive: new Color('#ffb36b'), emissiveIntensity: 0 })
  piece(7, [
    [new CylinderGeometry(0.02, 0.02, 1.9, 8), stdMat(C.brass, { metalness: 0.8, roughness: 0.3 }), [2.05, 0.95, -0.9]],
    [new CylinderGeometry(0.16, 0.26, 0.32, 24, 1, true), shadeMat, [2.05, 2.0, -0.9]],
    [new CylinderGeometry(0.2, 0.2, 0.03, 24), stdMat(C.brass, { metalness: 0.8, roughness: 0.3 }), [2.05, 0.015, -0.9]],
  ])

  // plant
  piece(7, [
    [new CylinderGeometry(0.2, 0.15, 0.4, 20), stdMat(C.terra, { roughness: 0.8 }), [-2.45, 0.2, -2.05]],
    [new IcosahedronGeometry(0.42, 1), stdMat(C.plant, { roughness: 0.9, flatShading: true }), [-2.45, 0.85, -2.05]],
  ])

  // pendant
  piece(8, [[new SphereGeometry(0.16, 24, 16), stdMat(C.brass, { metalness: 0.7, roughness: 0.25 }), [0.35, 2.55, 0.25]]])

  pivot.position.y = -1.0

  // ── animation state
  let progress = 0
  let radius = 14
  let shown = 0
  let raf = 0
  let running = false
  let t = 0
  let last = performance.now()

  const apply = (p: number) => {
    const plan = 0.35 + 0.65 * MathUtils.smoothstep(p, 0.0, 0.12)
    const build = MathUtils.clamp((p - 0.22) / 0.28, 0, 1)
    const mats = MathUtils.smoothstep(p, 0.5, 0.72)
    const light = MathUtils.smoothstep(p, 0.75, 0.95)

    for (const pc of pieces) {
      // staggered extrusion by order
      const local = MathUtils.clamp(build * 1.6 - pc.order * 0.08, 0, 1)
      const ease = 1 - Math.pow(1 - local, 3)
      pc.group.scale.y = pc.order === 0 ? 1 : Math.max(0.001, ease)
      pc.lines.opacity = plan * (1 - mats * 0.75)
      for (const m of pc.mats) m.opacity = mats
      pc.group.visible = plan > 0.001
    }

    hemi.intensity = 0.6 + light * 0.5
    sun.intensity = 1.2 + light * 0.8
    sun.color.set(light > 0.5 ? '#ffd6a6' : '#ffe9d2')
    lampLight.intensity = light * 6
    shadeMat.emissiveIntensity = light * 1.4

    // camera orbit: top-down plan → three-quarter view
    const theta = MathUtils.lerp(-0.25, 0.55, MathUtils.smoothstep(p, 0.05, 1))
    const phi = MathUtils.lerp(0.12, 1.05, MathUtils.smoothstep(p, 0.1, 0.6))
    const r = radius
    camera.position.set(Math.sin(theta) * Math.sin(phi) * r, Math.cos(phi) * r - 1.0, Math.cos(theta) * Math.sin(phi) * r)
    camera.lookAt(0, -0.1, 0)
  }

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w / h < 1 ? 40 : 32
    radius = w / h < 1.2 ? 11 : 14
    camera.updateProjectionMatrix()
  }

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    t += dt
    shown += (progress - shown) * Math.min(1, dt * 6)
    apply(shown)
    // drapes breathe once lit
    drapes.rotation.x = Math.sin(t * 0.9) * 0.01 * MathUtils.smoothstep(shown, 0.75, 1)
    pivot.rotation.y = Math.sin(t * 0.25) * 0.03
    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(tick)
  }

  resize()
  apply(0)

  return {
    setProgress: (p) => {
      progress = p
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
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
    },
  }
}
