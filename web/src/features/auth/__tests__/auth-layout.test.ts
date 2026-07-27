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
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  authLayoutClasses,
  getAuthDisplayHost,
  getOAuthProviderGridClasses,
} from '../auth-layout-config.ts'

describe('authentication layout', () => {
  test('caps the desktop brand plane and keeps the work surface scrollable', () => {
    const rootClasses = authLayoutClasses.root.split(' ')
    const workSurfaceClasses = authLayoutClasses.workSurface.split(' ')

    assert.ok(rootClasses.includes('min-h-svh'))
    assert.ok(!rootClasses.includes('h-svh'))
    assert.ok(
      rootClasses.includes(
        'lg:grid-cols-[clamp(360px,36vw,560px)_minmax(0,1fr)]'
      )
    )
    assert.ok(workSurfaceClasses.includes('min-w-0'))
    assert.ok(
      workSurfaceClasses.includes(
        'pb-[calc(2.5rem+env(safe-area-inset-bottom))]'
      )
    )
    assert.ok(
      workSurfaceClasses.includes('[@media(max-height:700px)]:items-start')
    )
  })

  test('keeps the mobile brand bar separate from the desktop brand plane', () => {
    const mobileHeaderClasses = authLayoutClasses.mobileHeader.split(' ')

    assert.ok(mobileHeaderClasses.includes('h-16'))
    assert.ok(mobileHeaderClasses.includes('lg:hidden'))
    assert.ok(mobileHeaderClasses.includes('grid-cols-[minmax(0,1fr)_auto]'))
  })

  test('centers brand copy independently from the optional public hostname', () => {
    const brandPlaneClasses = authLayoutClasses.brandPlane.split(' ')
    const brandCopyClasses = authLayoutClasses.brandCopy.split(' ')
    const brandFooterClasses = authLayoutClasses.brandFooter.split(' ')

    assert.ok(brandPlaneClasses.includes('grid-rows-[auto_minmax(0,1fr)_auto]'))
    assert.ok(brandPlaneClasses.includes('lg:grid'))
    assert.ok(brandCopyClasses.includes('self-center'))
    assert.ok(brandFooterClasses.includes('min-h-5'))
  })

  test('marks brand and work regions for reduced-motion-aware entrance effects', () => {
    const brandCopyClasses = authLayoutClasses.brandCopy.split(' ')
    const contentClasses = authLayoutClasses.content.split(' ')

    assert.ok(brandCopyClasses.includes('auth-brand-copy'))
    assert.ok(contentClasses.includes('auth-work-content'))
  })

  test('keeps the brand tone strip subordinate to the brand copy', () => {
    const toneClasses = authLayoutClasses.brandTone.split(' ')

    assert.ok(toneClasses.includes('inset-y-0'))
    assert.ok(toneClasses.includes('w-14'))
    assert.ok(toneClasses.includes('xl:w-16'))
  })

  test('shows only recognizable public hostnames', () => {
    assert.equal(
      getAuthDisplayHost({ hostname: 'api.example.com' }),
      'api.example.com'
    )
    assert.equal(getAuthDisplayHost({ hostname: 'LOCALHOST' }), '')
    assert.equal(getAuthDisplayHost({ hostname: '169.254.15.197' }), '')
    assert.equal(getAuthDisplayHost({ hostname: '[::1]' }), '')
    assert.equal(getAuthDisplayHost({ hostname: 'new-api.internal' }), '')
    assert.equal(getAuthDisplayHost({ hostname: 'development' }), '')
  })

  test('uses responsive provider columns without forcing mobile overflow', () => {
    assert.equal(getOAuthProviderGridClasses(1), 'grid grid-cols-1 gap-2')
    assert.match(getOAuthProviderGridClasses(2), /sm:grid-cols-2/)
    assert.match(getOAuthProviderGridClasses(3), /sm:grid-cols-3/)
    assert.match(getOAuthProviderGridClasses(5), /sm:grid-cols-2/)
    assert.match(getOAuthProviderGridClasses(5), /last-child:nth-child\(odd\)/)
  })
})
