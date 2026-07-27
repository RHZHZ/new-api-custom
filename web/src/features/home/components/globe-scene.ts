/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

// Hand-rolled WebGL scene for the homepage hero: a dot-matrix 3D Earth with
// real coastlines, an atmosphere rim, tilted particle orbit rings, request
// arcs, and drifting dust. No rendering library — a few small shaders keep
// the whole scene dependency-free.

import { decodeEarthDots } from './earth-dots'

export interface GlobeSceneHandle {
  resize(width: number, height: number, dpr: number): void
  frame(timeMs: number): void
  renderStatic(): void
  setPointer(nx: number, ny: number): void
  dispose(): void
}

// Globe placement inside the canvas. In landscape the globe is the hero's
// right-column visual (§3.3 fifth revision); in portrait it anchors to the
// bottom of the canvas below the stacked copy.
const CENTER_X = 0.67
const CENTER_Y = 0.5
const RADIUS_FRACTION = 0.34
const FOV_Y = (34 * Math.PI) / 180
const SPIN_RATE = -0.11 // rad/s, west-to-east rotation
const START_LON = (105 * Math.PI) / 180 // Asia faces the camera first
const TILT_X = 0.14
const TILT_Z = 0.19

const RINGS = [
  { radius: 1.38, tiltX: 0.62, tiltZ: 0.24, speed: 0.3, dots: 96, size: 3.1 },
  { radius: 1.6, tiltX: -0.52, tiltZ: -0.42, speed: -0.22, dots: 104, size: 2.7 },
  { radius: 1.84, tiltX: 1.12, tiltZ: 0.34, speed: 0.16, dots: 112, size: 2.4 },
]

const CITIES: Record<string, [number, number]> = {
  beijing: [39.9, 116.4],
  shanghai: [31.2, 121.5],
  singapore: [1.35, 103.8],
  tokyo: [35.7, 139.7],
  sanFrancisco: [37.8, -122.4],
  newYork: [40.7, -74],
  london: [51.5, -0.1],
  frankfurt: [50.1, 8.7],
  dubai: [25.2, 55.3],
  sydney: [-33.9, 151.2],
}

const ROUTES: [string, string][] = [
  ['beijing', 'sanFrancisco'],
  ['shanghai', 'tokyo'],
  ['singapore', 'sydney'],
  ['beijing', 'frankfurt'],
  ['dubai', 'singapore'],
  ['london', 'newYork'],
]

const ARC_SEGMENTS = 44
const DUST_COUNT = 90

// ------------------------------------------------------------------ shaders

const SPHERE_VS = `
attribute vec3 aPos;
uniform mat4 uMVP;
uniform mat4 uModel;
uniform vec3 uPlanet;
varying float vNdotV;
varying float vHeight;
void main() {
  vec4 wp = uModel * vec4(aPos, 1.0);
  vec3 world = wp.xyz + uPlanet;
  vec3 n = normalize(mat3(uModel) * aPos);
  vec3 vdir = normalize(-world);
  vNdotV = dot(n, vdir);
  vHeight = aPos.y;
  gl_Position = uMVP * vec4(aPos, 1.0);
}
`

const SPHERE_FS = `
precision mediump float;
varying float vNdotV;
varying float vHeight;
void main() {
  vec3 deep = vec3(0.016, 0.05, 0.035);
  vec3 mid = vec3(0.05, 0.125, 0.088);
  vec3 col = mix(deep, mid, clamp(vHeight * 0.5 + 0.55, 0.0, 1.0) * 0.85);
  float rim = pow(1.0 - clamp(vNdotV, 0.0, 1.0), 2.6);
  col += vec3(0.16, 0.34, 0.24) * rim * 0.6;
  gl_FragColor = vec4(col, 1.0);
}
`

const ATMO_FS = `
precision mediump float;
varying float vNdotV;
varying float vHeight;
void main() {
  float edge = pow(smoothstep(1.0, 0.0, abs(vNdotV)), 2.4);
  vec3 col = vec3(0.34, 0.72, 0.53);
  gl_FragColor = vec4(col * edge, edge * 0.55);
}
`

