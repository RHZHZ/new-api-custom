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

export const profileWorkbenchLayoutClasses = {
  titleBar: 'bg-background border-border shrink-0 border-b px-4 py-4 md:px-6',
  scrollRegion: 'min-h-0 flex-1 overflow-y-auto overscroll-contain',
  content: 'mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6',
  grid: 'grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] xl:items-start',
  primaryColumn: 'space-y-8',
  secondaryColumn: 'min-w-0',
  sectionStack:
    'bg-card divide-border divide-y overflow-hidden rounded-md border',
  sectionItem:
    '[&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:ring-0',
} as const

export const profileSectionIds = {
  account: 'profile-account',
  security: 'profile-security',
  preferences: 'profile-preferences',
} as const
