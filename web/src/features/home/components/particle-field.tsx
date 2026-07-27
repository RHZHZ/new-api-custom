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

// Cinematic hero backdrop: a 3D dot-matrix Earth with real coastlines,
// particle orbit rings, request arcs, and drifting dust, rendered with a
// small hand-rolled WebGL scene (globe-scene.ts). No rendering libraries,
// no texture assets, no new dependencies. Decorative only (aria-hidden,
// pointer-events-none); honors prefers-reduced-motion with a static frame.

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { createGlobeScene } from './globe-scene'

export function ParticleField(props: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return
    const canvas = canvasElement

    const createdScene = createGlobeScene(canvas)
    if (!createdScene) return
    const scene = createdScene

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId = 0
    let running = false
    let lastWidth = 0
    let lastHeight = 0
    let lastDpr = 0

    function measure() {
      const rect = canvas.getBoundingClientRect()
      lastWidth = rect.width
      lastHeight = rect.height
      lastDpr = window.devicePixelRatio || 1
      scene.resize(rect.width, rect.height, lastDpr)
    }

    function loop(time: number) {
      // Self-heal: if the displayed size drifted from the measured one
      // (font reflow, HMR remounts, zoom), fix it before the next frame.
      if (
        Math.abs(canvas.clientWidth - lastWidth) > 1 ||
        Math.abs(canvas.clientHeight - lastHeight) > 1 ||
        (window.devicePixelRatio || 1) !== lastDpr
      ) {
        measure()
      }
      scene.frame(time)
      frameId = window.requestAnimationFrame(loop)
    }

    function start() {
      if (running || reducedMotion.matches) return
      running = true
      frameId = window.requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      window.cancelAnimationFrame(frameId)
    }

    function handleVisibility() {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stop()
        scene.renderStatic()
      } else {
        start()
      }
    }

    function handlePointer(event: PointerEvent) {
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      scene.setPointer(nx, ny)
    }

    measure()
    if (reducedMotion.matches) {
      scene.renderStatic()
    } else {
      start()
    }

    const observer = new ResizeObserver(() => {
      measure()
      if (reducedMotion.matches) scene.renderStatic()
    })
    observer.observe(canvas)
    document.addEventListener('visibilitychange', handleVisibility)
    reducedMotion.addEventListener('change', handleMotionChange)
    window.addEventListener('pointermove', handlePointer, { passive: true })

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      reducedMotion.removeEventListener('change', handleMotionChange)
      window.removeEventListener('pointermove', handlePointer)
      scene.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className={cn(
        'pointer-events-none absolute inset-0 size-full opacity-70 lg:opacity-100',
        props.className
      )}
    />
  )
}
