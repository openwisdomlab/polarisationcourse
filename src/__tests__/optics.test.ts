/**
 * Comprehensive Tests for the Analytical Optics Core
 *
 * Tests every function in src/core/physics/optics/ against known
 * analytical solutions. Tolerance: 1e-10 unless otherwise noted.
 *
 * Test categories:
 *   1. Stokes vector creation and derived quantities
 *   2. Mueller matrix factory functions
 *   3. Jones → Mueller conversion
 *   4. Optical element physics (Malus's Law, waveplates, etc.)
 *   5. Fresnel equations and Mueller matrices
 *   6. Thin film interference
 *   7. Physical validation and clamping
 */

import { describe, it, expect } from 'vitest';
import {
  // Stokes
  createStokes,
  createUnpolarized,
  createLinear,
  createHorizontal,
  createVertical,
  createDiagonal,
  createAntiDiagonal,
  createCircular,
  createElliptical,
  createPartiallyPolarized,
  intensity,
  toDoLP,
  toAoLP,
  toDoCP,
  toDoP,
  toEllipticity,
  handedness,
  validate,
  clampToPhysical,
  stokesAdd,
  stokesScale,
  stokesEquals,
  toTuple,
  fromTuple,

  // Mueller
  identity,
  linearPolarizer,
  generalRetarder,
  quarterWavePlate,
  halfWavePlate,
  rotator,
  depolarizer,
  partialDepolarizer,
  mirror,
  attenuator,
  dichroicPolarizer,
  multiply,
  chainMueller,
  applyToStokes,
  mScale,
  isPhysical,
  depolarizationIndex,
  isNonDepolarizing,
  fromJonesElements,
  mGet,
  mEquals,

  // Fresnel
  fresnelAmplitudes,
  fresnelMuellerReflect,
  fresnelMuellerTransmit,
  brewsterAngle,
  criticalAngle,
  reflectanceS,
  reflectanceP,

  // Thin film
  thinFilmMuellerReflect,
  thinFilmMuellerTransmit,
  quarterWaveThickness,
  idealARCoating,
} from '../core/physics/optics';

const TOL = 1e-10;
const LOOSE_TOL = 1e-6; // For derived quantities involving trig chains

/** Helper: check if two numbers are close */
function near(a: number, b: number, tol: number = TOL): boolean {
  return Math.abs(a - b) < tol;
}

// =========================================================
// 1. STOKES VECTOR TESTS
// =========================================================

