import { describe, it, expect, beforeEach } from 'vitest';
import { RatingPipe } from './rating.pipe';

describe('Pipe - RatingPipe', () => {
  let p: RatingPipe;

  beforeEach(() => {
    p = new RatingPipe();
  });

  it('creates an instance', () => {
    expect(p).toBeTruthy();
  });

  it('returns ausgezeichnet when 2 is passed', () => {
    expect(p.transform(2)).toEqual('ausgezeichnet');
  });

  it('throws an err when a negative value is passed', () => {
    expect(() => {
      p.transform(-1);
    }).toThrowError('Invalid param');

    expect(() => {
      p.transform(6);
    }).toThrowError('Argument out of range');
  });

  it('returns umwerfend when 1 is passed', () => {
    expect(p.transform(1)).toEqual('umwerfend');
  });

  it('returns in ordnung when 3 is passed', () => {
    expect(p.transform(3)).toEqual('in ordnung');
  });

  it('returns könnte besser sein when 4 is passed', () => {
    expect(p.transform(4)).toEqual('könnte besser sein');
  });

  it('returns nicht das gelbe vom ei when 5 is passed', () => {
    expect(p.transform(5)).toEqual('nicht das gelbe vom ei');
  });
});

