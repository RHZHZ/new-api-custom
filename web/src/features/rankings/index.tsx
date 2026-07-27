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
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { PageTransition } from '@/components/page-transition'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import {
  MarketShareSection,
  ModelsSection,
  PulseSection,
  RankingsHero,
} from './components'
import { useRankings } from './hooks/use-rankings'
import type { RankingPeriod } from './types'

const VALID_PERIODS = new Set<RankingPeriod>(['today', 'week', 'month', 'year'])

export function Rankings() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/rankings/' })
  const navigate = useNavigate()

  const period: RankingPeriod = VALID_PERIODS.has(
    search.period as RankingPeriod
  )
    ? (search.period as RankingPeriod)
    : 'week'

  const rankingsQuery = useRankings(period)
  const snapshot = rankingsQuery.data?.data

  const handlePeriodChange = (next: RankingPeriod) => {
    navigate({
      to: '/rankings',
      search: (prev) => ({ ...prev, period: next }),
    })
  }

  let rankingsContent: ReactNode
  if (rankingsQuery.isLoading) {
    rankingsContent = <RankingsLoading />
  } else if (!snapshot) {
    const message =
      rankingsQuery.error instanceof Error
        ? rankingsQuery.error.message
        : t('Unable to load rankings data')
    rankingsContent = (
      <RankingsError
        message={message}
        onRetry={() => rankingsQuery.refetch()}
      />
    )
  } else {
    rankingsContent = (
      <>
        <ModelsSection
          history={snapshot.models_history}
          rows={snapshot.models}
          period={period}
        />

        <MarketShareSection
          history={snapshot.vendor_share_history}
          rows={snapshot.vendors}
          period={period}
        />

        <PulseSection
          movers={snapshot.top_movers}
          droppers={snapshot.top_droppers}
        />
      </>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      {/* Analysis canvas (16.7): no radial hero decoration; content starts
          below the fixed 64/72px public header. */}
      <PageTransition className='relative mx-auto w-full max-w-[1184px] space-y-8 px-5 pt-[88px] pb-10 md:px-10 md:pt-[104px] md:pb-12'>
        <RankingsHero period={period} onPeriodChange={handlePeriodChange} />

        {rankingsContent}
      </PageTransition>
    </PublicLayout>
  )
}

function RankingsLoading() {
  // Skeletons mirror the final chart canvas sizes (16.11).
  return (
    <div className='space-y-6'>
      <Skeleton className='h-[420px] w-full rounded-md' />
      <Skeleton className='h-[360px] w-full rounded-md' />
      <Skeleton className='h-[180px] w-full rounded-md' />
    </div>
  )
}

function RankingsError(props: { message: string; onRetry: () => void }) {
  const { t } = useTranslation()
  // Open bordered error region with a real retry entry (16.7) — no
  // large-radius dashed card.
  return (
    <div className='border-border rounded-md border px-6 py-12 text-center'>
      <h2 className='text-foreground text-base font-semibold'>
        {t('Unable to load rankings')}
      </h2>
      <p className='text-muted-foreground mx-auto mt-2 max-w-md text-sm'>
        {props.message}
      </p>
      <Button variant='outline' className='mt-5' onClick={props.onRetry}>
        {t('Retry')}
      </Button>
    </div>
  )
}
