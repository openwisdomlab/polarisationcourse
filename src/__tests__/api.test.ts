/**
 * Tests for the Unified Physics API Facade (src/core/api.ts)
 *
 * Validates:
 *   1. API creation in both modes
 *   2. Linear source creation
 *   3. Malus's Law: cos²θ intensity relationship
 *   4. Legacy packet round-trip conversion
 *   5. Circular source creation
 *   6. QWP: linear → circular conversion
 *   7. Stokes representation for horizontal polarization
 */

import { describe, it, expect } from 'vitest';
import { createPhysicsAPI, type PhysicsMode } from '../core/api';

const TOL = 1e-4;

describe('Unified Physics API Facade', () => {
  describe('API creation', () => {
    it('creates API in game mode', () => {
      const api = createPhysicsAPI('game');
      expect(api.mode).toBe('game');
    });

    it('creates API in science mode', () => {
      const api = createPhysicsAPI('science');
      expect(api.mode).toBe('science');
    });

    it('defaults to science mode', () => {
      const api = createPhysicsAPI();
      expect(api.mode).toBe('science');
    });
  });

  describe('Linear source', () => {
    it('creates horizontal source with correct intensity and angle', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);

      expect(source.intensity).toBeCloseTo(1.0, 4);
      expect(source.angleDeg).toBeCloseTo(0, 1);
      expect(source.degreeOfPolarization).toBeCloseTo(1.0, 2);
      expect(source.polarizationType).toBe('linear');
    });

    it('creates 45-degree source', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(45, 1.0);

      expect(source.intensity).toBeCloseTo(1.0, 4);
      expect(source.angleDeg).toBeCloseTo(45, 1);
      expect(source.polarizationType).toBe('linear');
    });

    it('creates source with custom intensity', () => {
      const api = createPhysicsAPI('game');
      const source = api.createLinearSource(90, 0.6);

      expect(source.intensity).toBeCloseTo(0.6, 4);
      expect(source.angleDeg).toBeCloseTo(90, 1);
    });
  });

  describe("Malus's Law", () => {
    it('0-degree source through 45-degree polarizer → intensity ≈ 0.5', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const after = api.applyPolarizer(source, 45);

      // cos²(45°) = 0.5
      expect(after.intensity).toBeCloseTo(0.5, 3);
      expect(after.angleDeg).toBeCloseTo(45, 1);
    });

    it('crossed polarizers (90°) block all light', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const after = api.applyPolarizer(source, 90);

      // cos²(90°) = 0
      expect(after.intensity).toBeLessThan(TOL);
    });

    it('parallel polarizers transmit fully', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(30, 1.0);
      const after = api.applyPolarizer(source, 30);

      expect(after.intensity).toBeCloseTo(1.0, 3);
    });

    it('three-polarizer trick: 0 → 45 → 90 transmits ~25%', () => {
      const api = createPhysicsAPI('science');
      let state = api.createLinearSource(0, 1.0);
      state = api.applyPolarizer(state, 45);  // cos²(45°) = 0.5
      state = api.applyPolarizer(state, 90);  // cos²(45°) = 0.5 × 0.5 = 0.25

      expect(state.intensity).toBeCloseTo(0.25, 3);
    });
  });

  describe('Legacy packet round-trip', () => {
    it('converts to legacy and back preserving key properties', () => {
      const api = createPhysicsAPI('game');
      const source = api.createLinearSource(0, 1.0);

      const packet = api.toLegacyPacket(source, 'east');
      expect(packet.direction).toBe('east');
      expect(packet.intensity).toBe(15); // 1.0 × 15 = 15
      expect(packet.polarization).toBe(0);

      const recovered = api.fromLegacyPacket(packet);
      expect(recovered.intensity).toBeCloseTo(1.0, 2);
      expect(recovered.angleDeg).toBeCloseTo(0, 1);
    });

    it('preserves 45-degree polarization through round-trip', () => {
      const api = createPhysicsAPI('game');
      const source = api.createLinearSource(45, 1.0);

      const packet = api.toLegacyPacket(source, 'north');
      expect(packet.polarization).toBe(45);

      const recovered = api.fromLegacyPacket(packet);
      expect(recovered.angleDeg).toBeCloseTo(45, 1);
    });
  });

  describe('Circular source', () => {
    it('creates right-circular polarization in science mode', () => {
      const api = createPhysicsAPI('science');
      const rcp = api.createCircularSource(true, 1.0);

      expect(rcp.intensity).toBeCloseTo(1.0, 4);
      expect(rcp.polarizationType).toBe('circular');
      expect(rcp.handedness).toBe('right');
      expect(rcp.degreeOfPolarization).toBeCloseTo(1.0, 2);
    });

    it('creates left-circular polarization', () => {
      const api = createPhysicsAPI('science');
      const lcp = api.createCircularSource(false, 1.0);

      expect(lcp.polarizationType).toBe('circular');
      expect(lcp.handedness).toBe('left');
    });
  });

  describe('Quarter-wave plate (QWP)', () => {
    it('45-degree linear through QWP at 0-degree fast axis → circular', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(45, 1.0);

      // QWP: retardation = 90 degrees, fast axis at 0 degrees
      const after = api.applyWavePlate(source, 90, 0);

      // Intensity should be preserved
      expect(after.intensity).toBeCloseTo(1.0, 3);
      // Should become circular
      expect(after.polarizationType).toBe('circular');
    });
  });

  describe('Stokes representation', () => {
    it('horizontal polarization: S1 ≈ 1', () => {
      const api = createPhysicsAPI('science');
      const horizontal = api.createLinearSource(0, 1.0);
      const stokes = api.toStokes(horizontal);

      expect(stokes.s0).toBeCloseTo(1.0, 4);
      expect(stokes.s1).toBeCloseTo(1.0, 4);
      expect(stokes.s2).toBeCloseTo(0, 4);
      expect(stokes.s3).toBeCloseTo(0, 4);
    });

    it('vertical polarization: S1 ≈ -1', () => {
      const api = createPhysicsAPI('science');
      const vertical = api.createLinearSource(90, 1.0);
      const stokes = api.toStokes(vertical);

      expect(stokes.s0).toBeCloseTo(1.0, 4);
      expect(stokes.s1).toBeCloseTo(-1.0, 4);
      expect(stokes.s2).toBeCloseTo(0, 4);
      expect(stokes.s3).toBeCloseTo(0, 4);
    });

    it('right-circular: S3 ≈ 1', () => {
      const api = createPhysicsAPI('science');
      const rcp = api.createCircularSource(true, 1.0);
      const stokes = api.toStokes(rcp);

      expect(stokes.s0).toBeCloseTo(1.0, 4);
      expect(stokes.s1).toBeCloseTo(0, 4);
      expect(stokes.s2).toBeCloseTo(0, 4);
      expect(stokes.s3).toBeCloseTo(1.0, 4);
    });

    it('unpolarized: S1 = S2 = S3 ≈ 0', () => {
      const api = createPhysicsAPI('science');
      const unpol = api.createUnpolarizedSource(1.0);
      const stokes = api.toStokes(unpol);

      expect(stokes.s0).toBeCloseTo(1.0, 4);
      expect(stokes.s1).toBeCloseTo(0, 4);
      expect(stokes.s2).toBeCloseTo(0, 4);
      expect(stokes.s3).toBeCloseTo(0, 4);
    });
  });

  describe('Jones representation', () => {
    it('returns Jones for fully polarized light', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const jones = api.toJones(source);

      expect(jones).not.toBeNull();
    });

    it('returns null for unpolarized light', () => {
      const api = createPhysicsAPI('science');
      const unpol = api.createUnpolarizedSource(1.0);
      const jones = api.toJones(unpol);

      expect(jones).toBeNull();
    });
  });

  describe('Rotator', () => {
    it('rotates horizontal by 45 degrees', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const rotated = api.applyRotator(source, 45);

      expect(rotated.intensity).toBeCloseTo(1.0, 3);
      expect(rotated.angleDeg).toBeCloseTo(45, 1);
      expect(rotated.polarizationType).toBe('linear');
    });
  });

  describe('Mirror', () => {
    it('preserves intensity on reflection', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const reflected = api.applyMirror(source);

      expect(reflected.intensity).toBeCloseTo(1.0, 3);
    });
  });

  describe('Attenuation', () => {
    it('reduces intensity by the transmission factor', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const attenuated = api.applyAttenuation(source, 0.5);

      expect(attenuated.intensity).toBeCloseTo(0.5, 3);
      expect(attenuated.polarizationType).toBe('linear');
    });
  });

  describe('PBS', () => {
    it('splits horizontal into transmitted and reflected', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(0, 1.0);
      const [transmitted, reflected] = api.applyPBS(source);

      // Energy conservation: total should still be ~1.0
      expect(transmitted.intensity + reflected.intensity).toBeCloseTo(1.0, 3);
    });

    it('splits 45-degree light roughly equally', () => {
      const api = createPhysicsAPI('science');
      const source = api.createLinearSource(45, 1.0);
      const [transmitted, reflected] = api.applyPBS(source);

      expect(transmitted.intensity).toBeCloseTo(0.5, 2);
      expect(reflected.intensity).toBeCloseTo(0.5, 2);
    });
  });
});
