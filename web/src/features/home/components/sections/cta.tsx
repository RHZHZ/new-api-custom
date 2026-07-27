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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section
      aria-labelledby='enterprise-cta-title'
      className='border-border border-b bg-[#F1F0EA] px-5 py-[72px] md:px-10 md:py-[112px] dark:bg-[#101512]'
    >
      <AnimateInView className='mx-auto max-w-[1248px] border-t border-black/18 pt-5 dark:border-white/18'>
        <div className='grid gap-8 md:grid-cols-[180px_1fr]'>
          <span className='text-[10px] font-semibold text-[#164A35] dark:text-[#93D2AD]'>
            04 / RAPI
          </span>
          <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end'>
            <div className='max-w-3xl'>
              <h2
                id='enterprise-cta-title'
                className='text-4xl leading-[1.08] font-semibold sm:text-[48px] md:text-[56px]'
              >
                {t('Start calling supported models with RAPI')}
              </h2>
              <p className='mt-7 max-w-2xl text-base leading-8 text-black/56 dark:text-white/56'>
                {t('One endpoint, one key, and a clear view of every request.')}
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row lg:shrink-0'>
              <Button
                className='group h-11 rounded-[2px] bg-[#164A35] px-5 text-sm font-semibold text-white hover:bg-[#103B2A] dark:bg-[#93D2AD] dark:text-[#102018] dark:hover:bg-[#A5DEBD]'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight
                  aria-hidden='true'
                  className='ml-1.5 size-4 transition-transform group-hover:translate-x-0.5'
                />
              </Button>
              <Button
                variant='outline'
                className='h-11 rounded-[2px] border-black/20 bg-transparent px-5 text-sm font-semibold dark:border-white/20'
                render={<Link to='/pricing' />}
              >
                {t('View Pricing')}
              </Button>
            </div>
          </div>
        </div>
      </AnimateInView>
    </section>
  )
}
