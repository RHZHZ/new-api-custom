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
import { cn } from '@/lib/utils'

import type { TopNavLink } from '../types'
import { PublicHeader, type PublicHeaderProps } from './public-header'

type PublicLayoutProps = {
  children: React.ReactNode
  /**
   * Explicit layout variant (enterprise site theme 16.6). `page` (default)
   * is the stable inner-page shell; `home` is the landing masthead.
   */
  variant?: 'home' | 'page'
  showMainContainer?: boolean
  navContent?: React.ReactNode
  headerProps?: Omit<PublicHeaderProps, 'navContent'>
  navLinks?: TopNavLink[]
  showThemeSwitch?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  logo?: React.ReactNode
  siteName?: string
}

/**
 * Shared public shell. Owns the brand scope (16.4), the fixed header, a
 * semantic `main` that starts below the header's real height (64px mobile /
 * 72px desktop for inner pages, 16.6), and the page background — every
 * public page, including full-width custom HTML/iframe branches, keeps
 * these responsibilities.
 */
export function PublicLayout(props: PublicLayoutProps) {
  const variant = props.variant ?? 'page'

  return (
    <div className='brand-scope-public bg-background text-foreground relative min-h-svh overflow-x-clip'>
      <PublicHeader
        variant={variant}
        navContent={props.navContent}
        navLinks={props.navLinks}
        showThemeSwitch={props.showThemeSwitch}
        showAuthButtons={props.showAuthButtons}
        showNotifications={props.showNotifications}
        logo={props.logo}
        siteName={props.siteName}
        {...props.headerProps}
      />

      {props.showMainContainer !== false ? (
        <main
          className={cn(
            'container px-4 pb-8 md:px-4',
            variant === 'home' ? 'pt-20' : 'pt-[88px] md:pt-[104px]'
          )}
        >
          {props.children}
        </main>
      ) : (
        props.children
      )}
    </div>
  )
}
