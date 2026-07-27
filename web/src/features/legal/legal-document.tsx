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
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FileWarning } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'

import type { LegalDocumentResponse } from './types'

type LegalDocumentProps = {
  title: string
  queryKey: string
  fetchDocument: () => Promise<LegalDocumentResponse>
  emptyMessage: string
}

export function LegalDocument({
  title,
  queryKey,
  fetchDocument,
  emptyMessage,
}: LegalDocumentProps) {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchDocument,
    staleTime: 10 * 60 * 1000,
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)
  const success = data?.success ?? false

  if (isLoading) {
    return (
      <PublicLayout>
        <div className='mx-auto flex max-w-[800px] flex-col gap-4 py-12'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </PublicLayout>
    )
  }

  if (!success || !hasContent) {
    // Unconfigured document (16.7): clear title, reason and a return
    // entry in one open section — no card-in-card presentation.
    return (
      <PublicLayout>
        <div className='mx-auto max-w-[800px] py-12'>
          <div className='border-border rounded-md border px-6 py-10 text-center'>
            <div className='bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-md'>
              <FileWarning className='size-5' />
            </div>
            <h1 className='text-foreground mt-4 text-xl font-semibold'>
              {title}
            </h1>
            <p className='text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6'>
              {data?.message || emptyMessage}
            </p>
            <Button variant='outline' className='mt-5' render={<Link to='/' />}>
              {t('Back to Home')}
            </Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (isUrl) {
    return (
      <PublicLayout>
        <div className='mx-auto max-w-[800px] py-12'>
          <div className='border-border rounded-md border px-6 py-10'>
            <h1 className='text-foreground text-xl font-semibold'>{title}</h1>
            <p className='text-muted-foreground mt-2 text-sm leading-6'>
              {t(
                'The administrator configured an external link for this document.'
              )}
            </p>
            <Button
              className='mt-5'
              render={
                <a
                  href={rawContent}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              }
            >
              {t('View document')}
            </Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={!contentIsHtml}>
      {contentIsHtml ? (
        <div className='pt-16 md:pt-[72px]'>
          <RichContent
            mode='html'
            htmlVariant='isolated'
            content={rawContent}
          />
        </div>
      ) : (
        // Reading column at 760–820px with a stable heading level (16.7).
        <div className='mx-auto max-w-[800px] space-y-6 py-12'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight'>{title}</h1>
          </div>

          <RichContent
            mode='markdown'
            content={rawContent}
            className='prose-neutral dark:prose-invert max-w-none'
          />
        </div>
      )}
    </PublicLayout>
  )
}