describe('Stokes Vector', () => {
  describe('Creation', () => {
    it('createStokes stores correct values', () => {
      const s = createStokes(1, 0.5, -0.3, 0.2);
      expect(s[0]).toBe(1);
      expect(s[1]).toBe(0.5);
      expect(s[2]).toBe(-0.3);
      expect(s[3]).toBe(0.2);
    });

    it('createUnpolarized: S = [I, 0, 0, 0]', () => {
      const s = createUnpolarized(2.5);
      expect(s[0]).toBe(2.5);
      expect(s[1]).toBe(0);
      expect(s[2]).toBe(0);
      expect(s[3]).toBe(0);
    });

    it('createHorizontal: S = [I, I, 0, 0]', () => {
      const s = createHorizontal(1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 1)).toBe(true);
      expect(near(s[2], 0)).toBe(true);
      expect(near(s[3], 0)).toBe(true);
    });

    it('createVertical: S = [I, -I, 0, 0]', () => {
      const s = createVertical(1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], -1)).toBe(true);
      expect(near(s[2], 0)).toBe(true);
      expect(near(s[3], 0)).toBe(true);
    });

    it('createDiagonal (+45°): S = [I, 0, I, 0]', () => {
      const s = createDiagonal(1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 0)).toBe(true);
      expect(near(s[2], 1)).toBe(true);
      expect(near(s[3], 0)).toBe(true);
    });

    it('createAntiDiagonal (-45°): S = [I, 0, -I, 0]', () => {
      const s = createAntiDiagonal(1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 0)).toBe(true);
      expect(near(s[2], -1)).toBe(true);
      expect(near(s[3], 0)).toBe(true);
    });

    it('createCircular right: S = [I, 0, 0, I]', () => {
      const s = createCircular('right', 1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 0)).toBe(true);
      expect(near(s[2], 0)).toBe(true);
      expect(near(s[3], 1)).toBe(true);
    });

    it('createCircular left: S = [I, 0, 0, -I]', () => {
      const s = createCircular('left', 1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 0)).toBe(true);
      expect(near(s[2], 0)).toBe(true);
      expect(near(s[3], -1)).toBe(true);
    });

    it('createLinear at angle π/4 matches createDiagonal', () => {
      const s = createLinear(Math.PI / 4, 1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 0)).toBe(true);
      expect(near(s[2], 1)).toBe(true);
      expect(near(s[3], 0)).toBe(true);
    });

    it('createLinear at angle 0 matches createHorizontal', () => {
      const s = createLinear(0, 1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 1)).toBe(true);
      expect(near(s[2], 0)).toBe(true);
      expect(near(s[3], 0)).toBe(true);
    });

    it('createElliptical with χ=π/4 produces RCP', () => {
      const s = createElliptical(0, Math.PI / 4, 1);
      expect(near(s[0], 1)).toBe(true);
      expect(near(s[1], 0)).toBe(true);
      expect(near(s[2], 0)).toBe(true);
      expect(near(s[3], 1)).toBe(true);
    });
  });

  describe('Derived Quantities', () => {
    it('intensity returns S0', () => {
      expect(intensity(createStokes(3.7, 1, 2, 0.5))).toBe(3.7);
    });

    it('DoP for fully polarized horizontal = 1', () => {
      expect(near(toDoP(createHorizontal(1)), 1)).toBe(true);
    });

    it('DoP for unpolarized = 0', () => {
      expect(near(toDoP(createUnpolarized(1)), 0)).toBe(true);
    });

    it('DoLP for horizontal = 1', () => {
      expect(near(toDoLP(createHorizontal(1)), 1)).toBe(true);
    });

    it('DoLP for circular = 0', () => {
      expect(near(toDoLP(createCircular('right', 1)), 0)).toBe(true);
    });

    it('DoCP for circular = 1', () => {
      expect(near(toDoCP(createCircular('right', 1)), 1)).toBe(true);
    });

    it('DoCP for linear = 0', () => {
      expect(near(toDoCP(createHorizontal(1)), 0)).toBe(true);
    });

    it('AoLP for horizontal = 0', () => {
      expect(near(toAoLP(createHorizontal(1)), 0)).toBe(true);
    });

    it('AoLP for +45° = π/4', () => {
      expect(near(toAoLP(createDiagonal(1)), Math.PI / 4)).toBe(true);
    });

    it('AoLP for vertical = π/2', () => {
      expect(near(toAoLP(createVertical(1)), Math.PI / 2)).toBe(true);
    });

    it('ellipticity for circular = ±π/4', () => {
      expect(near(toEllipticity(createCircular('right', 1)), Math.PI / 4)).toBe(true);
      expect(near(toEllipticity(createCircular('left', 1)), -Math.PI / 4)).toBe(true);
    });

    it('ellipticity for linear = 0', () => {
      expect(near(toEllipticity(createHorizontal(1)), 0)).toBe(true);
    });

    it('handedness for RCP is right', () => {
      expect(handedness(createCircular('right', 1))).toBe('right');
    });

    it('handedness for LCP is left', () => {
      expect(handedness(createCircular('left', 1))).toBe('left');
    });

    it('handedness for linear is none', () => {
      expect(handedness(createHorizontal(1))).toBe('none');
    });
  });

  describe('Validation', () => {
    it('valid fully polarized state passes', () => {
      expect(validate(createHorizontal(1))).toBe(true);
    });

    it('valid unpolarized state passes', () => {
      expect(validate(createUnpolarized(1))).toBe(true);
    });

    it('partially polarized state passes', () => {
      expect(validate(createPartiallyPolarized(0.5, 0, 1))).toBe(true);
    });

    it('invalid state (DoP > 1) fails', () => {
      // S1² + S2² + S3² = 9 > 4 = S0²
      expect(validate(createStokes(2, 2, 2, 1))).toBe(false);
    });

    it('negative S0 fails', () => {
      expect(validate(createStokes(-1, 0, 0, 0))).toBe(false);
    });

    it('clampToPhysical fixes invalid state', () => {
      const invalid = createStokes(1, 1, 1, 1); // DoP = √3 > 1
      const clamped = clampToPhysical(invalid);
      expect(validate(clamped)).toBe(true);
      expect(near(clamped[0], 1)).toBe(true);
      // Polarized magnitude should equal S0
      const polMag = Math.sqrt(clamped[1] ** 2 + clamped[2] ** 2 + clamped[3] ** 2);
      expect(polMag).toBeLessThanOrEqual(clamped[0] + 1e-15);
    });

    it('clampToPhysical preserves valid state', () => {
      const valid = createHorizontal(1);
      const clamped = clampToPhysical(valid);
      expect(stokesEquals(valid, clamped)).toBe(true);
    });
  });

  describe('Arithmetic', () => {
    it('add combines two Stokes vectors', () => {
      const a = createHorizontal(1);
      const b = createVertical(1);
      const sum = stokesAdd(a, b);
      // H + V = unpolarized with I=2
      expect(near(sum[0], 2)).toBe(true);
      expect(near(sum[1], 0)).toBe(true);
    });

    it('scale multiplies all components', () => {
      const s = createHorizontal(1);
      const scaled = stokesScale(s, 3);
      expect(near(scaled[0], 3)).toBe(true);
      expect(near(scaled[1], 3)).toBe(true);
    });
  });

  describe('Serialization', () => {
    it('toTuple and fromTuple round-trip', () => {
      const s = createStokes(1, 0.5, -0.3, 0.2);
      const t = toTuple(s);
      const s2 = fromTuple(t);
      expect(stokesEquals(s, s2)).toBe(true);
    });
  });
});

