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
  authenticatedShellLayoutClasses,
  defaultLayoutVariant,
  layoutVariantCookieName,
  resolveLayoutVariant,
} from '../lib/authenticated-shell-layout.ts'

describe('authenticated application shell layout', () => {
  test('defaults new sessions to the standard sidebar surface', () => {
    assert.equal(defaultLayoutVariant, 'sidebar')
    assert.equal(layoutVariantCookieName, 'layout_variant')
    assert.equal(resolveLayoutVariant(undefined), 'sidebar')
    assert.equal(resolveLayoutVariant('unsupported'), 'sidebar')
  })

  test('preserves a layout explicitly selected with the current preference key', () => {
    assert.equal(resolveLayoutVariant('sidebar'), 'sidebar')
    assert.equal(resolveLayoutVariant('inset'), 'inset')
    assert.equal(resolveLayoutVariant('floating'), 'floating')
  })

  test('keeps the shell fixed while feature pages own vertical scrolling', () => {
    const bodyClasses = authenticatedShellLayoutClasses.body.split(' ')
    const contentClasses = authenticatedShellLayoutClasses.content.split(' ')

    assert.ok(bodyClasses.includes('min-h-0'))
    assert.ok(contentClasses.includes('overflow-hidden'))
    assert.ok(!contentClasses.includes('overflow-y-auto'))
  })
})