const LAND_VS = `
attribute vec3 aPos;
attribute float aCoast;
uniform mat4 uMVP;
uniform mat4 uModel;
uniform vec3 uPlanet;
uniform float uSize;
uniform float uRefW;
uniform float uTime;
varying float vAlpha;
varying float vCoast;
void main() {
  vec4 clip = uMVP * vec4(aPos, 1.0);
  gl_Position = clip;
  vec3 n = normalize(mat3(uModel) * aPos);
  vec3 world = (uModel * vec4(aPos, 1.0)).xyz + uPlanet;
  float facing = dot(n, normalize(-world));
  float limb = smoothstep(-0.08, 0.3, facing);
  float tw = 0.84 + 0.16 * sin(uTime * 1.9 + aPos.x * 17.0 + aPos.y * 11.0);
  vAlpha = limb * tw;
  vCoast = aCoast;
  float sz = (aCoast > 0.5 ? 1.4 : 1.0) * uSize;
  gl_PointSize = sz * uRefW / max(clip.w, 0.0001);
}
`

const LAND_FS = `
precision mediump float;
varying float vAlpha;
varying float vCoast;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float soft = smoothstep(1.0, 0.3, d);
  vec3 col = mix(vec3(0.3, 0.52, 0.4), vec3(0.62, 0.86, 0.71), vCoast);
  gl_FragColor = vec4(col, soft * vAlpha * (0.62 + 0.38 * vCoast));
}
`

const RING_VS = `
attribute vec3 aPos;
attribute float aPhase;
uniform mat4 uMVP;
uniform float uSize;
uniform float uRefW;
uniform float uFlow;
varying float vAlpha;
void main() {
  vec4 clip = uMVP * vec4(aPos, 1.0);
  gl_Position = clip;
  float a = fract(aPhase - uFlow);
  float head = pow(0.5 + 0.5 * cos(6.28318 * a), 9.0);
  float head2 = pow(0.5 + 0.5 * cos(6.28318 * (a + 0.5)), 9.0) * 0.6;
  float pulse = max(head, head2);
  vAlpha = 0.42 + 0.58 * pulse;
  gl_PointSize = (0.85 + 1.4 * pulse) * uSize * uRefW / max(clip.w, 0.0001);
}
`

const RING_FS = `
precision mediump float;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float soft = smoothstep(1.0, 0.15, d);
  gl_FragColor = vec4(vec3(0.58, 0.82, 0.68) * soft, soft * vAlpha);
}
`

const ARC_VS = `
attribute vec3 aPos;
attribute vec2 aParam; // x: 0..1 along arc, y: per-arc offset
uniform mat4 uMVP;
uniform float uSize;
uniform float uRefW;
uniform float uTime;
varying float vAlpha;
void main() {
  vec4 clip = uMVP * vec4(aPos, 1.0);
  gl_Position = clip;
  float head = fract(uTime * 0.13 + aParam.y);
  float d = aParam.x - head;
  float tail = smoothstep(-0.26, 0.0, d) * (1.0 - step(0.015, d));
  vAlpha = 0.09 + 0.91 * tail * tail;
  gl_PointSize = (0.6 + 1.1 * tail) * uSize * uRefW / max(clip.w, 0.0001);
}
`

const ARC_FS = `
precision mediump float;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float soft = smoothstep(1.0, 0.2, d);
  gl_FragColor = vec4(vec3(0.66, 0.9, 0.75) * soft, soft * vAlpha);
}
`

const DUST_VS = `
attribute vec3 aPos;
attribute vec3 aSeed; // x: size, y: twinkle phase, z: parallax depth
uniform mat4 uProj;
uniform vec3 uPlanet;
uniform vec2 uParallax;
uniform float uTime;
uniform float uRefW;
varying float vAlpha;
void main() {
  vec3 p = aPos;
  p.y = mod(p.y + uTime * 0.045 * (0.4 + aSeed.z), 4.6) - 2.3;
  p.xy += uParallax * (0.12 + 0.3 * aSeed.z);
  vec3 world = p * 2.6 + uPlanet;
  vec4 clip = uProj * vec4(world, 1.0);
  gl_Position = clip;
  vAlpha = (0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 0.9 + aSeed.y)))
    * (0.35 + 0.65 * aSeed.z);
  gl_PointSize = aSeed.x * uRefW / max(clip.w, 0.0001);
}
`

