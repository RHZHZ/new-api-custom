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
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

import { HeroTerminalDemo } from '../hero-terminal-demo'
import { ParticleField } from '../particle-field'

const HERO_CAPTION_KEYS = [
  'AI is changing the world',
  'Use RAPI to make every day more efficient',
] as const

/** Floating cinematic captions cycling over the dark hero scene (§3.3). */
function CinematicCaptions() {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % HERO_CAPTION_KEYS.length),
      4200
    )
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <div aria-live='polite' className='relative mt-10 h-6 overflow-hidden'>
      {HERO_CAPTION_KEYS.map((key, i) => (
        <p
          key={key}
          className={cn(
            'absolute inset-x-0 text-[13px] font-semibold tracking-[0.2em] text-[#93D2AD]/85 uppercase transition-all duration-700',
            i === index ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          )}
        >
          {t(key)}
        </p>
      ))}
    </div>
  )
}

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'
  const isExternalDocs = docsUrl.startsWith('http')
  const proofPoints = [
    {
      label: 'API',
      detail: t(
        'Use our unified OpenAI-compatible endpoint in your applications'
      ),
    },
    {
      label: t('API Key'),
      detail: t(
        'Create separate keys for your projects and keep credentials under your control.'
      ),
    },
    {
      label: t('Status'),
      detail: t('Stable model calls'),
    },
    {
      label: t('Usage'),
      detail: t('Clear usage and balance'),
    },
  ]

  return (
    <section
      aria-labelledby='enterprise-hero-title'
      className='border-border relative z-10 border-b bg-[#0A130E] pt-16 md:pt-[104px]'
    >
      {/* Row 1: copy on the left, the 3D Earth as the featured right visual.
          The globe canvas spans this row only (doc §3.3, fifth revision). */}
      <div className='relative'>
        <ParticleField />
        {/* Soften the cut where orbit rings meet the row's bottom edge. */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0A130E]'
        />
        <div className='relative mx-auto grid max-w-[1536px] lg:grid-cols-[minmax(420px,0.82fr)_minmax(620px,1.18fr)]'>
          <div className='flex flex-col px-5 py-10 md:min-h-[620px] md:px-10 md:py-14 lg:min-h-[720px] lg:px-14 xl:px-16'>
            <div className='mt-8 lg:mt-12'>
              <p
                aria-hidden='true'
                className='landing-animate-fade-up text-[78px] leading-[0.9] font-semibold text-[#93D2AD] opacity-0 sm:text-[104px] lg:text-[120px] xl:text-[144px]'
                style={{ animationDelay: '70ms' }}
              >
                RAPI
              </p>
              <h1
                id='enterprise-hero-title'
                className='landing-animate-fade-up mt-6 max-w-[560px] text-[34px] leading-[1.1] font-medium text-white opacity-0 sm:text-[42px] lg:text-[46px]'
                style={{ animationDelay: '100ms' }}
              >
                {t('Unified model API service')}
              </h1>
              <p
                className='landing-animate-fade-up mt-8 max-w-[540px] border-t border-[#2E5A45] pt-7 text-base leading-8 text-white/65 opacity-0'
                style={{ animationDelay: '140ms' }}
              >
                {t(
                  'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.'
                )}
              </p>

              <div
                className='landing-animate-fade-up mt-8 flex flex-col gap-3 opacity-0 sm:flex-row sm:items-center'
                style={{ animationDelay: '180ms' }}
              >
                <Button
                  className='group h-12 rounded-none bg-[#93D2AD] px-6 text-sm font-semibold text-[#102018] hover:bg-[#A5DEBD]'
                  render={
                    <Link
                      to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                    />
                  }
                >
                  {props.isAuthenticated
                    ? t('Go to Dashboard')
                    : t('Get Started')}
                  <ArrowRight
                    aria-hidden='true'
                    className='ml-1.5 size-4 transition-transform group-hover:translate-x-0.5'
                  />
                </Button>
                {!props.isAuthenticated && (
                  <Button
                    variant='outline'
                    className='h-12 rounded-none border-white/25 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white'
                    render={<Link to='/pricing' />}
                  >
                    {t('View Pricing')}
                  </Button>
                )}
                <Button
                  variant='ghost'
                  className='h-12 justify-start rounded-none px-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white sm:justify-center'
                  render={
                    isExternalDocs ? (
                      <a
                        href={docsUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      />
                    ) : (
                      <Link to={docsUrl} />
                    )
                  }
                >
                  <BookOpen aria-hidden='true' className='mr-1.5 size-4' />
                  {t('Read integration docs')}
                </Button>
              </div>

              <CinematicCaptions />
            </div>

            <div
              className='landing-animate-fade-up mt-auto hidden border-t border-white/15 pt-6 opacity-0 md:grid md:grid-cols-4'
              style={{ animationDelay: '220ms' }}
            >
              {proofPoints.map((proofPoint) => (
                <div
                  key={proofPoint.label}
                  className='border-r border-white/12 px-3 py-2 first:pl-0 even:border-r-0 md:last:border-r-0 md:even:border-r'
                >
                  <p className='text-[10px] font-bold text-[#93D2AD] uppercase'>
                    {proofPoint.label}
                  </p>
                  <p className='mt-2 text-[10px] leading-4 text-white/55'>
                    {proofPoint.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* The globe's stage: empty by design — on lg+ the canvas behind
              this grid draws the Earth here. Below lg the globe backs the
              headline instead, so no zone is reserved. */}
          <div aria-hidden='true' className='hidden lg:block' />
        </div>
      </div>

      {/* Row 2: the RAPI API control plane as a titled band of its own
          (§3.3 fifth revision moved it out of the first fold). */}
      <div className='relative border-t border-white/10 bg-[#0D1911]'>
        <div
          className='landing-animate-fade-up mx-auto w-full max-w-[1536px] px-5 py-12 opacity-0 md:px-10 md:py-14 lg:px-14 xl:px-16'
          style={{ animationDelay: '240ms' }}
        >
          <div className='mb-8 grid gap-4 md:mb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] md:items-end'>
            <div>
              <p className='text-[10px] font-bold tracking-[0.24em] text-[#93D2AD] uppercase'>
                RAPI API
              </p>
              <h2 className='mt-3 text-xl font-medium text-white sm:text-[26px]'>
                {t('How requests flow through RAPI')}
              </h2>
            </div>
            <div className='flex flex-col gap-3'>
              <p className='text-[13px] leading-6 text-white/55'>
                {t(
                  'One endpoint, one key, and a clear view of every request.'
                )}
              </p>
              <a
                href='https://cccc.asia'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-xs font-semibold text-[#75CD99] hover:text-[#9CE0B7]'
              >
                cccc.asia
                <ExternalLink aria-hidden='true' className='size-3.5' />
              </a>
            </div>
          </div>
          <div className='mx-auto w-full max-w-[1120px] border border-white/10 bg-[#0A130E]/60'>
            <HeroTerminalDemo />
          </div>
        </div>
      </div>

    </section>
  )
}
