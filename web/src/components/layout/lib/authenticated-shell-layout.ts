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

export type LayoutVariant = 'inset' | 'sidebar' | 'floating'

export const layoutVariantCookieName = 'layout_variant'
export const defaultLayoutVariant: LayoutVariant = 'sidebar'

export const authenticatedShellLayoutClasses = {
  provider: 'flex-col bg-background',
  body: 'flex min-h-0 w-full flex-1',
  content:
    '@container/content h-[calc(100svh-var(--app-header-height,0px))] min-h-0 overflow-hidden',
} as const

export function resolveLayoutVariant(
  savedVariant: string | null | undefined
): LayoutVariant {
  switch (savedVariant) {
    case 'inset':
    case 'sidebar':
    case 'floating':
      return savedVariant
    default:
      return defaultLayoutVariant
  }
}
