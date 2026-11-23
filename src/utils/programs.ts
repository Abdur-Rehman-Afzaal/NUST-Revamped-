import type { DegreeLevel, ProgramItem, SchoolCode } from '../data/nustData';

export type ProgramSortOption = 'recommended' | 'tuition-asc' | 'duration-asc';

export interface ProgramFilterState {
  level: DegreeLevel | 'All';
  school: SchoolCode | 'All';
  query: string;
  sortBy?: ProgramSortOption;
}

export interface SearchableEntry {
  id: string;
  type: 'Program' | 'Portal' | 'Research' | 'News & Event';
  title: string;
  subtitle: string;
  keywords: string;
  targetSection: string;
  refId: string;
}

export interface MeritInput {
  netScore: number;
  netMax?: number;
  fscMarks: number;
  fscTotal: number;
  matricMarks: number;
  matricTotal: number;
}

export interface MeritResult {
  valid: boolean;
  error?: string;
  aggregatePercent: number;
  netContribution: number;
  fscContribution: number;
  matricContribution: number;
  competitivenessBand: 'High Match (SEECS / NBS / SADA)' | 'Competitive (Most Engineering & Social Sciences)' | 'Retake Recommended (Aim for 135+ NET)';
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-US')}`;
}

export function filterPrograms(
  programs: ProgramItem[],
  state: ProgramFilterState
): ProgramItem[] {
  const normalizedQuery = state.query.trim().toLowerCase();

  const filtered = programs.filter((program) => {
    if (state.level !== 'All' && program.level !== state.level) {
      return false;
    }
    if (state.school !== 'All' && program.school !== state.school) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const haystack = [
        program.title,
        program.school,
        program.schoolName,
        program.disciplineLabel,
        program.level,
        program.summary,
        program.campus,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });

  const sortBy = state.sortBy ?? 'recommended';
  if (sortBy === 'tuition-asc') {
    return [...filtered].sort(
      (a, b) => a.tuitionPerSemesterPKR - b.tuitionPerSemesterPKR
    );
  }
  if (sortBy === 'duration-asc') {
    return [...filtered].sort((a, b) => a.durationYears - b.durationYears);
  }
  return filtered;
}

export function searchUniversityPortal(
  query: string,
  entries: SearchableEntry[],
  limit = 8
): SearchableEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return entries.slice(0, limit);
  }

  const scored = entries
    .map((entry) => {
      const titleLower = entry.title.toLowerCase();
      const subtitleLower = entry.subtitle.toLowerCase();
      const keywordsLower = entry.keywords.toLowerCase();

      let score = 0;
      if (titleLower === q) score += 100;
      else if (titleLower.startsWith(q)) score += 60;
      else if (titleLower.includes(q)) score += 40;

      if (subtitleLower.includes(q)) score += 20;
      if (keywordsLower.includes(q)) score += 10;

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.entry);
}

/**
 * Computes NUST undergraduate merit aggregate using the official weighting:
 * 75% NET Score (out of 200) + 15% FSc / A-Level + 10% Matric / O-Level.
 */
export function calculateMeritAggregate(input: MeritInput): MeritResult {
  const netMax = input.netMax ?? 200;

  if (
    !Number.isFinite(input.netScore) ||
    !Number.isFinite(input.fscMarks) ||
    !Number.isFinite(input.fscTotal) ||
    !Number.isFinite(input.matricMarks) ||
    !Number.isFinite(input.matricTotal)
  ) {
    return {
      valid: false,
      error: 'Enter valid numeric scores across all three fields.',
      aggregatePercent: 0,
      netContribution: 0,
      fscContribution: 0,
      matricContribution: 0,
      competitivenessBand: 'Retake Recommended (Aim for 135+ NET)',
    };
  }

  if (input.netScore < 0 || input.netScore > netMax) {
    return {
      valid: false,
      error: `NET score must be between 0 and ${netMax}.`,
      aggregatePercent: 0,
      netContribution: 0,
      fscContribution: 0,
      matricContribution: 0,
      competitivenessBand: 'Retake Recommended (Aim for 135+ NET)',
    };
  }

  if (input.fscTotal <= 0 || input.fscMarks < 0 || input.fscMarks > input.fscTotal) {
    return {
      valid: false,
      error: 'FSc / HSSC marks must not exceed total marks.',
      aggregatePercent: 0,
      netContribution: 0,
      fscContribution: 0,
      matricContribution: 0,
      competitivenessBand: 'Retake Recommended (Aim for 135+ NET)',
    };
  }

  if (
    input.matricTotal <= 0 ||
    input.matricMarks < 0 ||
    input.matricMarks > input.matricTotal
  ) {
    return {
      valid: false,
      error: 'Matric / SSC marks must not exceed total marks.',
      aggregatePercent: 0,
      netContribution: 0,
      fscContribution: 0,
      matricContribution: 0,
      competitivenessBand: 'Retake Recommended (Aim for 135+ NET)',
    };
  }

  const netContribution = (input.netScore / netMax) * 75;
  const fscContribution = (input.fscMarks / input.fscTotal) * 15;
  const matricContribution = (input.matricMarks / input.matricTotal) * 10;
  const aggregatePercent = Number(
    (netContribution + fscContribution + matricContribution).toFixed(2)
  );

  let competitivenessBand: MeritResult['competitivenessBand'] =
    'Retake Recommended (Aim for 135+ NET)';
  if (aggregatePercent >= 78) {
    competitivenessBand = 'High Match (SEECS / NBS / SADA)';
  } else if (aggregatePercent >= 68) {
    competitivenessBand = 'Competitive (Most Engineering & Social Sciences)';
  }

  return {
    valid: true,
    aggregatePercent,
    netContribution: Number(netContribution.toFixed(2)),
    fscContribution: Number(fscContribution.toFixed(2)),
    matricContribution: Number(matricContribution.toFixed(2)),
    competitivenessBand,
  };
}
