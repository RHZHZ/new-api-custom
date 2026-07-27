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

import { getLoginFailureMessage } from '../login-error.ts'

describe('login failure message', () => {
  test('uses a business response message when credentials are rejected', () => {
    assert.equal(
      getLoginFailureMessage(
        { success: false, message: 'Invalid username or password' },
        'Login failed'
      ),
      'Invalid username or password'
    )
  })

  test('prefers an HTTP response message over the transport error', () => {
    assert.equal(
      getLoginFailureMessage(
        {
          message: 'Request failed with status code 401',
          response: { data: { message: 'Account is disabled' } },
        },
        'Login failed'
      ),
      'Account is disabled'
    )
  })

  test('preserves an ordinary error message', () => {
    assert.equal(
      getLoginFailureMessage(new Error('Network unavailable'), 'Login failed'),
      'Network unavailable'
    )
  })

  test('falls back when the response has no useful message', () => {
    assert.equal(
      getLoginFailureMessage({ message: '  ' }, 'Login failed'),
      'Login failed'
    )
    assert.equal(getLoginFailureMessage(null, 'Login failed'), 'Login failed')
  })
})
