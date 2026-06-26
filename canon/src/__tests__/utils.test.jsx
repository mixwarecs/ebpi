import { describe, it, expect } from 'vitest';
import { linkifyVerses } from '../utils.jsx';

// Collect all <a> elements from the linkifyVerses output array
const links = (result) =>
  (Array.isArray(result) ? result : [result]).filter(
    (p) => p && typeof p === 'object' && p.type === 'a'
  );

describe('linkifyVerses', () => {
  // ── Baseline: plain text ─────────────────────────────────────────────────

  it('returns original string when there are no references', () => {
    const text = 'plain text without any verse';
    expect(linkifyVerses(text)).toBe(text);
  });

  // ── Single full references ───────────────────────────────────────────────

  it('links a single full reference', () => {
    const result = linkifyVerses('Ver Mc 5:34 para más');
    const ls = links(result);
    expect(ls).toHaveLength(1);
    expect(ls[0].props.children).toBe('Mc 5:34');
    expect(ls[0].props.href).toContain('Mark');
    expect(ls[0].props.href).toContain('5:34');
  });

  it('preserves parentheses around a reference', () => {
    const result = linkifyVerses('(Mc 5:34)');
    expect(Array.isArray(result)).toBe(true);
    expect(links(result)).toHaveLength(1);
    expect(result).toContain('(');
    expect(result).toContain(')');
  });

  // ── Multiple full references ─────────────────────────────────────────────

  it('links two full references in the same string', () => {
    const result = linkifyVerses('Mc 5:34 y Jn 3:16');
    const ls = links(result);
    expect(ls).toHaveLength(2);
    expect(ls[0].props.href).toContain('Mark');
    expect(ls[1].props.href).toContain('John');
  });

  it('links two full references separated by a semicolon', () => {
    const result = linkifyVerses('Mc 5:34; Jn 3:16');
    const ls = links(result);
    expect(ls).toHaveLength(2);
    expect(ls[0].props.href).toContain('Mark');
    expect(ls[1].props.href).toContain('John');
  });

  it('links a reference with a verse range', () => {
    const result = linkifyVerses('Mc 14:22–24');
    expect(links(result)).toHaveLength(1);
  });

  // ── Bare verse continuations (new behavior) ──────────────────────────────

  it('links a bare verse continuation after a semicolon', () => {
    const result = linkifyVerses('la fe (Mc 5:34; 10:52)');
    const ls = links(result);
    expect(ls).toHaveLength(2);
    expect(ls[0].props.children).toBe('Mc 5:34');
    expect(ls[1].props.children).toBe('10:52');
    expect(ls[1].props.href).toContain('Mark');
    expect(ls[1].props.href).toContain('10:52');
  });

  it('links a bare verse continuation after a comma', () => {
    const result = linkifyVerses('ver Mc 5:34, 10:52');
    const ls = links(result);
    expect(ls).toHaveLength(2);
    expect(ls[1].props.children).toBe('10:52');
    expect(ls[1].props.href).toContain('Mark');
  });

  it('links multiple bare verse continuations', () => {
    const result = linkifyVerses('ver Mc 5:34; 10:52; 14:36');
    const ls = links(result);
    expect(ls).toHaveLength(3);
    expect(ls[0].props.children).toBe('Mc 5:34');
    expect(ls[1].props.children).toBe('10:52');
    expect(ls[2].props.children).toBe('14:36');
    expect(ls[2].props.href).toContain('Mark');
    expect(ls[2].props.href).toContain('14:36');
  });

  it('links bare continuation inside parentheses and preserves parens', () => {
    const result = linkifyVerses('(Mc 5:34; 10:52)');
    const ls = links(result);
    expect(ls).toHaveLength(2);
    expect(result).toContain('(');
    expect(result).toContain(')');
  });

  // ── Safety: bare numbers mid-sentence must NOT be linked ─────────────────

  it('does not link a bare number mid-sentence without a semicolon/comma', () => {
    const result = linkifyVerses('Mc 5:34 también 10:52');
    expect(links(result)).toHaveLength(1);
  });
});
