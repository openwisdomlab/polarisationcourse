/**
 * PhysicalPhenomenonReport (物理现象报告)
 *
 * Implements Pillar 4: The AI Observer Interface.
 *
 * The AI sees the world through physics data, not pixels. This module
 * generates structured phenomenon reports from WorldState that allow
 * an AI agent to explain EXACTLY why light stopped, citing the physical
 * law responsible.
 *
 * Output format is optimized for LLM consumption:
 * - Structured JSON events with causal chains
 * - Physical law citations for each interaction
 * - Sensor diagnostics with actionable failure reasons
 * - Energy flow tracking through the optical system
 *
 * Example output:
 * ```json
 * {
 *   "events": [
 *     {
 *       "at": "QuarterWavePlate",
 *       "input": "Linear-Vertical",
 *       "output": "Circular-Right",
 *       "transmittance": 1.0,
 *       "law": "Quarter-Wave Plate: linear -> circular conversion"
 *     },
 *     {
 *       "at": "Sensor",
 *       "intensity": 0.0,
 *       "reason": "Orthogonal Polarization Blocked"
 *     }
 *   ]
 * }
 * ```
 */

import type {
  WorldState,
  InteractionRecord,
  SensorReading,
  BeamSegmentState,
} from './OpticalSimulationLoop';

// ========== Report Types ==========

/**
 * A single phenomenon event — what happened at an optical element.
 */
export interface PhenomenonEvent {
  /** Element ID where this occurred */
  at: string;
  /** Element type (human-readable) */
  elementType: string;
  /** Input state label (e.g., "Linear-Vertical") */
  input: string;
  /** Output state label (e.g., "Circular-Right") */
  output: string;
  /** Transmittance ratio (0-1) */
  transmittance: number;
  /** Physical law citation */
  law: string;
  /** Whether energy was conserved at this interaction */
  energyConserved: boolean;
}

/**
 * A sensor status event — what the detector is reading.
 */
export interface SensorEvent {
  /** Sensor ID */
  at: string;
  /** Received intensity as percentage */
  intensity: number;
  /** Whether activated */
  activated: boolean;
  /** Reason for current state */
  reason: string;
  /** Received polarization description */
  receivedPolarization: string;
  /** Degree of polarization */
  degreeOfPolarization: number;
}

/**
 * Energy flow summary for the entire system.
 */
export interface EnergyFlowSummary {
  /** Total input energy (from all emitters) */
  totalInput: number;
  /** Total detected energy (at all sensors) */
  totalDetected: number;
  /** Energy absorbed/lost in the system */
  energyLoss: number;
  /** Loss percentage */
  lossPercent: number;
  /** Whether conservation holds (no gain) */
  conserved: boolean;
}

/**
 * Beam topology summary — how light branches through the system.
 */
export interface BeamTopology {
  /** Total number of beam segments */
  totalSegments: number;
  /** Number of unique sources */
  sourceCount: number;
  /** Number of split points (where one beam becomes two) */
  splitPoints: number;
  /** Maximum beam tree depth */
  maxDepth: number;
}

/**
 * The complete Physical Phenomenon Report.
 *
 * Designed for direct injection into LLM context.
 * An AI agent reading this report can:
 * 1. Explain what each optical element did to the light
 * 2. Cite the specific physical law responsible
 * 3. Diagnose why sensors are not activated
 * 4. Suggest corrections based on physics principles
 */
export interface PhysicalPhenomenonReport {
  /** Version of the WorldState this report was generated from */
  worldStateVersion: number;
  /** Timestamp */
  timestamp: number;

  /** Ordered list of physical interactions */
  events: PhenomenonEvent[];

  /** Sensor status reports */
  sensors: SensorEvent[];

  /** Energy flow through the system */
  energyFlow: EnergyFlowSummary;

  /** Beam topology */
  topology: BeamTopology;

  /** One-paragraph natural language summary */
  narrative: string;

  /** Causal chain explanation (why is the puzzle in its current state) */
  causalExplanation: string;
}

// ========== Report Generator ==========

/**
 * Generate a Physical Phenomenon Report from a WorldState.
 *
 * This is the primary interface for the AI Observer.
 */
export function generatePhenomenonReport(worldState: WorldState): PhysicalPhenomenonReport {
  const events = buildPhenomenonEvents(worldState.interactions);
  const sensors = buildSensorEvents(worldState.sensorReadings);
  const energyFlow = buildEnergyFlow(worldState);
  const topology = buildTopology(worldState.segments);
  const narrative = buildNarrative(events, sensors, energyFlow);
  const causalExplanation = buildCausalExplanation(events, sensors);

  return {
    worldStateVersion: worldState.version,
    timestamp: worldState.timestamp,
    events,
    sensors,
    energyFlow,
    topology,
    narrative,
    causalExplanation,
  };
}

// ========== Event Builders ==========

function buildPhenomenonEvents(interactions: InteractionRecord[]): PhenomenonEvent[] {
  return interactions.map(ir => ({
    at: ir.elementId,
    elementType: ir.elementType,
    input: ir.inputState.label,
    output: ir.outputState.label,
    transmittance: Math.round(ir.transmittance * 1000) / 1000,
    law: ir.physicalLaw,
    energyConserved: ir.energyConserved,
  }));
}

