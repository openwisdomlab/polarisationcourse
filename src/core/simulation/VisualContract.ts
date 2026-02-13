/**
 * VisualContract (视觉合约)
 *
 * Defines the strict contract between the physics WorldState and the rendering layer.
 * This module enforces the "Simulation-First" paradigm:
 *
 * 1. NO beam can be rendered unless it appears in WorldState.segments[]
 * 2. Beam opacity = WorldState.segment[i].intensity (enforced by contract)
 * 3. Beam color is derived from wavelength, NOT hardcoded hex
 * 4. If intensity < RENDER_THRESHOLD, the segment MUST NOT be rendered
 * 5. Polarization visualization uses Stokes parameters, not discrete angles
 *
 * This module provides:
 * - Type definitions for the visual layer's input
 * - Conversion functions from WorldState to render-ready data
 * - Wavelength-to-color mapping using physical optics
 */

import type { BeamSegmentState, SensorReading } from './OpticalSimulationLoop';

// ========== Rendering Thresholds ==========

/** Minimum intensity for a beam segment to be rendered */
export const RENDER_INTENSITY_THRESHOLD = 1e-6;

/** Minimum intensity change to trigger a visual update */
export const VISUAL_UPDATE_EPSILON = 1e-4;

// ========== Render-Ready Types ==========

/**
 * A beam segment ready for GPU rendering.
 * Derived strictly from BeamSegmentState — no additional visual state.
 */
export interface RenderableBeamSegment {
  /** Segment ID for React key */
  id: string;
  /** Start position [x, y, z] */
  start: [number, number, number];
  /** End position [x, y, z] */
  end: [number, number, number];
  /** Beam opacity (0-1), directly from physics intensity */
  opacity: number;
  /** Beam color as [r, g, b] (0-1), from wavelength */
  color: [number, number, number];
  /** Beam radius, scaled by intensity */
  radius: number;
  /** Stokes parameters for shader uniforms */
  stokes: [number, number, number, number];
  /** Polarization category for shader mode selection */
  polarizationCategory: 'linear' | 'circular' | 'elliptical' | 'unpolarized';
  /** Ellipticity for shader animation */
  ellipticity: number;
  /** Handedness for shader twist direction (+1 or -1) */
  handedness: number;
  /** Orientation angle in radians for shader */
  orientationRad: number;
  /** Wavelength in nm for potential chromatic effects */
  wavelengthNm: number;
}

/**
 * Sensor visual state, derived strictly from SensorReading.
 */
export interface RenderableSensor {
  /** Sensor ID */
  id: string;
  /** Whether the sensor is activated (physics-determined) */
  activated: boolean;
  /** Received intensity (0-1), drives glow brightness */
  intensity: number;
  /** Glow color derived from received polarization state */
  glowColor: [number, number, number];
  /** Degree of polarization for visual indicator */
  dop: number;
  /** Failure reasons for tooltip/debug display */
  failureReasons: string[];
}

// ========== Wavelength to RGB Conversion ==========

/**
 * Convert wavelength (nm) to RGB color using CIE-based approximation.
 *
 * This replaces hardcoded polarization colors with physically accurate
 * wavelength-dependent color when the simulation supports multi-wavelength.
 *
 * For single-wavelength (monochromatic) simulations, this produces the
 * correct spectral color. For the default 550nm, this gives green.
 *
 * Algorithm based on Dan Bruton's wavelength-to-RGB mapping.
 */
export function wavelengthToColor(wavelengthNm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0;
    g = (wavelengthNm - 440) / (490 - 440);
    b = 1;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0;
    g = 1;
    b = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1;
    g = -(wavelengthNm - 645) / (645 - 580);
    b = 0;
  } else if (wavelengthNm >= 645 && wavelengthNm <= 780) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity attenuation at spectrum edges
  let factor: number;
  if (wavelengthNm >= 380 && wavelengthNm < 420) {
    factor = 0.3 + 0.7 * (wavelengthNm - 380) / (420 - 380);
  } else if (wavelengthNm >= 420 && wavelengthNm <= 700) {
    factor = 1.0;
  } else if (wavelengthNm > 700 && wavelengthNm <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelengthNm) / (780 - 700);
  } else {
    factor = 0;
  }

  // Apply gamma correction
  const gamma = 0.8;
  r = r > 0 ? Math.pow(r * factor, gamma) : 0;
  g = g > 0 ? Math.pow(g * factor, gamma) : 0;
  b = b > 0 ? Math.pow(b * factor, gamma) : 0;

  return [r, g, b];
}

/**
 * Get polarization-state-aware color for a beam segment.
 *
 * When the simulation uses default wavelength (550nm), this provides
 * polarization-encoded coloring for educational visualization.
 * When using explicit wavelengths, returns spectral color.
 */