const DUST_FS = `
precision mediump float;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float soft = smoothstep(1.0, 0.1, d);
  gl_FragColor = vec4(vec3(0.55, 0.78, 0.64) * soft, soft * vAlpha * 0.5);
}
`

// ------------------------------------------------------------- math helpers

type Mat4 = Float32Array

interface GlobePrograms {
  sphere: WebGLProgram
  atmo: WebGLProgram
  land: WebGLProgram
  ring: WebGLProgram
  arc: WebGLProgram
  dust: WebGLProgram
}

function mat4Identity(): Mat4 {
  const m = new Float32Array(16)
  m[0] = m[5] = m[10] = m[15] = 1
  return m
}

function mat4Multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3]
    }
  }
  return out
}

function mat4Perspective(fovY: number, aspect: number): Mat4 {
  const near = 0.1
  const far = 60
  const f = 1 / Math.tan(fovY / 2)
  const m = new Float32Array(16)
  m[0] = f / aspect
  m[5] = f
  m[10] = (far + near) / (near - far)
  m[11] = -1
  m[14] = (2 * far * near) / (near - far)
  return m
}

function mat4RotateX(rad: number): Mat4 {
  const m = mat4Identity()
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  m[5] = c
  m[6] = s
  m[9] = -s
  m[10] = c
  return m
}

function mat4RotateY(rad: number): Mat4 {
  const m = mat4Identity()
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  m[0] = c
  m[2] = -s
  m[8] = s
  m[10] = c
  return m
}

function mat4RotateZ(rad: number): Mat4 {
  const m = mat4Identity()
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  m[0] = c
  m[1] = s
  m[4] = -s
  m[5] = c
  return m
}

function mat4Translate(x: number, y: number, z: number): Mat4 {
  const m = mat4Identity()
  m[12] = x
  m[13] = y
  m[14] = z
  return m
}

function mat4Scale(s: number): Mat4 {
  const m = mat4Identity()
  m[0] = m[5] = m[10] = s
  return m
}

function latLonToUnit(lat: number, lon: number): [number, number, number] {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180
  const cos = Math.cos(la)
  return [cos * Math.sin(lo), Math.sin(la), cos * Math.cos(lo)]
}

// Deterministic pseudo-random, keeps renders reproducible.
function mulberry(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// -------------------------------------------------------------- gl plumbing

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function link(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, vs)
  const f = compile(gl, gl.FRAGMENT_SHADER, fs)
  if (!v || !f) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, v)
  gl.attachShader(program, f)
  gl.linkProgram(program)
  gl.deleteShader(v)
  gl.deleteShader(f)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

function buildSphere(segments: number, rings: number) {
  const positions: number[] = []
  const indices: number[] = []
  for (let r = 0; r <= rings; r++) {
    const phi = (r / rings) * Math.PI - Math.PI / 2
    for (let s = 0; s <= segments; s++) {
      const theta = (s / segments) * Math.PI * 2
      positions.push(
        Math.cos(phi) * Math.sin(theta),
        Math.sin(phi),
        Math.cos(phi) * Math.cos(theta)
      )
    }
  }
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = r * (segments + 1) + s
      const b = a + segments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  return {
    positions: new Float32Array(positions),
    indices: new Uint16Array(indices),
  }
}

