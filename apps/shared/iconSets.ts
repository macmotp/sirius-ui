import { computed, defineComponent, inject, provide, readonly, shallowRef } from 'vue'
import type { FunctionalComponent, InjectionKey, ShallowRef } from 'vue'
import { provideSiriusIcons } from '@sirius-ui/vue'
import type { SIconMap } from '@sirius-ui/vue'
import { Activity as LucideActivity, Archive as LucideArchive, ArrowDown as LucideArrowDown, ArrowUp as LucideArrowUp, ArrowUpDown as LucideArrowUpDown, ArrowUpRight as LucideArrowUpRight, Bell as LucideBell, Building2 as LucideBuilding2, Calendar as LucideCalendar, Camera as LucideCamera, ChartColumn as LucideChartColumn, Check as LucideCheck, ChevronDown as LucideChevronDown, ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight, ChevronsUpDown as LucideChevronsUpDown, CircleAlert as LucideCircleAlert, CircleCheck as LucideCircleCheck, CircleHelp as LucideCircleHelp, Clock as LucideClock, Cloud as LucideCloud, Copy as LucideCopy, Download as LucideDownload, Ellipsis as LucideEllipsis, ExternalLink as LucideExternalLink, File as LucideFile, FileText as LucideFileText, Folder as LucideFolder, Heart as LucideHeart, House as LucideHouse, Inbox as LucideInbox, Info as LucideInfo, LoaderCircle as LucideLoaderCircle, LogOut as LucideLogOut, Mail as LucideMail, Menu as LucideMenu, Minus as LucideMinus, Package as LucidePackage, Pencil as LucidePencil, Plus as LucidePlus, Search as LucideSearch, Settings as LucideSettings, Settings2 as LucideSettings2, Sparkles as LucideSparkles, Star as LucideStar, Trash2 as LucideTrash2, TriangleAlert as LucideTriangleAlert, Upload as LucideUpload, User as LucideUser, UserPlus as LucideUserPlus, UserRound as LucideUserRound, Users as LucideUsers, X as LucideX } from '@lucide/vue'
import { AdjustmentsHorizontalIcon, ArchiveBoxIcon, ArrowDownIcon, ArrowDownTrayIcon, ArrowPathIcon, ArrowRightStartOnRectangleIcon, ArrowTopRightOnSquareIcon, ArrowUpIcon, ArrowUpRightIcon, ArrowUpTrayIcon, ArrowsUpDownIcon, Bars3Icon, BellIcon, BoltIcon, BuildingOfficeIcon, CalendarDaysIcon, CameraIcon, ChartBarIcon, CheckCircleIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon, ClockIcon, CloudIcon, Cog6ToothIcon, CubeIcon, DocumentDuplicateIcon, DocumentIcon, DocumentTextIcon, EllipsisHorizontalIcon, EnvelopeIcon, ExclamationCircleIcon, ExclamationTriangleIcon, FolderIcon, HeartIcon, HomeIcon, InboxIcon, InformationCircleIcon, MagnifyingGlassIcon, MinusIcon, PencilIcon, PlusIcon, QuestionMarkCircleIcon, SparklesIcon, StarIcon, TrashIcon, UserCircleIcon, UserIcon, UserPlusIcon, UsersIcon, XMarkIcon } from '@heroicons/vue/24/outline'

export const lucideIcons = {
  appActivity: LucideActivity,
  appArchive: LucideArchive,
  sortDescending: LucideArrowDown,
  sortAscending: LucideArrowUp,
  sort: LucideArrowUpDown,
  appArrowUpRight: LucideArrowUpRight,
  appBell: LucideBell,
  appBuilding2: LucideBuilding2,
  appCalendar: LucideCalendar,
  appCamera: LucideCamera,
  appChartColumn: LucideChartColumn,
  check: LucideCheck,
  chevronDown: LucideChevronDown,
  chevronLeft: LucideChevronLeft,
  chevronRight: LucideChevronRight,
  appChevronsUpDown: LucideChevronsUpDown,
  danger: LucideCircleAlert,
  success: LucideCircleCheck,
  appCircleHelp: LucideCircleHelp,
  appClock: LucideClock,
  appCloud: LucideCloud,
  appCopy: LucideCopy,
  appDownload: LucideDownload,
  appEllipsis: LucideEllipsis,
  appExternalLink: LucideExternalLink,
  file: LucideFile,
  appFileText: LucideFileText,
  appFolder: LucideFolder,
  appHeart: LucideHeart,
  appHouse: LucideHouse,
  inbox: LucideInbox,
  info: LucideInfo,
  loading: LucideLoaderCircle,
  appLogOut: LucideLogOut,
  appMail: LucideMail,
  menu: LucideMenu,
  minus: LucideMinus,
  appPackage: LucidePackage,
  appPencil: LucidePencil,
  appPlus: LucidePlus,
  appSearch: LucideSearch,
  appSettings: LucideSettings,
  appSettings2: LucideSettings2,
  appSparkles: LucideSparkles,
  appStar: LucideStar,
  appTrash2: LucideTrash2,
  warning: LucideTriangleAlert,
  upload: LucideUpload,
  appUser: LucideUser,
  appUserPlus: LucideUserPlus,
  user: LucideUserRound,
  appUsers: LucideUsers,
  close: LucideX,
} satisfies SIconMap