function buildSensorEvents(sensorReadings: Map<string, SensorReading>): SensorEvent[] {
  return Array.from(sensorReadings.entries()).map(([sensorId, reading]) => {
    let reason: string;
    if (reading.activated) {
      reason = `Receiving sufficient light: ${(reading.intensity * 100).toFixed(1)}% intensity, ${reading.description.label}`;
    } else if (reading.intensity === 0) {
      reason = 'No light reaching this sensor — beam may need to be redirected';
    } else if (reading.failureReasons.length > 0) {
      reason = reading.failureReasons.join('; ');
    } else {
      reason = 'Insufficient intensity or polarization mismatch';
    }

    return {
      at: sensorId,
      intensity: Math.round(reading.intensity * 1000) / 1000,
      activated: reading.activated,
      reason,
      receivedPolarization: reading.description.label,
      degreeOfPolarization: Math.round(reading.degreeOfPolarization * 1000) / 1000,
    };
  });
}

function buildEnergyFlow(worldState: WorldState): EnergyFlowSummary {
  const totalInput = worldState.totalInputEnergy;
  const totalDetected = worldState.totalOutputEnergy;
  const energyLoss = totalInput - totalDetected;
  const lossPercent = totalInput > 0 ? (energyLoss / totalInput) * 100 : 0;

  return {
    totalInput: Math.round(totalInput * 1000) / 1000,
    totalDetected: Math.round(totalDetected * 1000) / 1000,
    energyLoss: Math.round(energyLoss * 1000) / 1000,
    lossPercent: Math.round(lossPercent * 10) / 10,
    conserved: worldState.energyConserved,
  };
}

function buildTopology(segments: BeamSegmentState[]): BeamTopology {
  const sourceIds = new Set(segments.map(s => s.sourceId));

  // Count split points: rays that have parentSegmentId set
  const splitPoints = segments.filter(s => s.parentSegmentId).length;

  // Estimate max depth by looking at segment IDs (child rays have incrementing IDs)
  const maxDepth = segments.reduce((max, seg) => {
    const parts = seg.rayId.split('_');
    const num = parseInt(parts[parts.length - 1], 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return {
    totalSegments: segments.length,
    sourceCount: sourceIds.size,
    splitPoints,
    maxDepth,
  };
}

// ========== Narrative Builders ==========

function buildNarrative(
  events: PhenomenonEvent[],
  sensors: SensorEvent[],
  energyFlow: EnergyFlowSummary,
): string {
  const parts: string[] = [];

  // System overview
  if (events.length === 0) {
    parts.push('No optical interactions occurred in the system.');
  } else {
    parts.push(`Light passed through ${events.length} optical element${events.length !== 1 ? 's' : ''}.`);
  }

  // Key interactions
  const significantEvents = events.filter(e => e.transmittance < 0.9 || e.transmittance === 0);
  if (significantEvents.length > 0) {
    const descriptions = significantEvents.map(e => {
      if (e.transmittance === 0) return `${e.elementType} completely blocked the light`;
      return `${e.elementType} transmitted ${(e.transmittance * 100).toFixed(0)}% (${e.input} -> ${e.output})`;
    });
    parts.push(`Key interactions: ${descriptions.join('; ')}.`);
  }

  // Sensor summary
  const activatedSensors = sensors.filter(s => s.activated);
  const totalSensors = sensors.length;
  if (totalSensors > 0) {
    parts.push(`${activatedSensors.length}/${totalSensors} sensors activated.`);
  }

  // Energy
  parts.push(`Energy: ${(energyFlow.lossPercent).toFixed(0)}% lost in system (${energyFlow.conserved ? 'conservation OK' : 'CONSERVATION VIOLATION'}).`);

  return parts.join(' ');
}

function buildCausalExplanation(
  events: PhenomenonEvent[],
  sensors: SensorEvent[],
): string {
  const inactiveSensors = sensors.filter(s => !s.activated);

  if (inactiveSensors.length === 0) {
    return 'All sensors are receiving sufficient light with correct polarization. The optical path is complete.';
  }

  const explanations: string[] = [];

  for (const sensor of inactiveSensors) {
    if (sensor.intensity === 0) {
      // Trace back through events to find where light was lost
      const blockingEvents = events.filter(e => e.transmittance === 0);
      if (blockingEvents.length > 0) {
        const blocker = blockingEvents[blockingEvents.length - 1];
        explanations.push(
          `Sensor "${sensor.at}" receives no light because ${blocker.elementType} (${blocker.at}) blocked the beam completely. ` +
          `Physical law: ${blocker.law}. The input was ${blocker.input} but the element requires a different polarization.`
        );
      } else {
        explanations.push(
          `Sensor "${sensor.at}" receives no light. The beam may not be directed toward this sensor. ` +
          `Consider adding a mirror or adjusting component positions.`
        );
      }
    } else {
      explanations.push(
        `Sensor "${sensor.at}" is receiving ${(sensor.intensity * 100).toFixed(1)}% intensity ` +
        `(${sensor.receivedPolarization}), but: ${sensor.reason}.`
      );
    }
  }

  return explanations.join(' ');
}

// ========== Serialization ==========

/**
 * Serialize a report to a compact JSON string suitable for LLM context injection.
 *
 * Omits redundant fields and rounds numbers for readability.
 */
export function serializeReport(report: PhysicalPhenomenonReport): string {
  return JSON.stringify({
    version: report.worldStateVersion,
    events: report.events.map(e => ({
      at: e.at,
      type: e.elementType,
      input: e.input,
      output: e.output,
      transmittance: e.transmittance,
      law: e.law,
    })),
    sensors: report.sensors.map(s => ({
      at: s.at,
      intensity: s.intensity,
      activated: s.activated,
      reason: s.reason,
    })),
    energy: report.energyFlow,
    narrative: report.narrative,
    causal: report.causalExplanation,
  }, null, 2);
}
