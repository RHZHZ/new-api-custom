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
import {
  Activity,
  AudioLines,
  Braces,
  FileText,
  Image as ImageIcon,
  KeyRound,
  Route,
  Video,
  WalletCards,
  Wrench,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { heroTerminalDemoLayoutClasses } from './hero-terminal-demo-layout'

interface HeroTerminalDemoProps {
  className?: string
}

export function HeroTerminalDemo(props: HeroTerminalDemoProps) {
  const { t } = useTranslation()
  const sources = [
    { label: t('Text'), icon: FileText },
    { label: t('Image'), icon: ImageIcon },
    { label: t('Audio'), icon: AudioLines },
    { label: t('Video'), icon: Video },
    { label: t('Tools'), icon: Wrench },
  ]
  const capabilities = [
    {
      label: t('Unified access'),
      detail: t(
        'Use our unified OpenAI-compatible endpoint in your applications'
      ),
      icon: KeyRound,
    },
    {
      label: t('Authentication'),
      detail: t('API Key'),
      icon: KeyRound,
    },
    {
      label: t('Status'),
      detail: t('Stable model calls'),
      icon: Route,
    },
    {
      label: t('Usage'),
      detail: t('Monitor balance, usage, and request volume'),
      icon: Route,
    },
  ]
  const mobileCapabilities = [
    {
      label: t('Unified API access'),
      detail: t('Call multiple model types through one compatible API.'),
      icon: Braces,
    },
    {
      label: t('API Key'),
      detail: t('Create keys by project and keep control of your credentials.'),
      icon: KeyRound,
    },
    {
      label: t('Stable calls'),
      detail: t('See model availability clearly and call with confidence.'),
      icon: Activity,
    },
    {
      label: t('Usage and balance'),
      detail: t('View your balance, usage, and request history at any time.'),
      icon: WalletCards,
    },
  ]
  const endpoints = sources

  return (
    <div
      className={cn(
        heroTerminalDemoLayoutClasses.container,
        'text-[#F1F4F1]',
        props.className
      )}
    >
      <section
        aria-label='RAPI API'
        data-rapi-architecture='mobile'
        className={heroTerminalDemoLayoutClasses.mobileArchitecture}
      >
        <ul
          aria-label={t('Models')}
          tabIndex={0}
          className={heroTerminalDemoLayoutClasses.mobileModelRail}
          onKeyDown={(event) => {
            if (
              event.currentTarget.scrollWidth <=
                event.currentTarget.clientWidth ||
              (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
            ) {
              return
            }

            event.preventDefault()
            event.currentTarget.scrollLeft +=
              event.key === 'ArrowRight' ? 68 : -68
          }}
        >
          {sources.map((source) => {
            const Icon = source.icon
            return (
              <li
                key={source.label}
                className={heroTerminalDemoLayoutClasses.mobileModelItem}
              >
                <Icon aria-hidden='true' className='size-5' strokeWidth={1.4} />
                <span className='text-center text-xs leading-4 font-semibold'>
                  {source.label}
                </span>
              </li>
            )
          })}
        </ul>

        <div className={heroTerminalDemoLayoutClasses.mobileApiBand}>
          RAPI API
        </div>

        <dl className={heroTerminalDemoLayoutClasses.mobileCapabilityGrid}>
          {mobileCapabilities.map((capability, index) => {
            const Icon = capability.icon
            return (
              <div
                key={capability.label}
                className={cn(
                  heroTerminalDemoLayoutClasses.mobileCapability,
                  index < 2 && 'border-b border-[#176B47]',
                  index % 2 === 0 && 'border-r border-[#176B47]'
                )}
              >
                <Icon
                  aria-hidden='true'
                  className='size-[22px] text-[#93D2AD]'
                  strokeWidth={1.5}
                />
                <dt
                  className={
                    heroTerminalDemoLayoutClasses.mobileCapabilityTitle
                  }
                >
                  {capability.label}
                </dt>
                <dd
                  className={
                    heroTerminalDemoLayoutClasses.mobileCapabilityDetail
                  }
                >
                  {capability.detail}
                </dd>
              </div>
            )
          })}
        </dl>
      </section>

      <div
        data-rapi-architecture='desktop'
        className={heroTerminalDemoLayoutClasses.desktopArchitecture}
      >
        <div className='grid sm:grid-cols-[126px_minmax(0,1fr)]'>
          <div className='flex items-center bg-[#111613] px-5 py-4 text-[11px] font-semibold text-white sm:py-0'>
            {t('Models')}
          </div>
          <div className='grid grid-cols-3 border border-white/18 bg-white/[0.05] sm:grid-cols-5'>
            {sources.map((source) => {
              const Icon = source.icon
              return (
                <div
                  key={source.label}
                  className='flex min-h-24 flex-col items-center justify-center gap-2 border-r border-white/10 px-2 py-3 last:border-r-0'
                >
                  <Icon
                    aria-hidden='true'
                    className='size-5'
                    strokeWidth={1.4}
                  />
                  <span className='text-center text-[9px] font-semibold'>
                    {source.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className='ml-[126px] hidden h-8 grid-cols-5 sm:grid'>
          {sources.map((source) => (
            <div key={source.label} className='relative flex justify-center'>
              <span className='h-full w-px bg-[#176B47]/55' />
              <span className='absolute top-0 size-1.5 -translate-y-1/2 bg-[#176B47]' />
              <span className='absolute bottom-0 size-1.5 translate-y-1/2 bg-[#176B47]' />
            </div>
          ))}
        </div>

        <div className='grid sm:grid-cols-[126px_minmax(0,1fr)]'>
          <div className='flex min-h-24 items-center justify-center bg-[#0F5239] px-5 py-5 text-center text-sm leading-5 font-semibold text-white sm:min-h-[380px]'>
            RAPI
            <br />
            API
          </div>
          <div className='flex h-full flex-col border border-[#2E5A45] bg-[#0E1A13]/90 px-5 py-6'>
            <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
              {capabilities.map((capability) => {
                const Icon = capability.icon
                return (
                  <div key={capability.label} className='text-center'>
                    <Icon
                      aria-hidden='true'
                      className='mx-auto size-6 text-[#93D2AD]'
                      strokeWidth={1.4}
                    />
                    <p className='mt-4 text-[10px] font-bold uppercase'>
                      {capability.label}
                    </p>
                    <p className='mt-2 text-[10px] leading-4 text-white/55'>
                      {capability.detail}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className='mt-6 border-t border-white/12 pt-4'>
              <p className='text-center text-[9px] font-bold text-[#93D2AD] uppercase'>
                {t('Authentication')}
              </p>
              <div className='mt-3 grid grid-cols-4 divide-x divide-white/12 text-center text-[9px]'>
                {[t('API Key'), t('Quota'), t('Balance'), t('Billing')].map(
                  (item) => (
                    <span key={item} className='px-1'>
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className='mt-auto border-t border-white/12 pt-4'>
              <p className='text-center text-[9px] font-bold text-[#93D2AD] uppercase'>
                {t('Usage')}
              </p>
              <div className='mt-3 grid grid-cols-4 divide-x divide-white/12 text-center text-[9px]'>
                {[t('Status'), t('Logs'), t('Models'), t('Requests')].map(
                  (item) => (
                    <span key={item} className='px-1'>
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='ml-[126px] hidden h-8 grid-cols-5 sm:grid'>
          {endpoints.map((endpoint) => (
            <div key={endpoint.label} className='relative flex justify-center'>
              <span className='h-full w-px bg-[#176B47]/55' />
              <span className='absolute top-0 size-1.5 -translate-y-1/2 bg-[#176B47]' />
              <span className='absolute bottom-0 size-1.5 translate-y-1/2 bg-[#176B47]' />
            </div>
          ))}
        </div>

        <div className='grid sm:grid-cols-[126px_minmax(0,1fr)]'>
          <div className='flex items-center bg-[#111613] px-5 py-4 text-[11px] font-semibold text-white sm:py-0'>
            API
          </div>
          <div className='grid grid-cols-3 border border-white/18 bg-white/[0.05] sm:grid-cols-5'>
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon
              return (
                <div
                  key={endpoint.label}
                  className='flex min-h-24 flex-col items-center justify-center gap-2 border-r border-white/10 px-2 py-3 last:border-r-0'
                >
                  <Icon
                    aria-hidden='true'
                    className='size-5'
                    strokeWidth={1.4}
                  />
                  <span className='text-center text-[9px] font-semibold'>
                    {endpoint.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
