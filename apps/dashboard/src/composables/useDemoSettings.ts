import { computed, ref, shallowRef } from 'vue'
import { demoUser } from '../data/demo'

export interface ProfileSettings { name: string; email: string; jobTitle: string; bio: string }
export interface WorkspaceSettings { name: string; handle: string; timezone: string; weekStart: string }
export interface NotificationSettings { orders: boolean; mentions: boolean; digest: boolean; product: boolean }
export interface SettingsDraft { profile: ProfileSettings; workspace: WorkspaceSettings; notifications: NotificationSettings }
export interface SettingsErrors { profile: Partial<Record<keyof ProfileSettings, string>>; workspace: Partial<Record<keyof WorkspaceSettings, string>> }
export const timezoneOptions = [
  { value: 'Asia/Singapore', label: 'Singapore · UTC+08:00' },
  { value: 'Europe/London', label: 'London · Europe/London' },
  { value: 'America/New_York', label: 'New York · America/New_York' },
  { value: 'UTC', label: 'Coordinated Universal Time · UTC' },
]
export const weekOptions = [{ value: 'monday', label: 'Monday' }, { value: 'sunday', label: 'Sunday' }]
const copy = (value: SettingsDraft): SettingsDraft => ({ profile: { ...value.profile }, workspace: { ...value.workspace }, notifications: { ...value.notifications } })

// The application owns the draft and last saved snapshot, outside page lifetime.
// Replace save() with the consuming app's API/Inertia submission when integrating.
export function useDemoSettings() {
  const saved = shallowRef<SettingsDraft>({
    profile: { name: demoUser.name, email: demoUser.email, jobTitle: demoUser.jobTitle, bio: 'Making the everyday work a little more thoughtful.' },
    workspace: { name: 'Acme', handle: 'acme', timezone: 'Asia/Singapore', weekStart: 'monday' },
    notifications: { orders: true, mentions: true, digest: false, product: false },
  })
  const draft = ref(copy(saved.value))
  const errors = shallowRef<SettingsErrors>({ profile: {}, workspace: {} })
  const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(saved.value))
  const savedUser = computed(() => ({ ...demoUser, ...saved.value.profile }))

  function save(): 'profile' | 'workspace' | undefined {
    const profile: ProfileSettings = {
      name: draft.value.profile.name.trim(), email: draft.value.profile.email.trim(),
      jobTitle: draft.value.profile.jobTitle.trim(), bio: draft.value.profile.bio.trim(),
    }
    const workspace = { ...draft.value.workspace, name: draft.value.workspace.name.trim(), handle: draft.value.workspace.handle.trim() }
    const next: SettingsErrors = { profile: {}, workspace: {} }
    if (!profile.name || profile.name.length > 80) next.profile.name = 'Enter a name between 1 and 80 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) || profile.email.length > 254) next.profile.email = 'Enter a valid email address.'
    if (profile.jobTitle.length > 80) next.profile.jobTitle = 'Keep your job title within 80 characters.'
    if (profile.bio.length > 240) next.profile.bio = 'Keep your introduction within 240 characters.'
    if (!workspace.name || workspace.name.length > 80) next.workspace.name = 'Enter a workspace name between 1 and 80 characters.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(workspace.handle) || workspace.handle.length > 40) next.workspace.handle = 'Use up to 40 lowercase letters, numbers or single hyphens between words.'
    if (!timezoneOptions.some(option => option.value === workspace.timezone)) next.workspace.timezone = 'Choose a time zone from the list.'
    if (!weekOptions.some(option => option.value === workspace.weekStart)) next.workspace.weekStart = 'Choose the first day of your week.'
    errors.value = next
    if (Object.keys(next.profile).length) return 'profile'
    if (Object.keys(next.workspace).length) return 'workspace'
    saved.value = copy({ ...draft.value, profile, workspace })
    draft.value = copy(saved.value)
  }
  function discard() {
    draft.value = copy(saved.value)
    errors.value = { profile: {}, workspace: {} }
  }
  return { draft, saved, savedUser, errors, dirty, save, discard }
}
