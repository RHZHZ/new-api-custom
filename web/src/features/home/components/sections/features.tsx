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
  ChartNoAxesCombined,
  Network,
  ShieldCheck,
  Waypoints,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()
  const features = [
    {
      number: '01',
      title: t('Unified access'),
      description: t(
        'Use one compatible endpoint to access supported models without changing SDKs.'
      ),
      outcome: t(
        'Use our unified OpenAI-compatible endpoint in your applications'
      ),
      icon: (
        <Network aria-hidden='true' className='size-5' strokeWidth={1.75} />
      ),
    },
    {
      number: '02',
      title: t('Resilient routing'),
      description: t(
        'Requests are routed across available services to improve call stability.'
      ),
      outcome: t('Stable model calls'),
      icon: (
        <Waypoints aria-hidden='true' className='size-5' strokeWidth={1.75} />
      ),
    },
    {
      number: '03',
      title: t('API Key'),
      description: t(
        'Create separate keys for your projects and keep credentials under your control.'
      ),
      outcome: t('Authentication'),
      icon: (
        <ShieldCheck aria-hidden='true' className='size-5' strokeWidth={1.75} />
      ),
    },
    {
      number: '04',
      title: t('Usage'),
      description: t('Monitor balance, usage, and request volume'),
      outcome: t('Clear usage and balance'),
      icon: (
        <ChartNoAxesCombined
          aria-hidden='true'
          className='size-5'
          strokeWidth={1.75}
        />
      ),
    },
  ]

  return (
    <section
      aria-labelledby='enterprise-capabilities-title'
      className='border-border border-b bg-[#F1F0EA] px-5 py-[72px] md:px-10 md:py-[112px] dark:bg-[#101512]'
    >
      <div className='mx-auto max-w-[1248px]'>
        <AnimateInView className='grid gap-8 border-t border-black/18 pt-5 md:grid-cols-[180px_1fr] dark:border-white/18'>
          <p className='text-[10px] font-semibold text-[#164A35] dark:text-[#93D2AD]'>
            02 / {t('Core capabilities')}
          </p>
          <div>
            <h2
              id='enterprise-capabilities-title'
              className='max-w-4xl text-3xl leading-[1.1] font-semibold md:text-[52px]'
            >
              {t('Everything you need to start calling models')}
            </h2>
            <p className='mt-6 max-w-2xl text-base leading-8 text-black/56 dark:text-white/56'>
              {t('One endpoint, one key, and a clear view of every request.')}
            </p>
          </div>
        </AnimateInView>

        <div className='mt-16 grid border-t border-l border-black/18 md:grid-cols-2 dark:border-white/18'>
          {features.map((feature, index) => (
            <AnimateInView
              key={feature.number}
              delay={index * 70}
              className='group relative min-h-[300px] border-r border-b border-black/18 p-7 transition-colors hover:bg-white/45 md:p-9 dark:border-white/18 dark:hover:bg-white/[0.03]'
            >
              <div className='flex items-start justify-between'>
                <span className='text-[10px] font-semibold text-black/34 tabular-nums dark:text-white/34'>
                  {feature.number}
                </span>
                <span className='text-[#164A35] dark:text-[#93D2AD]'>
                  {feature.icon}
                </span>
              </div>
              <h3 className='mt-16 text-xl font-semibold'>{feature.title}</h3>
              <p className='mt-4 max-w-md text-sm leading-7 text-black/54 dark:text-white/54'>
                {feature.description}
              </p>
              <p className='mt-8 border-t border-black/12 pt-4 text-[11px] font-semibold text-[#164A35] dark:border-white/12 dark:text-[#93D2AD]'>
                {feature.outcome}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
