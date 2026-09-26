import { CheckCircle2, AlertTriangle, XCircle, LucideIcon } from 'lucide-react';
import { EligibilityStatus } from '../types.ts';

export interface StatusStyleConfig {
  status: EligibilityStatus;
  label: string;
  badgeLabel: string;
  shortLabel: string;
  colorName: 'Green' | 'Yellow' | 'Red';
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  borderLeftClass: string;
  cardBgClass: string;
  pillBgClass: string;
  pillTextClass: string;
  accentBgClass: string;
  icon: LucideIcon;
  iconColorClass: string;
  textColorClass: string;
  description: string;
}

export const STATUS_STYLE_CONFIG: Record<EligibilityStatus, StatusStyleConfig> = {
  eligible: {
    status: 'eligible',
    label: 'Eligible',
    badgeLabel: 'Eligible (Criteria Met)',
    shortLabel: 'Eligible',
    colorName: 'Green',
    badgeClass:
      'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20 shadow-2xs',
    dotClass: 'bg-emerald-500',
    borderClass: 'border-emerald-200 hover:border-emerald-400',
    borderLeftClass: 'border-l-4 border-l-emerald-500',
    cardBgClass: 'bg-white',
    pillBgClass: 'bg-emerald-500',
    pillTextClass: 'text-white',
    accentBgClass: 'bg-emerald-50/70',
    icon: CheckCircle2,
    iconColorClass: 'text-emerald-600',
    textColorClass: 'text-emerald-700',
    description:
      'Meets all verified baseline criteria: age range, qualification level, minimum marks, and subject stream.',
  },
  potentially_eligible: {
    status: 'potentially_eligible',
    label: 'Potentially Eligible',
    badgeLabel: 'Potentially Eligible',
    shortLabel: 'Verify Condition',
    colorName: 'Yellow',
    badgeClass:
      'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-500/20 shadow-2xs',
    dotClass: 'bg-amber-500',
    borderClass: 'border-amber-200 hover:border-amber-400',
    borderLeftClass: 'border-l-4 border-l-amber-500',
    cardBgClass: 'bg-white',
    pillBgClass: 'bg-amber-500',
    pillTextClass: 'text-white',
    accentBgClass: 'bg-amber-50/70',
    icon: AlertTriangle,
    iconColorClass: 'text-amber-600',
    textColorClass: 'text-amber-700',
    description:
      'Condition requires verification: final-year/appearing status, branch-specific rules, or medical cutoffs.',
  },
  not_eligible: {
    status: 'not_eligible',
    label: 'Not Eligible',
    badgeLabel: 'Not Eligible',
    shortLabel: 'Not Eligible',
    colorName: 'Red',
    badgeClass:
      'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-500/20 shadow-2xs',
    dotClass: 'bg-rose-500',
    borderClass: 'border-slate-200 hover:border-rose-300',
    borderLeftClass: 'border-l-4 border-l-rose-400',
    cardBgClass: 'bg-slate-50/80',
    pillBgClass: 'bg-rose-500',
    pillTextClass: 'text-white',
    accentBgClass: 'bg-rose-50/70',
    icon: XCircle,
    iconColorClass: 'text-rose-600',
    textColorClass: 'text-rose-700',
    description:
      'Criteria currently exceeded or missing: age cutoff, minimum education level, or mandatory subjects.',
  },
};
