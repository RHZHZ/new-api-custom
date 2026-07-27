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
import { Save } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { JsonCodeEditor } from '@/components/json-code-editor'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { useUpdateOption } from '../hooks/use-update-option'
import {
  formatJsonForTextarea,
  normalizeJsonString,
  validateJsonString,
} from './utils'

const OPTION_KEY = 'SavingsEstimateSetting'

const DEFAULT_SETTING = {
  enabled: false,
  show_on_dashboard: true,
  show_on_usage_logs: true,
  reference_price_source: 'official_snapshot',
  require_official_confirmation: true,
  official_price_stale_days: 90,
  max_summary_days: 31,
  max_summary_log_rows: 50000,
  official_prices: {},
}

type SavingsEstimateSettingsProps = {
  defaultValue: string
}

function savingsSettingText(value: string): string {
  if (value.trim()) return formatJsonForTextarea(value)
  return JSON.stringify(DEFAULT_SETTING, null, 2)
}

export const SavingsEstimateSettings = memo(function SavingsEstimateSettings({
  defaultValue,
}: SavingsEstimateSettingsProps) {
  const { t } = useTranslation()
  const updateOption = useUpdateOption()
  const [jsonText, setJsonText] = useState(() => savingsSettingText(defaultValue))

  useEffect(() => {
    setJsonText(savingsSettingText(defaultValue))
  }, [defaultValue])

  const validation = useMemo(
    () =>
      validateJsonString(jsonText, {
        predicate: (parsed) =>
          parsed != null && typeof parsed === 'object' && !Array.isArray(parsed),
        predicateMessage: 'JSON must be an object',
      }),
    [jsonText]
  )
  const validationMessage =
    validation.message === 'JSON must be an object'
      ? t('JSON must be an object')
      : validation.message || t('Invalid JSON')

  const handleSave = useCallback(async () => {
    if (!validation.valid) {
      toast.error(validationMessage)
      return
    }

    const normalized = normalizeJsonString(jsonText)
    const saved = normalizeJsonString(defaultValue || JSON.stringify(DEFAULT_SETTING))
    if (normalized === saved) {
      toast.info(t('No changes to save'))
      return
    }

    await updateOption.mutateAsync({
      key: OPTION_KEY,
      value: normalized,
    })
  }, [defaultValue, jsonText, t, updateOption, validation, validationMessage])

  return (
    <div className='space-y-4'>
      <Alert>
        <AlertDescription>
          {t(
            'Configure official pricing snapshots for user savings estimates.'
          )}
        </AlertDescription>
      </Alert>

      <div className='space-y-2'>
        <JsonCodeEditor value={jsonText} onChange={setJsonText} />
        {!validation.valid && (
          <p className='text-destructive text-sm'>{validationMessage}</p>
        )}
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={handleSave}
          disabled={updateOption.isPending || !validation.valid}
        >
          <Save data-icon='inline-start' />
          {updateOption.isPending
            ? t('Saving...')
            : t('Save savings estimate settings')}
        </Button>
      </div>
    </div>
  )
})