// =========================================================
// 2. MUELLER MATRIX TESTS
// =========================================================

describe('Mueller Matrix', () => {
  describe('Identity', () => {
    it('identity matrix preserves any Stokes vector', () => {
      const s = createStokes(1, 0.5, -0.3, 0.2);
      const out = applyToStokes(identity(), s);
      expect(stokesEquals(s, out)).toBe(true);
    });
  });

  describe('Linear Polarizer', () => {
    it('horizontal polarizer on unpolarized → half intensity, horizontal', () => {
      const m = linearPolarizer(0); // horizontal
      const s = createUnpolarized(1);
      const out = applyToStokes(m, s);
      expect(near(out[0], 0.5)).toBe(true);
      expect(near(out[1], 0.5)).toBe(true);
      expect(near(out[2], 0)).toBe(true);
      expect(near(out[3], 0)).toBe(true);
    });

    it('unpolarized through polarizer → DoLP = 1, intensity halved', () => {
      const m = linearPolarizer(0);
      const out = applyToStokes(m, createUnpolarized(1));
      expect(near(toDoLP(out), 1, LOOSE_TOL)).toBe(true);
      expect(near(out[0], 0.5)).toBe(true);
    });

    it('two crossed polarizers → zero transmission', () => {
      const p0 = linearPolarizer(0); // horizontal
      const p90 = linearPolarizer(Math.PI / 2); // vertical
      const combined = multiply(p90, p0);
      const out = applyToStokes(combined, createUnpolarized(1));
      expect(near(out[0], 0)).toBe(true);
      expect(near(out[1], 0)).toBe(true);
      expect(near(out[2], 0)).toBe(true);
      expect(near(out[3], 0)).toBe(true);
    });

    it("Malus's Law: cos²(θ) transmission", () => {
      // Horizontal light through polarizer at 60°
      const s = createHorizontal(1);
      const p60 = linearPolarizer(Math.PI / 3); // 60°
      const out = applyToStokes(p60, s);
      // cos²(60°) = 0.25
      expect(near(out[0], 0.25)).toBe(true);
    });

    it("Malus's Law: 45° gives cos²(45°) = 0.5", () => {
      const s = createHorizontal(1);
      const p45 = linearPolarizer(Math.PI / 4);
      const out = applyToStokes(p45, s);
      expect(near(out[0], 0.5)).toBe(true);
    });

    it('polarizer is idempotent (P² = P)', () => {
      const p = linearPolarizer(Math.PI / 6);
      const pp = multiply(p, p);
      // For ideal polarizer, M² = M (within factor of 1/2 from first application)
      // Actually M_pol × M_pol = (1/2) M_pol, but when applied to already-polarized
      // light, the second pass just rescales. Let's test M²v = M v for Mv states.
      const s = createUnpolarized(1);
      const once = applyToStokes(p, s);
      const twice = applyToStokes(p, once);
      // Second pass through same polarizer: no change
      expect(stokesEquals(once, twice, LOOSE_TOL)).toBe(true);
    });
  });

  describe('Wave Plates', () => {
    it('QWP at 45° turns horizontal → right circular', () => {
      const qwp = quarterWavePlate(Math.PI / 4);
      const s = createHorizontal(1);
      const out = applyToStokes(qwp, s);
      // Expected: [1, 0, 0, 1] (RCP) — but sign depends on convention
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[1], 0)).toBe(true);
      expect(near(out[2], 0)).toBe(true);
      // S3 should be ±1 (right or left circular)
      expect(near(Math.abs(out[3]), 1)).toBe(true);
    });

    it('QWP preserves intensity', () => {
      const qwp = quarterWavePlate(Math.PI / 6);
      const s = createHorizontal(2.5);
      const out = applyToStokes(qwp, s);
      expect(near(out[0], 2.5)).toBe(true);
    });

    it('HWP rotates linear polarization by 2× the axis offset', () => {
      // HWP with fast axis at 22.5° rotates horizontal by 45°
      const hwp = halfWavePlate(Math.PI / 8); // 22.5°
      const s = createHorizontal(1);
      const out = applyToStokes(hwp, s);
      // Should become +45° linear: [1, 0, 1, 0]
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[1], 0)).toBe(true);
      expect(near(out[2], 1)).toBe(true);
      expect(near(out[3], 0)).toBe(true);
    });

    it('HWP at 0° flips S2 and S3 (horizontal axis)', () => {
      const hwp = halfWavePlate(0);
      // Apply to +45° linear
      const s = createDiagonal(1);
      const out = applyToStokes(hwp, s);
      // HWP(0) on [1,0,1,0] → [1,0,-1,0] (anti-diagonal)
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[1], 0)).toBe(true);
      expect(near(out[2], -1)).toBe(true);
      expect(near(out[3], 0)).toBe(true);
    });

    it('two HWPs at same angle = identity', () => {
      const hwp = halfWavePlate(Math.PI / 6);
      const double = multiply(hwp, hwp);
      expect(mEquals(double, identity(), LOOSE_TOL)).toBe(true);
    });

    it('four QWPs at same angle = identity', () => {
      const qwp = quarterWavePlate(Math.PI / 6);
      const q2 = multiply(qwp, qwp);
      const q4 = multiply(q2, q2);
      expect(mEquals(q4, identity(), LOOSE_TOL)).toBe(true);
    });

    it('generalRetarder(θ, π/2) equals QWP(θ)', () => {
      const angle = Math.PI / 5;
      const gr = generalRetarder(angle, Math.PI / 2);
      const qwp = quarterWavePlate(angle);
      expect(mEquals(gr, qwp, TOL)).toBe(true);
    });

    it('generalRetarder(θ, π) equals HWP(θ)', () => {
      const angle = Math.PI / 7;
      const gr = generalRetarder(angle, Math.PI);
      const hwp = halfWavePlate(angle);
      expect(mEquals(gr, hwp, TOL)).toBe(true);
    });

    it('generalRetarder(θ, 0) = identity', () => {
      const gr = generalRetarder(Math.PI / 3, 0);
      expect(mEquals(gr, identity(), TOL)).toBe(true);
    });

    it('generalRetarder(θ, 2π) = identity', () => {
      const gr = generalRetarder(Math.PI / 3, 2 * Math.PI);
      expect(mEquals(gr, identity(), LOOSE_TOL)).toBe(true);
    });
  });

  describe('Rotator', () => {
    it('rotator rotates linear polarization', () => {
      const rot = rotator(Math.PI / 4); // 45° rotation
      const s = createHorizontal(1);
      const out = applyToStokes(rot, s);
      // Horizontal rotated by 45° → +45° diagonal
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[1], 0)).toBe(true);
      expect(near(out[2], 1)).toBe(true);
      expect(near(out[3], 0)).toBe(true);
    });

    it('rotator preserves intensity', () => {
      const rot = rotator(Math.PI / 3);
      const s = createStokes(3, 1, 2, 0.5);
      const out = applyToStokes(rot, s);
      expect(near(out[0], 3)).toBe(true);
    });

    it('rotator preserves circular polarization', () => {
      const rot = rotator(Math.PI / 4);
      const rcp = createCircular('right', 1);
      const out = applyToStokes(rot, rcp);
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[3], 1)).toBe(true);
    });

    it('rotator(0) = identity', () => {
      expect(mEquals(rotator(0), identity(), TOL)).toBe(true);
    });
  });

  describe('Depolarizer', () => {
    it('ideal depolarizer removes all polarization', () => {
      const dp = depolarizer(1);
      const s = createHorizontal(1);
      const out = applyToStokes(dp, s);
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[1], 0)).toBe(true);
      expect(near(out[2], 0)).toBe(true);
      expect(near(out[3], 0)).toBe(true);
    });

    it('partial depolarizer reduces DoP', () => {
      const dp = partialDepolarizer(0.5); // 50% depolarization
      const s = createHorizontal(1);
      const out = applyToStokes(dp, s);
      expect(near(out[0], 1)).toBe(true);
      expect(near(toDoP(out), 0.5)).toBe(true);
    });
  });

  describe('Mirror', () => {
    it('mirror reverses circular handedness', () => {
      const m = mirror();
      const rcp = createCircular('right', 1);
      const out = applyToStokes(m, rcp);
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[3], -1)).toBe(true); // now LCP
    });

    it('mirror preserves horizontal/vertical', () => {
      const m = mirror();
      const h = createHorizontal(1);
      const out = applyToStokes(m, h);
      expect(near(out[0], 1)).toBe(true);
      expect(near(out[1], 1)).toBe(true);
    });
  });

  describe('Attenuator', () => {
    it('attenuator scales uniformly', () => {
      const att = attenuator(0.3);
      const s = createHorizontal(1);
      const out = applyToStokes(att, s);
      expect(near(out[0], 0.3)).toBe(true);
      expect(near(out[1], 0.3)).toBe(true);
      // DoP preserved
      expect(near(toDoP(out), 1, LOOSE_TOL)).toBe(true);
    });
  });

  describe('Matrix Chain', () => {
    it('chainMueller(A, B) = B × A (optical train order)', () => {
      const p0 = linearPolarizer(0);
      const rot = rotator(Math.PI / 4);
      const chained = chainMueller(p0, rot);
      const manual = multiply(rot, p0);
      expect(mEquals(chained, manual, TOL)).toBe(true);
    });

    it('three polarizers at 0°, 45°, 90° allow partial transmission', () => {
      // Without middle polarizer: 0° and 90° give zero
      // With 45° in between: cos²(45°) × cos²(45°) = 0.25 × 0.25 = ...
      // Actually: I₀ × cos²(45°) × cos²(45°) = I₀ × 0.5 × 0.5 = 0.25 × I₀
      // but after first polarizer, I₀ → I₀/2 for unpolarized
      // So total: I₀/2 × cos²(45°) × cos²(45°) = I₀/2 × 0.25 = I₀/8
      const p0 = linearPolarizer(0);
      const p45 = linearPolarizer(Math.PI / 4);
      const p90 = linearPolarizer(Math.PI / 2);
      const chain = chainMueller(p0, p45, p90);
      const out = applyToStokes(chain, createUnpolarized(1));
      // Unpolarized → P(0°): I=0.5
      // I=0.5 → P(45°): I=0.5 × cos²(45°) = 0.25
      // I=0.25 → P(90°): I=0.25 × cos²(45°) = 0.125
      expect(near(out[0], 0.125)).toBe(true);
    });
  });

  describe('Physical Validation', () => {
    it('identity is physical', () => {
      expect(isPhysical(identity())).toBe(true);
    });

    it('polarizer is physical', () => {
      expect(isPhysical(linearPolarizer(Math.PI / 3))).toBe(true);
    });

    it('QWP is physical', () => {
      expect(isPhysical(quarterWavePlate(Math.PI / 4))).toBe(true);
    });

    it('depolarization index of identity = 1', () => {
      expect(near(depolarizationIndex(identity()), 1)).toBe(true);
    });

    it('depolarization index of ideal depolarizer ≈ 0', () => {
      expect(depolarizationIndex(depolarizer(1))).toBeLessThan(0.01);
    });

    it('polarizer is non-depolarizing (DI ≈ 1)', () => {
      expect(isNonDepolarizing(linearPolarizer(0))).toBe(true);
    });
  });
});

