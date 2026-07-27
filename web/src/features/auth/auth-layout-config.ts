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

type AuthHostLocation = Pick<Location, 'hostname'>

const nonPublicHostSuffixes = [
  '.example',
  '.internal',
  '.invalid',
  '.local',
  '.localhost',
  '.test',
]

export const authLayoutClasses = {
  root: 'brand-scope-auth bg-background text-foreground grid min-h-svh lg:grid-cols-[clamp(360px,36vw,560px)_minmax(0,1fr)]',
  mobileHeader:
    'grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 text-[color:var(--brand-plane-foreground)] [background:var(--brand-plane)] lg:hidden',
  utilityGroup: 'flex shrink-0 items-center gap-1',
  brandPlane:
    'relative hidden grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden p-12 text-[color:var(--brand-plane-foreground)] [background:var(--brand-plane)] lg:grid xl:p-16',
  brandCopy: 'auth-brand-copy relative z-10 max-w-sm self-center',
  brandFooter:
    'relative z-10 min-h-5 text-[13px] font-semibold [color:var(--brand-plane-signal)]',
  brandTone: 'auth-brand-tone absolute inset-y-0 right-0 w-14 xl:w-16',
  workSurface:
    'relative flex min-w-0 items-start justify-center px-5 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-8 lg:items-center lg:px-12 lg:py-16 [@media(max-height:700px)]:items-start',
  content: 'auth-work-content w-full max-w-[420px] py-2 lg:py-0',
} as const

export function getAuthDisplayHost(
  location: AuthHostLocation | null | undefined
): string {
  const hostname = location?.hostname.trim().toLowerCase().replace(/\.$/, '')
  if (!hostname || hostname === 'localhost') return ''

  const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  const isIpv6 = hostname.includes(':')
  const isReservedHost = nonPublicHostSuffixes.some((suffix) =>
    hostname.endsWith(suffix)
  )

  if (isIpv4 || isIpv6 || isReservedHost || !hostname.includes('.')) return ''
  return hostname
}

export function getOAuthProviderGridClasses(providerCount: number): string {
  const baseClasses = 'grid grid-cols-1 gap-2'
  if (providerCount === 2) return `${baseClasses} sm:grid-cols-2`
  if (providerCount === 3) return `${baseClasses} sm:grid-cols-3`
  if (providerCount > 3) {
    return `${baseClasses} sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2`
  }
  return baseClasses
}
