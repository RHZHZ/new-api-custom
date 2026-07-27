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
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ErrorPageProps = {
  /** HTTP status code — auxiliary visual, never the page title (16.7). */
  code: number | string
  /** Real, human-readable error title rendered as the page `h1`. */
  title: string
  description: string
  /** Recovery actions — every button must have a real behavior (16.7). */
  actions?: ReactNode
  /** Extra note (e.g. issue-report hint) rendered below the description. */
  note?: ReactNode
  /**
   * Embedded shell: used when the error renders inside the app layout —
   * it must not claim the full viewport again (16.7).
   */
  minimal?: boolean
  className?: string
}

/**
 * Shared error content (enterprise site theme 16.7): one component for
 * 401/403/404/500/503 and embedded errors. Status code is a quiet label,
 * the actual error title is the `h1`, copy wraps naturally (no forced
 * line breaks), and there are no illustrations or humor.
 */
export function ErrorPage(props: ErrorPageProps) {
  return (
    <div
      className={cn(
        'w-full',
        props.minimal ? 'py-16' : 'flex min-h-svh items-center justify-center',
        props.className
      )}
    >
      <div className='mx-auto flex w-full max-w-md flex-col items-center gap-3 px-6 text-center'>
        <span className='text-muted-foreground border-border rounded-md border px-2 py-0.5 font-mono text-xs font-semibold tracking-wider'>
          {props.code}
        </span>
        <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
          {props.title}
        </h1>
        <p className='text-muted-foreground text-[15px] leading-6'>
          {props.description}
        </p>
        {props.note && (
          <p className='text-muted-foreground/80 text-sm leading-5'>
            {props.note}
          </p>
        )}
        {props.actions && (
          <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
            {props.actions}
          </div>
        )}
      </div>
    </div>
  )
}