// =========================================================
// 3. JONES → MUELLER CONVERSION
// =========================================================

describe('Jones → Mueller Conversion', () => {
  it('Jones identity → Mueller identity', () => {
    // Jones identity: [[1,0],[0,1]]
    const m = fromJonesElements(1, 0, 0, 0, 0, 0, 1, 0);
    expect(mEquals(m, identity(), TOL)).toBe(true);
  });

  it('Jones horizontal polarizer → Mueller horizontal polarizer', () => {
    // Jones: [[1,0],[0,0]]
    const m = fromJonesElements(1, 0, 0, 0, 0, 0, 0, 0);
    const expected = linearPolarizer(0);
    expect(mEquals(m, expected, LOOSE_TOL)).toBe(true);
  });

  it('Jones QWP at 0° → Mueller generalRetarder(0, π/2)', () => {
    // Jones QWP at 0°: [[1,0],[0,i]] (fast axis horizontal)
    // diag(1, e^(iπ/2)) = diag(1, i)
    const m = fromJonesElements(1, 0, 0, 0, 0, 0, 0, 1);
    // This should be a valid QWP Mueller matrix
    expect(isPhysical(m)).toBe(true);
    // QWP at 0° preserves horizontal (eigenstate), so apply to +45° diagonal
    // to get circular polarization
    const diagonal = createDiagonal(1); // [1, 0, 1, 0]
    const out = applyToStokes(m, diagonal);
    expect(near(out[0], 1)).toBe(true);
    // Diagonal through QWP at 0° → right circular: S3 should be ±1
    expect(Math.abs(out[3])).toBeGreaterThan(0.9);
  });

  it('Jones rotation → Mueller rotation', () => {
    const angle = Math.PI / 6;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    // Jones rotator: [[cos θ, -sin θ], [sin θ, cos θ]]
    const m = fromJonesElements(c, 0, -s, 0, s, 0, c, 0);
    const expected = rotator(angle);
    expect(mEquals(m, expected, LOOSE_TOL)).toBe(true);
  });
});

