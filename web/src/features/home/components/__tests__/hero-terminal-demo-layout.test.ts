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

import { heroTerminalDemoLayoutClasses } from '../hero-terminal-demo-layout.ts'

describe('hero terminal demo responsive layout', () => {
  test('uses the mobile architecture until the md breakpoint', () => {
    const mobileClasses =
      heroTerminalDemoLayoutClasses.mobileArchitecture.split(' ')
    const desktopClasses =
      heroTerminalDemoLayoutClasses.desktopArchitecture.split(' ')

    assert.ok(mobileClasses.includes('md:hidden'))
    assert.ok(desktopClasses.includes('hidden'))
    assert.ok(desktopClasses.includes('md:block'))
  })

  test('keeps model types in one rail with narrow-screen scrolling', () => {
    const containerClasses = heroTerminalDemoLayoutClasses.container.split(' ')
    const architectureClasses =
      heroTerminalDemoLayoutClasses.mobileArchitecture.split(' ')
    const railClasses = heroTerminalDemoLayoutClasses.mobileModelRail.split(' ')
    const itemClasses = heroTerminalDemoLayoutClasses.mobileModelItem.split(' ')

    assert.ok(containerClasses.includes('w-full'))
    assert.ok(containerClasses.includes('min-w-0'))
    assert.ok(containerClasses.includes('md:flex'))
    assert.ok(architectureClasses.includes('min-w-0'))
    assert.ok(railClasses.includes('min-w-0'))
    assert.ok(railClasses.includes('w-full'))
    assert.ok(railClasses.includes('grid-cols-5'))
    assert.ok(railClasses.includes('overflow-x-auto'))
    assert.ok(railClasses.includes('max-[359px]:flex'))
    assert.ok(itemClasses.includes('max-[359px]:min-w-[68px]'))
    assert.ok(!railClasses.includes('grid-cols-3'))
  })

  test('keeps the API band and capability matrix compact and readable', () => {
    const apiBandClasses =
      heroTerminalDemoLayoutClasses.mobileApiBand.split(' ')
    const gridClasses =
      heroTerminalDemoLayoutClasses.mobileCapabilityGrid.split(' ')
    const capabilityClasses =
      heroTerminalDemoLayoutClasses.mobileCapability.split(' ')
    const titleClasses =
      heroTerminalDemoLayoutClasses.mobileCapabilityTitle.split(' ')
    const detailClasses =
      heroTerminalDemoLayoutClasses.mobileCapabilityDetail.split(' ')

    assert.ok(apiBandClasses.includes('h-14'))
    assert.ok(gridClasses.includes('grid-cols-2'))
    assert.ok(capabilityClasses.includes('min-h-32'))
    assert.ok(titleClasses.includes('text-sm'))
    assert.ok(detailClasses.includes('text-xs'))
  })
})
