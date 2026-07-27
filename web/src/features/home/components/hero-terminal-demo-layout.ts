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
export const heroTerminalDemoLayoutClasses = {
  container:
    'w-full min-w-0 max-w-full bg-transparent px-5 py-5 text-[#F1F4F1] md:flex md:px-10 md:py-10',
  mobileArchitecture:
    'mx-auto min-w-0 w-full max-w-[560px] scroll-mt-16 md:hidden',
  mobileModelRail:
    'grid h-20 min-w-0 w-full grid-cols-5 overflow-x-auto overflow-y-hidden border border-white/18 bg-white/[0.05] [scrollbar-width:thin] max-[359px]:flex',
  mobileModelItem:
    'flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-2 border-r border-white/10 px-2 last:border-r-0 max-[359px]:min-w-[68px]',
  mobileApiBand:
    'flex h-14 items-center justify-center bg-[#0F5239] px-5 text-sm leading-5 font-semibold text-white',
  mobileCapabilityGrid:
    'grid grid-cols-2 border-x border-b border-[#2E5A45] bg-[#0E1A13]/90',
  mobileCapability:
    'flex min-h-32 flex-col items-start justify-start p-4 text-left',
  mobileCapabilityTitle:
    'mt-3 text-sm leading-5 font-semibold [overflow-wrap:anywhere]',
  mobileCapabilityDetail:
    'mt-2 text-xs leading-[18px] text-white/58 [overflow-wrap:anywhere]',
  desktopArchitecture: 'mx-auto hidden w-full max-w-[820px] md:block',
} as const