// Heroicons exports render functions without declared props. A stateful adapter
// preserves all SVG attributes (ARIA, focusable, size), beyond class/style/events.
function heroicon(icon: FunctionalComponent) {
  return defineComponent({ render() {
    return icon({}, { attrs: this.$attrs, slots: this.$slots, emit: this.$emit })
  } })
}

export const heroiconsIcons = {
  appActivity: heroicon(BoltIcon),
  appArchive: heroicon(ArchiveBoxIcon),
  sortDescending: heroicon(ArrowDownIcon),
  sortAscending: heroicon(ArrowUpIcon),
  sort: heroicon(ArrowsUpDownIcon),
  appArrowUpRight: heroicon(ArrowUpRightIcon),
  appBell: heroicon(BellIcon),
  appBuilding2: heroicon(BuildingOfficeIcon),
  appCalendar: heroicon(CalendarDaysIcon),
  appCamera: heroicon(CameraIcon),
  appChartColumn: heroicon(ChartBarIcon),
  check: heroicon(CheckIcon),
  chevronDown: heroicon(ChevronDownIcon),
  chevronLeft: heroicon(ChevronLeftIcon),
  chevronRight: heroicon(ChevronRightIcon),
  appChevronsUpDown: heroicon(ChevronUpDownIcon),
  danger: heroicon(ExclamationCircleIcon),
  success: heroicon(CheckCircleIcon),
  appCircleHelp: heroicon(QuestionMarkCircleIcon),
  appClock: heroicon(ClockIcon),
  appCloud: heroicon(CloudIcon),
  appCopy: heroicon(DocumentDuplicateIcon),
  appDownload: heroicon(ArrowDownTrayIcon),
  appEllipsis: heroicon(EllipsisHorizontalIcon),
  appExternalLink: heroicon(ArrowTopRightOnSquareIcon),
  file: heroicon(DocumentIcon),
  appFileText: heroicon(DocumentTextIcon),
  appFolder: heroicon(FolderIcon),
  appHeart: heroicon(HeartIcon),
  appHouse: heroicon(HomeIcon),
  inbox: heroicon(InboxIcon),
  info: heroicon(InformationCircleIcon),
  loading: heroicon(ArrowPathIcon),
  appLogOut: heroicon(ArrowRightStartOnRectangleIcon),
  appMail: heroicon(EnvelopeIcon),
  menu: heroicon(Bars3Icon),
  minus: heroicon(MinusIcon),
  appPackage: heroicon(CubeIcon),
  appPencil: heroicon(PencilIcon),
  appPlus: heroicon(PlusIcon),
  appSearch: heroicon(MagnifyingGlassIcon),
  appSettings: heroicon(Cog6ToothIcon),
  appSettings2: heroicon(AdjustmentsHorizontalIcon),
  appSparkles: heroicon(SparklesIcon),
  appStar: heroicon(StarIcon),
  appTrash2: heroicon(TrashIcon),
  warning: heroicon(ExclamationTriangleIcon),
  upload: heroicon(ArrowUpTrayIcon),
  appUser: heroicon(UserIcon),
  appUserPlus: heroicon(UserPlusIcon),
  user: heroicon(UserCircleIcon),
  appUsers: heroicon(UsersIcon),
  close: heroicon(XMarkIcon),
} satisfies SIconMap

type DemoIconSet = 'lucide' | 'heroicons'
interface DemoIconContext {
  selection: Readonly<ShallowRef<DemoIconSet>>
  select: (value: string) => void
}
const selectionKey: InjectionKey<DemoIconContext> = Symbol('demo-icon-set')
export const iconOptions = [{ value: 'lucide', label: 'Lucide' }, { value: 'heroicons', label: 'Heroicons' }]

export function provideDemoIcons() {
  const selection = shallowRef<DemoIconSet>('lucide')
  const context: DemoIconContext = {
    selection: readonly(selection),
    select(value) { if (value === 'lucide' || value === 'heroicons') selection.value = value },
  }
  provide(selectionKey, context)
  provideSiriusIcons(computed(() => selection.value === 'heroicons' ? heroiconsIcons : lucideIcons))
  return context
}

export function useDemoIconSelection() {
  return inject(selectionKey, undefined)
}
