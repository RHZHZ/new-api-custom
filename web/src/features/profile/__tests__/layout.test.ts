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
  profileSectionIds,
  profileWorkbenchLayoutClasses,
} from '../profile-layout.ts'

describe('profile workbench layout', () => {
  test('assigns vertical scrolling to one profile content region', () => {
    const scrollClasses = profileWorkbenchLayoutClasses.scrollRegion.split(' ')
    const contentClasses = profileWorkbenchLayoutClasses.content.split(' ')
    const gridClasses = profileWorkbenchLayoutClasses.grid.split(' ')

    assert.ok(scrollClasses.includes('overflow-y-auto'))
    assert.ok(scrollClasses.includes('min-h-0'))
    assert.ok(!contentClasses.includes('overflow-y-auto'))
    assert.ok(!gridClasses.includes('overflow-y-auto'))
  })

  test('uses one column by default and a primary plus auxiliary column on wide screens', () => {
    const gridClasses = profileWorkbenchLayoutClasses.grid.split(' ')
    const secondaryClasses =
      profileWorkbenchLayoutClasses.secondaryColumn.split(' ')

    assert.ok(gridClasses.includes('grid'))
    assert.ok(
      gridClasses.includes('xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]')
    )
    assert.ok(
      !secondaryClasses.some((className) => className.includes('sticky'))
    )
  })

  test('presents account security and preferences as continuous section stacks', () => {
    const stackClasses = profileWorkbenchLayoutClasses.sectionStack.split(' ')
    const itemClasses = profileWorkbenchLayoutClasses.sectionItem.split(' ')

    assert.deepEqual(Object.keys(profileSectionIds), [
      'account',
      'security',
      'preferences',
    ])
    assert.ok(stackClasses.includes('divide-y'))
    assert.ok(stackClasses.includes('border'))
    assert.ok(itemClasses.includes('[&_[data-slot=card]]:rounded-none'))
    assert.ok(itemClasses.includes('[&_[data-slot=card]]:ring-0'))
  })
})
