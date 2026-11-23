import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMPUS_LANDMARKS,
  LIGHTING_PRESETS,
  OVERVIEW_PRESET,
} from '../campus3d/nustCampusLayout';
import { PROGRAMS } from '../data/nustData';
import {
  calculateMeritAggregate,
  filterPrograms,
  formatPKR,
  searchUniversityPortal,
  type SearchableEntry,
} from './programs';

test('filterPrograms filters accurately by level and school', () => {
  const seecsUg = filterPrograms(PROGRAMS, {
    level: 'Undergraduate',
    school: 'SEECS',
    query: '',
  });
  assert.equal(seecsUg.length, 3);
  assert.ok(seecsUg.every((p) => p.school === 'SEECS' && p.level === 'Undergraduate'));

  const allPhd = filterPrograms(PROGRAMS, {
    level: 'PhD',
    school: 'All',
    query: '',
  });
  assert.equal(allPhd.length, 3);
  assert.ok(allPhd.every((p) => p.level === 'PhD'));
});

test('filterPrograms supports keyword queries and sorting', () => {
  const arch = filterPrograms(PROGRAMS, {
    level: 'All',
    school: 'All',
    query: 'architecture',
  });
  assert.ok(arch.some((p) => p.id === 'barch-sada'));

  const sortedByTuition = filterPrograms(PROGRAMS, {
    level: 'All',
    school: 'All',
    query: '',
    sortBy: 'tuition-asc',
  });
  assert.ok(
    sortedByTuition[0].tuitionPerSemesterPKR <=
      sortedByTuition[sortedByTuition.length - 1].tuitionPerSemesterPKR
  );
});

test('filterPrograms returns empty array when no program matches', () => {
  const none = filterPrograms(PROGRAMS, {
    level: 'PhD',
    school: 'SADA',
    query: '',
  });
  assert.equal(none.length, 0);
});

test('searchUniversityPortal prioritizes exact and prefix matches', () => {
  const entries: SearchableEntry[] = [
    {
      id: '1',
      type: 'Portal',
      title: 'Qalam Student Portal',
      subtitle: 'Registration and transcripts',
      keywords: 'courses grades',
      targetSection: '#top',
      refId: 'qalam',
    },
    {
      id: '2',
      type: 'Program',
      title: 'BS Computer Science',
      subtitle: 'SEECS · H-12 Islamabad',
      keywords: 'computing ai',
      targetSection: '#programs',
      refId: 'bs-cs-seecs',
    },
  ];

  const results = searchUniversityPortal('qalam', entries);
  assert.equal(results.length, 1);
  assert.equal(results[0].refId, 'qalam');
});

test('calculateMeritAggregate applies 75% NET + 15% FSc + 10% Matric accurately', () => {
  const res = calculateMeritAggregate({
    netScore: 160,
    fscMarks: 990,
    fscTotal: 1100,
    matricMarks: 990,
    matricTotal: 1100,
  });

  // 160/200 * 75 = 60; 990/1100 * 15 = 13.5; 990/1100 * 10 = 9.0 -> 82.5%
  assert.equal(res.valid, true);
  assert.equal(res.aggregatePercent, 82.5);
  assert.equal(res.competitivenessBand, 'High Match (SEECS / NBS / SADA)');
});

test('calculateMeritAggregate rejects out-of-range scores', () => {
  const invalid = calculateMeritAggregate({
    netScore: 220,
    fscMarks: 900,
    fscTotal: 1100,
    matricMarks: 900,
    matricTotal: 1100,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.error?.includes('200'));
});

test('formatPKR formats currency with thousand separators', () => {
  assert.equal(formatPKR(175000), 'PKR 175,000');
});

test('3D campus masterplan landmarks, overview camera, and lighting presets are valid', () => {
  assert.equal(CAMPUS_LANDMARKS.length, 9);
  const ids = new Set(CAMPUS_LANDMARKS.map((l) => l.id));
  assert.equal(ids.size, CAMPUS_LANDMARKS.length);

  assert.equal(OVERVIEW_PRESET.cameraPos.length, 3);
  assert.equal(OVERVIEW_PRESET.targetPos.length, 3);

  for (const landmark of CAMPUS_LANDMARKS) {
    assert.ok(landmark.bounds.every((dim) => dim > 0));
    const dx = landmark.cameraPos[0] - landmark.targetPos[0];
    const dy = landmark.cameraPos[1] - landmark.targetPos[1];
    const dz = landmark.cameraPos[2] - landmark.targetPos[2];
    const dist = Math.hypot(dx, dy, dz);
    assert.ok(dist > 8, `${landmark.id} camera should stand away from target`);

    if (landmark.linkedSchool) {
      assert.ok(
        PROGRAMS.some((p) => p.school === landmark.linkedSchool),
        `${landmark.id} linkedSchool ${landmark.linkedSchool} must exist in PROGRAMS`
      );
    }
  }

  assert.ok(LIGHTING_PRESETS.morning && LIGHTING_PRESETS.golden && LIGHTING_PRESETS.dusk);
  assert.ok(
    LIGHTING_PRESETS.dusk.windowEmissiveIntensity >
      LIGHTING_PRESETS.morning.windowEmissiveIntensity
  );
});