function buildArcs() {
  const positions: number[] = []
  const params: number[] = []
  ROUTES.forEach(([fromKey, toKey], arcIndex) => {
    const a = latLonToUnit(...CITIES[fromKey])
    const b = latLonToUnit(...CITIES[toKey])
    const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    const lift = 0.16 + 0.22 * (1 - dot)
    for (let i = 0; i <= ARC_SEGMENTS; i++) {
      const t = i / ARC_SEGMENTS
      const x = a[0] + (b[0] - a[0]) * t
      const y = a[1] + (b[1] - a[1]) * t
      const z = a[2] + (b[2] - a[2]) * t
      const len = Math.hypot(x, y, z) || 1
      const r = 1.01 + lift * 4 * t * (1 - t)
      positions.push((x / len) * r, (y / len) * r, (z / len) * r)
      params.push(t, arcIndex / ROUTES.length)
    }
  })
  return {
    positions: new Float32Array(positions),
    params: new Float32Array(params),
    count: positions.length / 3,
  }
}

// ------------------------------------------------------------------- scene

export function createGlobeScene(
  canvas: HTMLCanvasElement
): GlobeSceneHandle | null {
  const glContext = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  })
  if (!glContext) return null
  const gl = glContext
  // buildSphere emits clockwise-wound triangles as seen from outside.
  gl.frontFace(gl.CW)

  const programs = {
    sphere: link(gl, SPHERE_VS, SPHERE_FS),
    atmo: link(gl, SPHERE_VS, ATMO_FS),
    land: link(gl, LAND_VS, LAND_FS),
    ring: link(gl, RING_VS, RING_FS),
    arc: link(gl, ARC_VS, ARC_FS),
    dust: link(gl, DUST_VS, DUST_FS),
  }
  if (Object.values(programs).some((p) => !p)) return null
  const scenePrograms = programs as GlobePrograms

  const buffers: WebGLBuffer[] = []
  function makeBuffer(data: Float32Array | Uint16Array, target: number) {
    const buffer = gl.createBuffer()
    if (buffer) {
      buffers.push(buffer)
      gl.bindBuffer(target, buffer)
      gl.bufferData(target, data, gl.STATIC_DRAW)
    }
    return buffer
  }

  // Geometry -----------------------------------------------------------
  const sphere = buildSphere(56, 36)
  const sphereBuf = makeBuffer(sphere.positions, gl.ARRAY_BUFFER)
  const sphereIdx = makeBuffer(sphere.indices, gl.ELEMENT_ARRAY_BUFFER)

  const land = decodeEarthDots()
  const landPos = new Float32Array(land.positions.length)
  for (let i = 0; i < land.positions.length; i++) {
    landPos[i] = land.positions[i] * 1.006
  }
  const landBuf = makeBuffer(landPos, gl.ARRAY_BUFFER)
  const coastBuf = makeBuffer(land.coast, gl.ARRAY_BUFFER)

  const ringGeo = RINGS.map((ring) => {
    const positions = new Float32Array(ring.dots * 3)
    const phases = new Float32Array(ring.dots)
    for (let i = 0; i < ring.dots; i++) {
      const angle = (i / ring.dots) * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * ring.radius
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = Math.sin(angle) * ring.radius
      phases[i] = i / ring.dots
    }
    return {
      posBuf: makeBuffer(positions, gl.ARRAY_BUFFER),
      phaseBuf: makeBuffer(phases, gl.ARRAY_BUFFER),
      count: ring.dots,
    }
  })

  const arcs = buildArcs()
  const arcPosBuf = makeBuffer(arcs.positions, gl.ARRAY_BUFFER)
  const arcParamBuf = makeBuffer(arcs.params, gl.ARRAY_BUFFER)

  const rand = mulberry(20260726)
  const dustPos = new Float32Array(DUST_COUNT * 3)
  const dustSeed = new Float32Array(DUST_COUNT * 3)
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i * 3] = (rand() - 0.5) * 4.6
    dustPos[i * 3 + 1] = (rand() - 0.5) * 4.6
    dustPos[i * 3 + 2] = (rand() - 0.5) * 2.4
    dustSeed[i * 3] = 0.9 + rand() * 1.4
    dustSeed[i * 3 + 1] = rand() * Math.PI * 2
    dustSeed[i * 3 + 2] = rand()
  }
  const dustPosBuf = makeBuffer(dustPos, gl.ARRAY_BUFFER)
  const dustSeedBuf = makeBuffer(dustSeed, gl.ARRAY_BUFFER)

  // State ----------------------------------------------------------------
  let width = 1
  let height = 1
  let dpr = 1
  let planetDistance = 6
  let planetX = 0
  let planetY = 0
  let refW = 1
  let proj = mat4Identity()
  let spin = -START_LON
  let lastTime = 0
  let pointerX = 0
  let pointerY = 0
  let easedX = 0
  let easedY = 0
  let disposed = false

  function attrib(program: WebGLProgram, name: string, buffer: WebGLBuffer | null, size: number) {
    if (!buffer) return
    const loc = gl.getAttribLocation(program, name)
    if (loc < 0) return
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
  }

  function uniformM(program: WebGLProgram, name: string, value: Mat4) {
    gl.uniformMatrix4fv(gl.getUniformLocation(program, name), false, value)
  }

  function uniform1(program: WebGLProgram, name: string, value: number) {
    gl.uniform1f(gl.getUniformLocation(program, name), value)
  }

  function resize(w: number, h: number, ratio: number) {
    width = Math.max(1, w)
    height = Math.max(1, h)
    dpr = Math.min(ratio, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    // Below the lg breakpoint the hero stacks its content and the globe
    // becomes a dimmed backdrop behind the headline block at the top of
    // the canvas. Aspect stays as a fallback signal.
    const portrait = width < 1024 || width / height < 0.8
    // Stacked layouts overlay large display text, so cap the radius.
    const radiusPx = portrait
      ? Math.min(width * 0.36, 170)
      : RADIUS_FRACTION * Math.min(width, height)
    const centerXPx = portrait ? width * 0.58 : width * CENTER_X
    const centerYPx = portrait
      ? Math.min(radiusPx * 1.1 + 56, height * 0.5)
      : height * CENTER_Y
    const pxPerWorld = height / (2 * Math.tan(FOV_Y / 2))
    planetDistance = pxPerWorld / radiusPx
    const worldPerPx = 1 / (pxPerWorld / planetDistance)
    planetX = (centerXPx - width * 0.5) * worldPerPx
    planetY = (height * 0.5 - centerYPx) * worldPerPx
    refW = planetDistance * dpr
    proj = mat4Perspective(FOV_Y, width / height)
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  function render(time: number) {
    if (disposed) return
    const t = time / 1000
    if (lastTime === 0) lastTime = t
    const dt = Math.min(t - lastTime, 0.1)
    lastTime = t
    spin += SPIN_RATE * dt
    easedX += (pointerX - easedX) * 0.045
    easedY += (pointerY - easedY) * 0.045

    const planet = mat4Translate(planetX, planetY, -planetDistance)
    const view = mat4Multiply(proj, planet)
    const globeModel = mat4Multiply(
      mat4Multiply(
        mat4RotateZ(TILT_Z + easedX * 0.04),
        mat4RotateX(TILT_X + easedY * 0.06)
      ),
      mat4RotateY(spin)
    )
    const globeMVP = mat4Multiply(view, globeModel)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.BLEND)

    // Dust (background, additive, no depth write)
    gl.depthMask(false)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    const dustProgram = scenePrograms.dust
    gl.useProgram(dustProgram)
    uniformM(dustProgram, 'uProj', proj)
    gl.uniform3f(
      gl.getUniformLocation(dustProgram, 'uPlanet'),
      planetX,
      planetY,
      -planetDistance
    )
    gl.uniform2f(
      gl.getUniformLocation(dustProgram, 'uParallax'),
      easedX * -0.5,
      easedY * 0.4
    )
    uniform1(dustProgram, 'uTime', t)
    uniform1(dustProgram, 'uRefW', refW * 0.9)
    attrib(dustProgram, 'aPos', dustPosBuf, 3)
    attrib(dustProgram, 'aSeed', dustSeedBuf, 3)
    gl.drawArrays(gl.POINTS, 0, DUST_COUNT)

    // Planet body (opaque, writes depth)
    gl.depthMask(true)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    const sphereProgram = scenePrograms.sphere
    gl.useProgram(sphereProgram)
    uniformM(sphereProgram, 'uMVP', globeMVP)
    uniformM(sphereProgram, 'uModel', globeModel)
    gl.uniform3f(
      gl.getUniformLocation(sphereProgram, 'uPlanet'),
      planetX,
      planetY,
      -planetDistance
    )
    attrib(sphereProgram, 'aPos', sphereBuf, 3)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIdx)
    gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0)

    // Land dots (depth-tested against the body, no depth write)
    gl.depthMask(false)
    const landProgram = scenePrograms.land
    gl.useProgram(landProgram)
    uniformM(landProgram, 'uMVP', globeMVP)
    uniformM(landProgram, 'uModel', globeModel)
    gl.uniform3f(
      gl.getUniformLocation(landProgram, 'uPlanet'),
      planetX,
      planetY,
      -planetDistance
    )
    uniform1(landProgram, 'uSize', 2.5)
    uniform1(landProgram, 'uRefW', refW)
    uniform1(landProgram, 'uTime', t)
    attrib(landProgram, 'aPos', landBuf, 3)
    attrib(landProgram, 'aCoast', coastBuf, 1)
    gl.drawArrays(gl.POINTS, 0, land.count)

    // Atmosphere rim (backfaces of an enlarged shell, additive, no depth)
    gl.disable(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.cullFace(gl.FRONT)
    const atmoProgram = scenePrograms.atmo
    gl.useProgram(atmoProgram)
    const atmoModel = mat4Multiply(globeModel, mat4Scale(1.09))
    uniformM(atmoProgram, 'uMVP', mat4Multiply(view, atmoModel))
    uniformM(atmoProgram, 'uModel', atmoModel)
    gl.uniform3f(
      gl.getUniformLocation(atmoProgram, 'uPlanet'),
      planetX,
      planetY,
      -planetDistance
    )
    attrib(atmoProgram, 'aPos', sphereBuf, 3)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIdx)
    gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0)
    gl.cullFace(gl.BACK)
    gl.enable(gl.DEPTH_TEST)

    // Request arcs (rotate with the globe)
    const arcProgram = scenePrograms.arc
    gl.useProgram(arcProgram)
    uniformM(arcProgram, 'uMVP', globeMVP)
    uniform1(arcProgram, 'uSize', 2.2)
    uniform1(arcProgram, 'uRefW', refW)
    uniform1(arcProgram, 'uTime', t)
    attrib(arcProgram, 'aPos', arcPosBuf, 3)
    attrib(arcProgram, 'aParam', arcParamBuf, 2)
    gl.drawArrays(gl.POINTS, 0, arcs.count)

    // Orbit rings (independent tilts and speeds)
    const ringProgram = scenePrograms.ring
    gl.useProgram(ringProgram)
    RINGS.forEach((ring, i) => {
      const geo = ringGeo[i]
      const model = mat4Multiply(
        mat4Multiply(mat4RotateZ(ring.tiltZ), mat4RotateX(ring.tiltX)),
        mat4RotateY(t * ring.speed)
      )
      uniformM(ringProgram, 'uMVP', mat4Multiply(view, model))
      uniform1(ringProgram, 'uSize', ring.size)
      uniform1(ringProgram, 'uRefW', refW)
      uniform1(ringProgram, 'uFlow', t * Math.abs(ring.speed) * 0.55 + i * 0.37)
      attrib(ringProgram, 'aPos', geo.posBuf, 3)
      attrib(ringProgram, 'aPhase', geo.phaseBuf, 1)
      gl.drawArrays(gl.POINTS, 0, geo.count)
    })

    gl.depthMask(true)
  }

  return {
    resize,
    frame(timeMs: number) {
      render(timeMs)
    },
    renderStatic() {
      lastTime = 0
      render(0)
    },
    setPointer(nx: number, ny: number) {
      pointerX = nx
      pointerY = ny
    },
    dispose() {
      disposed = true
      for (const buffer of buffers) gl.deleteBuffer(buffer)
      for (const program of Object.values(scenePrograms)) {
        gl.deleteProgram(program)
      }
    },
  }
}