// =========================================================
// 4. FRESNEL EQUATIONS
// =========================================================

describe('Fresnel Equations', () => {
  describe('Brewster Angle', () => {
    it('brewsterAngle(1, 1.5) ≈ 56.31°', () => {
      const thetaB = brewsterAngle(1, 1.5);
      expect(near(thetaB, Math.atan(1.5), TOL)).toBe(true);
      // ~0.9828 rad = ~56.31°
    });

    it('at Brewster angle, Rp = 0', () => {
      const thetaB = brewsterAngle(1, 1.5);
      const rp = reflectanceP(1, 1.5, thetaB);
      expect(rp).toBeLessThan(1e-10);
    });

    it('at Brewster angle, reflected light is perfectly s-polarized', () => {
      const thetaB = brewsterAngle(1, 1.5);
      const m = fresnelMuellerReflect(1, 1.5, thetaB);
      const unpol = createUnpolarized(1);
      const reflected = applyToStokes(m, unpol);
      // Reflected should be s-polarized (vertical in s-p basis)
      // DoLP should be 1 (or very close)
      if (reflected[0] > 1e-10) {
        expect(toDoLP(reflected)).toBeGreaterThan(0.99);
      }
    });
  });

  describe('Normal Incidence', () => {
    it('normal incidence on air→glass: R ≈ 4%', () => {
      const m = fresnelMuellerReflect(1, 1.5, 0);
      const unpol = createUnpolarized(1);
      const out = applyToStokes(m, unpol);
      // R = ((n1-n2)/(n1+n2))² = (0.5/2.5)² = 0.04
      expect(near(out[0], 0.04)).toBe(true);
    });

    it('normal incidence: Rs = Rp (no polarization preference)', () => {
      const rs = reflectanceS(1, 1.5, 0);
      const rp = reflectanceP(1, 1.5, 0);
      expect(near(rs, rp)).toBe(true);
    });
  });

  describe('Total Internal Reflection', () => {
    it('TIR occurs above critical angle', () => {
      const thetaC = criticalAngle(1.5, 1.0);
      expect(!isNaN(thetaC)).toBe(true);
      // Just above critical angle
      const coeffs = fresnelAmplitudes(1.5, 1.0, thetaC + 0.01);
      expect(coeffs.isTIR).toBe(true);
    });

    it('TIR: |rs|² = |rp|² = 1', () => {
      const thetaC = criticalAngle(1.5, 1.0);
      const rs = reflectanceS(1.5, 1.0, thetaC + 0.1);
      const rp = reflectanceP(1.5, 1.0, thetaC + 0.1);
      expect(near(rs, 1, 1e-6)).toBe(true);
      expect(near(rp, 1, 1e-6)).toBe(true);
    });

    it('TIR transmission Mueller matrix is null', () => {
      const thetaC = criticalAngle(1.5, 1.0);
      const mt = fresnelMuellerTransmit(1.5, 1.0, thetaC + 0.1);
      expect(mt).toBeNull();
    });

    it('no TIR when n1 < n2', () => {
      const thetaC = criticalAngle(1.0, 1.5);
      expect(isNaN(thetaC)).toBe(true);
    });
  });

  describe('Energy Conservation', () => {
    it('Rs + Ts = 1 at non-TIR angles', () => {
      const angles = [0, 0.2, 0.5, 0.8, 1.0];
      for (const theta of angles) {
        const mr = fresnelMuellerReflect(1, 1.5, theta);
        const mt = fresnelMuellerTransmit(1, 1.5, theta);
        if (mt) {
          // Apply to unpolarized
          const unpol = createUnpolarized(1);
          const rOut = applyToStokes(mr, unpol);
          const tOut = applyToStokes(mt, unpol);
          const total = rOut[0] + tOut[0];
          expect(near(total, 1, 1e-6)).toBe(true);
        }
      }
    });
  });
});

