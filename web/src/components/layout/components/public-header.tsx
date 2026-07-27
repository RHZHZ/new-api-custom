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
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@/components/dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { HeaderLogo } from './header-logo'

const AUTH_PROMPT_SECONDS = 5

type AuthPromptTarget = {
  title: string
  href: string
}

export interface PublicHeaderProps {
  navLinks?: TopNavLink[]
  mobileLinks?: TopNavLink[]
  navContent?: React.ReactNode
  /**
   * Explicit layout variant (enterprise site theme 16.6). `home` keeps the
   * tall editorial masthead of the landing page; `page` (default) renders
   * the stable inner-page bar: 64px on mobile, 72px on desktop, with no
   * height change on scroll. Never inferred from site name, logo, or URL.
   */
  variant?: 'home' | 'page'
  /**
   * Brand rendering. `wordmark` draws the site name as a typographic
   * wordmark with descriptor (RAPI style); `system` (default) keeps the
   * configured logo image + name.
   */
  brandStyle?: 'wordmark' | 'system'
  /**
   * Header container width. `wide` (1440px) is for full-bleed comparison /
   * analysis pages so page content and header edges stay aligned (16.5).
   */
  contentWidth?: 'default' | 'wide'
  showThemeSwitch?: boolean
  showLanguageSwitcher?: boolean
  logo?: React.ReactNode
  siteName?: string
  homeUrl?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  showNavigation?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  className?: string
}

