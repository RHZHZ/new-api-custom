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
import { useTranslation } from 'react-i18next'

import { Main } from '@/components/layout'
import { useStatus } from '@/hooks/use-status'
import { useAuthStore } from '@/stores/auth-store'

import { CheckinCalendarCard } from './components/checkin-calendar-card'
import { LanguagePreferencesCard } from './components/language-preferences-card'
import { LoginSessionsCard } from './components/login-sessions-card'
import { PasskeyCard } from './components/passkey-card'
import { ProfileHeader } from './components/profile-header'
import { ProfileSecurityCard } from './components/profile-security-card'
import { ProfileSettingsCard } from './components/profile-settings-card'
import { SidebarModulesCard } from './components/sidebar-modules-card'
import { TwoFACard } from './components/two-fa-card'
import { useProfile } from './hooks'
import {
  profileSectionIds,
  profileWorkbenchLayoutClasses,
} from './profile-layout'

type ProfileSectionGroupProps = {
  id: string
  title: string
  children: ReactNode
}

function ProfileSectionGroup(props: ProfileSectionGroupProps) {
  const titleId = `${props.id}-title`

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className='mb-2 text-sm font-semibold'>
        {props.title}
      </h2>
      <div className={profileWorkbenchLayoutClasses.sectionStack}>
        {props.children}
      </div>
    </section>
  )
}

function ProfileSectionItem(props: { children: ReactNode }) {
  return (
    <div className={profileWorkbenchLayoutClasses.sectionItem}>
      {props.children}
    </div>
  )
}

export function Profile() {
  const { t } = useTranslation()
  const { profile, loading, refreshProfile } = useProfile()
  const { status } = useStatus()
  const permissions = useAuthStore((s) => s.auth.user?.permissions)

  const checkinEnabled = status?.checkin_enabled === true
  const turnstileEnabled = !!(
    status?.turnstile_check && status?.turnstile_site_key
  )
  const turnstileSiteKey = status?.turnstile_site_key || ''
  const canConfigureSidebar = permissions?.sidebar_settings !== false

  return (
    <Main>
      <header className={profileWorkbenchLayoutClasses.titleBar}>
        <div className='mx-auto w-full max-w-7xl'>
          <h1 className='text-lg leading-tight font-semibold md:text-xl'>
            {t('Account & Security')}
          </h1>
        </div>
      </header>

      <div className={profileWorkbenchLayoutClasses.scrollRegion}>
        <div className={profileWorkbenchLayoutClasses.content}>
          <div className={profileWorkbenchLayoutClasses.grid}>
            <div className={profileWorkbenchLayoutClasses.primaryColumn}>
              <ProfileSectionGroup
                id={profileSectionIds.account}
                title={t('Account')}
              >
                <ProfileSectionItem>
                  <ProfileHeader profile={profile} loading={loading} />
                </ProfileSectionItem>
                <ProfileSectionItem>
                  <ProfileSettingsCard
                    profile={profile}
                    loading={loading}
                    onProfileUpdate={refreshProfile}
                  />
                </ProfileSectionItem>
              </ProfileSectionGroup>

              <ProfileSectionGroup
                id={profileSectionIds.security}
                title={t('Security')}
              >
                <ProfileSectionItem>
                  <ProfileSecurityCard profile={profile} loading={loading} />
                </ProfileSectionItem>
                <ProfileSectionItem>
                  <PasskeyCard loading={loading} />
                </ProfileSectionItem>
                <ProfileSectionItem>
                  <TwoFACard loading={loading} />
                </ProfileSectionItem>
                <ProfileSectionItem>
                  <LoginSessionsCard />
                </ProfileSectionItem>
              </ProfileSectionGroup>
            </div>

            <div className={profileWorkbenchLayoutClasses.secondaryColumn}>
              <ProfileSectionGroup
                id={profileSectionIds.preferences}
                title={t('Preferences')}
              >
                <ProfileSectionItem>
                  <LanguagePreferencesCard
                    profile={profile}
                    onProfileUpdate={refreshProfile}
                  />
                </ProfileSectionItem>
                {checkinEnabled && (
                  <ProfileSectionItem>
                    <CheckinCalendarCard
                      checkinEnabled={checkinEnabled}
                      turnstileEnabled={turnstileEnabled}
                      turnstileSiteKey={turnstileSiteKey}
                    />
                  </ProfileSectionItem>
                )}
                {canConfigureSidebar && (
                  <ProfileSectionItem>
                    <SidebarModulesCard />
                  </ProfileSectionItem>
                )}
              </ProfileSectionGroup>
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
}