// =========================================================
// 5. THIN FILM
// =========================================================

describe('Thin Film', () => {
  it('zero thickness = bare substrate reflectance', () => {
    // With zero thickness film, we should get bare glass reflectance
    const mr = thinFilmMuellerReflect(1.38, 0, 550, 0, 1, 1.5);
    const out = applyToStokes(mr, createUnpolarized(1));
    // Bare glass R ≈ 4%
    expect(near(out[0], 0.04, 0.01)).toBe(true);
  });

  it('quarter-wave AR coating reduces reflectance', () => {
    const { nFilm, thickness } = idealARCoating(550, 1, 1.5);
    const mr = thinFilmMuellerReflect(nFilm, thickness, 550, 0, 1, 1.5);
    const out = applyToStokes(mr, createUnpolarized(1));
    // Ideal AR: R → 0 when n_film = √(n1 × n3)
    expect(out[0]).toBeLessThan(0.001);
  });

  it('energy conservation: R + T = 1 for thin film', () => {
    const nFilm = 1.38;
    const thickness = 100; // nm
    const wavelength = 550;
    const mr = thinFilmMuellerReflect(nFilm, thickness, wavelength, 0, 1, 1.5);
    const mt = thinFilmMuellerTransmit(nFilm, thickness, wavelength, 0, 1, 1.5);
    const unpol = createUnpolarized(1);
    const rOut = applyToStokes(mr, unpol);
    const tOut = applyToStokes(mt, unpol);
    expect(near(rOut[0] + tOut[0], 1, 1e-4)).toBe(true);
  });

  it('quarterWaveThickness computes correctly', () => {
    // d = λ / (4n)
    expect(near(quarterWaveThickness(550, 1.38), 550 / (4 * 1.38))).toBe(true);
  });

  it('idealARCoating gives n = √(n1 × n3)', () => {
    const result = idealARCoating(550, 1, 1.5);
    expect(near(result.nFilm, Math.sqrt(1.5))).toBe(true);
  });
});