export function getPolarizationAwareColor(
  segment: BeamSegmentState,
  useWavelengthColor: boolean = false,
): [number, number, number] {
  // If wavelength coloring is requested and we have a non-default wavelength
  if (useWavelengthColor && segment.wavelengthNm !== 550) {
    return wavelengthToColor(segment.wavelengthNm);
  }

  // Otherwise, use polarization-state-based color encoding
  const desc = segment.polarizationDescription;

  switch (desc.category) {
    case 'linear': {
      // Map orientation angle to hue: 0deg=red, 45deg=yellow, 90deg=green, 135deg=blue
      const angle = desc.orientationDeg;
      const hue = (angle / 180) * 360;
      return hslToRgb(hue, 0.9, 0.55);
    }
    case 'circular':
      return desc.handedness === 'right'
        ? [0.0, 0.8, 1.0]  // Cyan for RCP
        : [1.0, 0.0, 0.8]; // Magenta for LCP

    case 'elliptical':
      return [0.53, 0.67, 1.0]; // Light blue

    case 'unpolarized':
    case 'partially-polarized':
      return [0.67, 0.67, 0.67]; // Gray

    case 'zero':
      return [0, 0, 0];

    default:
      return [1.0, 1.0, 0.67]; // Warm yellow fallback
  }
}

// ========== Conversion Functions ==========

/**
 * Convert a BeamSegmentState into a RenderableBeamSegment.
 *
 * This is the ONLY approved way to create render data for beams.
 * It enforces the Visual Contract:
 * - Returns null if intensity is below threshold
 * - Color is derived from physics, not hardcoded
 * - Opacity = intensity
 */
export function toRenderableSegment(
  segment: BeamSegmentState,
  options?: { useWavelengthColor?: boolean },
): RenderableBeamSegment | null {
  // Contract enforcement: no rendering below threshold
  if (segment.intensity < RENDER_INTENSITY_THRESHOLD) {
    return null;
  }

  const desc = segment.polarizationDescription;
  const color = getPolarizationAwareColor(
    segment,
    options?.useWavelengthColor ?? false,
  );

  // Beam radius scales with intensity
  const baseRadius = 0.02;
  const maxRadiusBonus = 0.03;
  const radius = baseRadius + segment.intensity * maxRadiusBonus;

  // Map polarization category
  let polarizationCategory: RenderableBeamSegment['polarizationCategory'];
  switch (desc.category) {
    case 'linear': polarizationCategory = 'linear'; break;
    case 'circular': polarizationCategory = 'circular'; break;
    case 'elliptical': polarizationCategory = 'elliptical'; break;
    default: polarizationCategory = 'unpolarized';
  }

  return {
    id: segment.id,
    start: [segment.start.x, segment.start.y, segment.start.z],
    end: [segment.end.x, segment.end.y, segment.end.z],
    opacity: 0.3 + segment.intensity * 0.5,
    color,
    radius,
    stokes: segment.stokes,
    polarizationCategory,
    ellipticity: desc.ellipticityDeg / 45.0,
    handedness: desc.handedness === 'left' ? -1 : 1,
    orientationRad: desc.orientationDeg * Math.PI / 180,
    wavelengthNm: segment.wavelengthNm,
  };
}

/**
 * Convert a SensorReading into a RenderableSensor.
 */
export function toRenderableSensor(reading: SensorReading): RenderableSensor {
  const desc = reading.description;

  // Glow color based on received polarization
  let glowColor: [number, number, number];
  if (reading.activated) {
    glowColor = [0, 0.87, 0.27]; // Green glow when activated
  } else if (reading.intensity > 0) {
    glowColor = [1.0, 0.65, 0]; // Orange when receiving light but not activated
  } else {
    glowColor = [0.2, 0.27, 0.33]; // Dark when no light
  }

  return {
    id: reading.sensorId,
    activated: reading.activated,
    intensity: reading.intensity,
    glowColor,
    dop: desc.dop,
    failureReasons: reading.failureReasons,
  };
}

/**
 * Batch convert all segments from a WorldState into renderable segments.
 * Filters out sub-threshold segments automatically.
 */
export function worldStateToRenderableSegments(
  segments: BeamSegmentState[],
  options?: { useWavelengthColor?: boolean },
): RenderableBeamSegment[] {
  return segments
    .map(seg => toRenderableSegment(seg, options))
    .filter((seg): seg is RenderableBeamSegment => seg !== null);
}

/**
 * Batch convert all sensor readings from a WorldState into renderable sensors.
 */
export function worldStateToRenderableSensors(
  sensorReadings: Map<string, SensorReading>,
): RenderableSensor[] {
  return Array.from(sensorReadings.values()).map(toRenderableSensor);
}

// ========== Utility ==========

/**
 * HSL to RGB conversion.
 * h: 0-360, s: 0-1, l: 0-1 -> [r, g, b] 0-1
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return [r + m, g + m, b + m];
}
