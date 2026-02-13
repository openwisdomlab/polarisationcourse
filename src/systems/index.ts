/**
 * Systems Module (系统模块)
 *
 * Game systems that consume physics data from the simulation layer.
 * These systems implement the "Causal Link" — game mechanics that
 * listen to physics, not user input.
 */

export {
  SensorSystem,
  sensorSystem,
  createSensorConfig,
  type SensorConfig,
  type SensorCheckResult,
  type LevelCheckResult,
  type SensorEvent,
  type SensorEventType,
  type SensorEventHandler,
} from './SensorSystem';