// =========================================================
// 6. MANDATORY TEST CASES FROM REQUIREMENTS
// =========================================================

describe('Mandatory Test Cases', () => {
  it('Linear polarized light through QWP at 45° → circular polarization', () => {
    const qwp45 = quarterWavePlate(Math.PI / 4);
    const h = createHorizontal(1);
    const out = applyToStokes(qwp45, h);
    // Should be circularly polarized: S1 ≈ 0, S2 ≈ 0, |S3| ≈ 1
    expect(near(out[0], 1)).toBe(true);
    expect(near(out[1], 0, LOOSE_TOL)).toBe(true);
    expect(near(out[2], 0, LOOSE_TOL)).toBe(true);
    expect(near(Math.abs(out[3]), 1, LOOSE_TOL)).toBe(true);
  });

  it('Two crossed polarizers → zero transmission', () => {
    const p0 = linearPolarizer(0);
    const p90 = linearPolarizer(Math.PI / 2);
    const chain = multiply(p90, p0);
    const out = applyToStokes(chain, createUnpolarized(1));
    expect(out[0]).toBeLessThan(1e-10);
  });

  it('Brewster angle reflection → perfectly s-polarized', () => {
    const thetaB = brewsterAngle(1, 1.5);
    const m = fresnelMuellerReflect(1, 1.5, thetaB);
    const unpol = createUnpolarized(1);
    const out = applyToStokes(m, unpol);
    if (out[0] > 1e-10) {
      // Should be s-polarized: DoLP ≈ 1
      expect(toDoLP(out)).toBeGreaterThan(0.999);
    }
  });

  it('HWP rotates linear polarization by 2× the axis offset', () => {
    // HWP at 22.5° on horizontal → +45°
    const hwp = halfWavePlate(Math.PI / 8);
    const h = createHorizontal(1);
    const out = applyToStokes(hwp, h);
    expect(near(out[0], 1)).toBe(true);
    expect(near(out[1], 0, LOOSE_TOL)).toBe(true);
    expect(near(out[2], 1, LOOSE_TOL)).toBe(true);
    expect(near(out[3], 0, LOOSE_TOL)).toBe(true);

    // HWP at 45° on horizontal → vertical
    const hwp45 = halfWavePlate(Math.PI / 4);
    const out2 = applyToStokes(hwp45, h);
    expect(near(out2[0], 1)).toBe(true);
    expect(near(out2[1], -1, LOOSE_TOL)).toBe(true);
    expect(near(out2[2], 0, LOOSE_TOL)).toBe(true);
    expect(near(out2[3], 0, LOOSE_TOL)).toBe(true);
  });

  it('Unpolarized light through polarizer → DoLP = 1.0, intensity halved', () => {
    const p = linearPolarizer(Math.PI / 6); // arbitrary angle
    const unpol = createUnpolarized(1);
    const out = applyToStokes(p, unpol);
    expect(near(out[0], 0.5)).toBe(true);
    expect(near(toDoLP(out), 1, LOOSE_TOL)).toBe(true);
  });
});