export function PublicHeader(props: PublicHeaderProps) {
  const {
    navLinks = defaultTopNavLinks,
    variant = 'page',
    brandStyle = 'system',
    contentWidth = 'default',
    showThemeSwitch = true,
    showLanguageSwitcher = true,
    logo: customLogo,
    siteName: customSiteName,
    homeUrl = '/',
    showAuthButtons = true,
    showNotifications = true,
  } = props

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authPromptTarget, setAuthPromptTarget] =
    useState<AuthPromptTarget | null>(null)
  const [authPromptSecondsLeft, setAuthPromptSecondsLeft] =
    useState(AUTH_PROMPT_SECONDS)
  const { auth } = useAuthStore()
  const {
    systemName,
    logo: systemLogo,
    loading,
    logoLoaded,
  } = useSystemConfig()
  const dynamicLinks = useTopNavLinks()
  const notifications = useNotifications()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const user = auth.user
  const isAuthenticated = !!user
  const displaySiteName = customSiteName || systemName
  const isHome = variant === 'home'
  const useWordmark = brandStyle === 'wordmark'
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!authPromptTarget) return

    const intervalId = window.setInterval(() => {
      setAuthPromptSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    const timeoutId = window.setTimeout(() => {
      const redirect = authPromptTarget.href
      setAuthPromptTarget(null)
      navigate({ to: '/sign-in', search: { redirect } })
    }, AUTH_PROMPT_SECONDS * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [authPromptTarget, navigate])

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null)
    setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
  }, [])

  const navigateToSignIn = useCallback(() => {
    const redirect = authPromptTarget?.href || '/'
    setAuthPromptTarget(null)
    navigate({ to: '/sign-in', search: { redirect } })
  }, [authPromptTarget?.href, navigate])

  const handleNavLinkClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      link: TopNavLink,
      closeMobile = false
    ) => {
      if (link.disabled) {
        event.preventDefault()
        return
      }

      if (link.requiresAuth) {
        event.preventDefault()
        if (closeMobile) {
          setMobileOpen(false)
        }
        setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
        setAuthPromptTarget({
          title: t(link.title),
          href: link.href,
        })
        return
      }

      if (closeMobile) {
        setMobileOpen(false)
      }
    },
    [t]
  )

  let headerLogo: React.ReactNode = (
    <HeaderLogo
      src={systemLogo}
      loading={loading}
      logoLoaded={logoLoaded}
      className='size-full rounded-lg object-contain'
    />
  )
  if (loading) {
    headerLogo = <Skeleton className='size-full rounded-lg' />
  } else if (customLogo) {
    headerLogo = customLogo
  }

  let desktopAuthControl: React.ReactNode = (
    <Button
      size='sm'
      className={cn(
        'text-xs font-medium',
        isHome
          ? 'h-10 rounded-none bg-[#93D2AD] px-5 text-[#102018] hover:bg-[#A5DEBD]'
          : 'bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-4'
      )}
      render={<Link to='/sign-in' />}
    >
      {t('Sign in')}
    </Button>
  )
  if (loading) {
    desktopAuthControl = <Skeleton className='h-8 w-20 rounded-lg' />
  } else if (isAuthenticated) {
    desktopAuthControl = <ProfileDropdown />
  }

  /*
   * Heights (16.6): the landing masthead keeps its tall unscrolled state;
   * inner pages hold a stable 64px (mobile) / 72px (desktop) bar and only
   * gain a shadow on scroll — no height morphing, no floating pill.
   */
  let headerHeightClass = 'h-16 md:h-[72px]'
  if (isHome) {
    headerHeightClass = scrolled ? 'h-16' : 'h-16 md:h-[104px]'
  }

  return (
    <>
      <header
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl',
          isHome
            ? 'border-white/10 bg-[#0A130E]/92'
            : 'border-border/70 bg-background/90'
        )}
      >
        <div
          className={cn(
            'pointer-events-auto mx-auto px-5 transition-all duration-300 md:px-10',
            isHome && 'max-w-[1536px] lg:px-14 xl:px-14',
            !isHome &&
              (contentWidth === 'wide' ? 'max-w-[1440px]' : 'max-w-[1184px]'),
            scrolled && 'shadow-[0_8px_28px_-28px_rgb(20_31_23/70%)]'
          )}
        >
          <nav
            className={cn(
              'flex items-center justify-between px-0 transition-all duration-300',
              headerHeightClass
            )}
          >
            {/* Logo */}
            <Link
              to={homeUrl}
              className='group flex shrink-0 items-center gap-2.5'
            >
              {useWordmark ? (
                <>
                  <span
                    className={cn(
                      'leading-none font-semibold',
                      isHome
                        ? 'text-[#93D2AD]'
                        : 'text-[#164A35] dark:text-[#93D2AD]',
                      isHome
                        ? 'text-[30px] md:text-[38px]'
                        : 'text-[26px] md:text-[28px]'
                    )}
                  >
                    {displaySiteName}
                  </span>
                  <span
                    className={cn(
                      'hidden max-w-32 border-l pl-3 text-[10px] leading-[1.2] font-semibold uppercase lg:block',
                      isHome
                        ? 'border-white/25 text-white/70'
                        : 'border-black/20 dark:border-white/20'
                    )}
                  >
                    {t('Unified model API service')}
                  </span>
                </>
              ) : (
                <>
                  <div className='flex size-7 shrink-0 items-center justify-center'>
                    {headerLogo}
                  </div>
                  <span className='text-sm font-semibold tracking-tight'>
                    {loading ? (
                      <Skeleton className='h-4 w-16' />
                    ) : (
                      displaySiteName
                    )}
                  </span>
                </>
              )}
            </Link>

            {/* Desktop nav */}
            <div
              className={cn(
                'hidden items-center gap-0.5 md:flex',
                isHome && 'text-white/85 [&_button]:text-white/85'
              )}
            >
              {links.map((link) => {
                const isActive = pathname === link.href
                if (link.external) {
                  return (
                    <a
                      key={`${link.href}:${link.title}`}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-disabled={link.disabled}
                      tabIndex={link.disabled ? -1 : undefined}
                      onClick={(event) => handleNavLinkClick(event, link)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200',
                        isHome
                          ? 'text-white/65 hover:text-white'
                          : 'text-muted-foreground hover:text-foreground',
                        link.disabled && 'pointer-events-none opacity-50'
                      )}
                    >
                      {t(link.title)}
                    </a>
                  )
                }
                let linkStateClass = isHome
                  ? 'text-white/65 hover:text-white'
                  : 'text-muted-foreground hover:text-foreground'
                if (isActive) {
                  linkStateClass = isHome ? 'text-white' : 'text-foreground'
                }

                return (
                  <Link
                    key={`${link.href}:${link.title}`}
                    to={link.href}
                    disabled={link.disabled}
                    onClick={(event) => handleNavLinkClick(event, link)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200',
                      isActive && 'relative',
                      linkStateClass,
                      link.disabled && 'pointer-events-none opacity-50'
                    )}
                  >
                    {t(link.title)}
                    {/* Inner pages mark the current route with a baseline
                        bar on the header edge (16.6) — text plus edge state,
                        never a pill background. */}
                    {isActive && !isHome && (
                      <span
                        aria-hidden='true'
                        className='bg-primary absolute inset-x-3 -bottom-4 h-0.5 md:-bottom-5'
                      />
                    )}
                  </Link>
                )
              })}

              {(showLanguageSwitcher ||
                showThemeSwitch ||
                showNotifications) && (
                <div
                  className={cn(
                    'mx-2 h-4 w-px',
                    isHome ? 'bg-white/20' : 'bg-border/40'
                  )}
                />
              )}

              {showLanguageSwitcher && <LanguageSwitcher />}
              {showThemeSwitch && <ThemeSwitch />}
              {showNotifications && (
                <NotificationPopover
                  open={notifications.popoverOpen}
                  onOpenChange={notifications.setPopoverOpen}
                  unreadCount={notifications.unreadCount}
                  activeTab={notifications.activeTab}
                  onTabChange={notifications.setActiveTab}
                  notice={notifications.notice}
                  announcements={notifications.announcements}
                  loading={notifications.loading}
                />
              )}

              {showAuthButtons && (
                <>
                  <div
                    className={cn(
                      'mx-1 h-4 w-px',
                      isHome ? 'bg-white/20' : 'bg-border/40'
                    )}
                  />
                  {desktopAuthControl}
                </>
              )}
            </div>

            {/* Mobile: compact actions + hamburger */}
            <div
              className={cn(
                'flex items-center gap-1 md:hidden',
                isHome && 'text-white/85 [&_button]:text-white/85'
              )}
            >
              {showThemeSwitch && <ThemeSwitch className='size-11' />}
              {showAuthButtons && !loading && isAuthenticated && (
                <ProfileDropdown />
              )}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-11'
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={t('Toggle navigation menu')}
                aria-expanded={mobileOpen}
                aria-controls='public-mobile-navigation'
              >
                <div className='relative size-4'>
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-[7px] rotate-45' : 'top-[3px]'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 top-[7px] block h-[1.5px] rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'scale-x-0 opacity-0' : 'opacity-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-[7px] -rotate-45' : 'top-[11px]'
                    )}
                  />
                </div>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        id='public-mobile-navigation'
        className={cn(
          'bg-background/98 fixed inset-0 z-40 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:pointer-events-none md:hidden',
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
      >
        <div className='flex h-full flex-col justify-between px-8 pt-20 pb-10'>
          <nav className='flex flex-col gap-1'>
            {links.map((link, i) => {
              const isActive = pathname === link.href
              const linkClassName = cn(
                'flex items-center gap-3 py-3 text-base font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                mobileOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0',
                isActive ? 'text-foreground' : 'text-muted-foreground',
                link.disabled && 'pointer-events-none opacity-50'
              )
              const transitionStyle = {
                transitionDelay: mobileOpen ? `${100 + i * 50}ms` : '0ms',
              }
              if (link.external) {
                return (
                  <a
                    key={`${link.href}:${link.title}`}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-disabled={link.disabled}
                    tabIndex={link.disabled ? -1 : undefined}
                    onClick={(event) => handleNavLinkClick(event, link, true)}
                    className={linkClassName}
                    style={transitionStyle}
                  >
                    {t(link.title)}
                  </a>
                )
              }
              return (
                <Link
                  key={`${link.href}:${link.title}`}
                  to={link.href}
                  disabled={link.disabled}
                  onClick={(event) => handleNavLinkClick(event, link, true)}
                  className={linkClassName}
                  style={transitionStyle}
                >
                  {t(link.title)}
                </Link>
              )
            })}
          </nav>

          <div
            className={cn(
              'flex flex-col gap-3 transition-all duration-500',
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
            style={{ transitionDelay: mobileOpen ? '250ms' : '0ms' }}
          >
            {showAuthButtons && (
              <Link
                to={isAuthenticated ? '/dashboard' : '/sign-in'}
                onClick={() => setMobileOpen(false)}
                className='bg-foreground text-background inline-flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80'
              >
                {isAuthenticated ? t('Go to Dashboard') : t('Sign in')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!authPromptTarget}
        onOpenChange={(open) => {
          if (!open) {
            closeAuthPrompt()
          }
        }}
        title={t('Sign in required')}
        description={t('Please sign in to view {{module}}.', {
          module: authPromptTarget?.title || '',
        })}
        contentClassName='sm:max-w-md'
        contentHeight='auto'
        footer={
          <>
            <Button variant='outline' onClick={closeAuthPrompt}>
              {t('Cancel')}
            </Button>
            <Button onClick={navigateToSignIn}>{t('Sign in now')}</Button>
          </>
        }
      >
        <div className='bg-muted/40 text-muted-foreground rounded-lg px-3 py-2 text-sm'>
          {t('Redirecting to sign in in {{seconds}} seconds.', {
            seconds: authPromptSecondsLeft,
          })}
        </div>
      </Dialog>
    </>
  )
}
