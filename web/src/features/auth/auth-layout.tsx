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
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

import { authLayoutClasses, getAuthDisplayHost } from './auth-layout-config'

type AuthLayoutProps = {
  children: React.ReactNode
}

/**
 * Shared auth skeleton (enterprise site theme 16.6): a restrained brand
 * entrance where the form is the only primary task.
 *
 * - Desktop: ~36/64 split — deep-green brand plane (site name, positioning
 *   line, host) on the left, warm work surface with a 400–440px single
 *   form column on the right.
 * - Mobile: the plane collapses into a 64px brand bar; the form scrolls
 *   naturally below it (min-h-svh, never a clipped fixed h-svh).
 *
 * Sign-in, sign-up, forgot/reset, OTP and OAuth callbacks all render
 * inside this one skeleton instead of inventing per-page templates.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, loading } = useSystemConfig()

  const displayHost =
    typeof window === 'undefined' ? '' : getAuthDisplayHost(window.location)

  const brandName = loading ? (
    <Skeleton className='h-8 w-28 bg-white/15' />
  ) : (
    <span className='text-3xl leading-none font-semibold'>{systemName}</span>
  )

  return (
    <div className={authLayoutClasses.root}>
      {/* Mobile brand bar (64px) — replaces the side plane on small screens. */}
      <header className={authLayoutClasses.mobileHeader}>
        <Link to='/' className='min-w-0 transition-opacity hover:opacity-85'>
          {loading ? (
            <Skeleton className='h-6 w-20 bg-white/15' />
          ) : (
            <span className='block truncate text-xl leading-none font-semibold sm:text-2xl'>
              {systemName}
            </span>
          )}
        </Link>
        <div className={authLayoutClasses.utilityGroup}>
          <Button
            variant='ghost'
            size='icon'
            className='size-11 hover:bg-white/10 hover:text-current'
            aria-label={t('Back to Home')}
            title={t('Back to Home')}
            render={<Link to='/' />}
          >
            <ArrowLeft aria-hidden='true' />
          </Button>
          <LanguageSwitcher className='size-11 hover:bg-white/10 hover:text-current' />
          <ThemeSwitch className='size-11 hover:bg-white/10 hover:text-current' />
        </div>
      </header>

      {/* Desktop brand plane. */}
      <aside aria-label={t('Brand')} className={authLayoutClasses.brandPlane}>
        <Link
          to='/'
          className='auth-brand-mark relative z-10 transition-opacity hover:opacity-85'
        >
          {brandName}
        </Link>

        <div className={authLayoutClasses.brandCopy}>
          <p className='text-[2.625rem] leading-[1.22] font-medium text-balance'>
            {t('Enterprise unified service gateway')}
          </p>
          <p className='mt-4 text-sm [color:var(--brand-plane-muted)]'>
            {t('Stable access, clear usage.')}
          </p>
        </div>

        <div className={authLayoutClasses.brandFooter}>{displayHost}</div>

        <div
          aria-hidden='true'
          className={`${authLayoutClasses.brandTone} [background:var(--brand-plane-depth)]`}
        />
      </aside>

      {/* Work surface: the form is the only primary task. */}
      <main className={authLayoutClasses.workSurface}>
        <div className='absolute top-5 right-5 hidden items-center gap-1.5 lg:flex'>
          <Button
            variant='outline'
            size='icon'
            className='bg-background/90 size-11'
            aria-label={t('Back to Home')}
            title={t('Back to Home')}
            render={<Link to='/' />}
          >
            <ArrowLeft aria-hidden='true' />
          </Button>
          <LanguageSwitcher className='border-border bg-background/90 size-11 border' />
          <ThemeSwitch className='border-border bg-background/90 size-11 border' />
        </div>

        <div className={authLayoutClasses.content}>{children}</div>
      </main>
    </div>
  )
}
