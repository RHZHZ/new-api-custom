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
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

export function HowItWorks() {
  const { t } = useTranslation()
  const steps = [
    {
      number: '01',
      title: t('Create API Key'),
      description: t('Create an API key to unlock the real request'),
      result: t('API Key created successfully'),
    },
    {
      number: '02',
      title: t('Switch the endpoint'),
      description: t(
        'Use our unified OpenAI-compatible endpoint in your applications'
      ),
      result: t('Applications connected'),
    },
    {
      number: '03',
      title: t('Request'),
      description: t('Choose a supported model and send your first request.'),
      result: t('Request completed'),
    },
  ]

  return (
    <section
      aria-labelledby='enterprise-delivery-title'
      className='bg-[#0D271C] px-5 py-[72px] text-white md:px-10 md:py-[112px]'
    >
      <div className='mx-auto max-w-[1248px]'>
        <AnimateInView className='grid gap-8 border-t border-white/18 pt-5 md:grid-cols-[180px_1fr]'>
          <p className='text-[10px] font-semibold text-[#93D2AD]'>03 / API</p>
          <div>
            <h2
              id='enterprise-delivery-title'
              className='max-w-4xl text-3xl leading-[1.1] font-semibold md:text-[52px]'
            >
              {t('Three steps to your first model request')}
            </h2>
            <p className='mt-6 max-w-2xl text-base leading-8 text-white/56'>
              {t('Start with the familiar OpenAI-compatible workflow.')}
            </p>
          </div>
        </AnimateInView>

        <ol className='mt-16 border-l border-white/18 md:grid md:grid-cols-3 md:border-t md:border-l-0'>
          {steps.map((step, index) => (
            <AnimateInView
              key={step.number}
              delay={index * 100}
              as='li'
              className='relative min-h-64 px-7 pb-12 last:pb-0 md:border-r md:border-white/10 md:px-8 md:pt-8 md:pb-0 md:first:pl-0 md:last:border-r-0 md:last:pr-0'
            >
              <span className='absolute top-0 -left-[4px] size-2 bg-[#93D2AD] md:-top-[4px] md:left-8 first:md:left-0' />
              <span className='text-xs font-semibold text-white/40 tabular-nums'>
                {step.number}
              </span>
              <h3 className='mt-8 text-xl font-semibold'>{step.title}</h3>
              <p className='mt-4 max-w-sm text-sm leading-7 text-white/52'>
                {step.description}
              </p>
              <p className='mt-8 inline-flex border border-[#93D2AD]/35 px-3 py-2 text-[10px] font-semibold text-[#93D2AD]'>
                {step.result}
              </p>
            </AnimateInView>
          ))}
        </ol>
      </div>
    </section>
  )
}
