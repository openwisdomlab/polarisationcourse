/**
 * Colyseus Schema Definitions for PolarCraft
 * These schemas are synchronized between server and clients
 */
import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema'

/**
 * Position in 3D space
 */
export class Position extends Schema {
  @type('number') x: number = 0
  @type('number') y: number = 0
  @type('number') z: number = 0
}

/**
 * Block state representation
 */
export class BlockState extends Schema {
  @type('string') type: string = 'solid'
  @type('number') rotation: number = 0
  @type('number') polarizationAngle: number = 0
  @type('number') rotationAmount: number = 45
  @type('boolean') activated: boolean = false
  @type('number') requiredIntensity: number = 1
  @type('string') facing: string = 'north'
}

/**
 * Block in the world
 */
export class Block extends Schema {
  @type(Position) position: Position = new Position()
  @type(BlockState) state: BlockState = new BlockState()
}

/**
 * Light packet for physics
 */
export class LightPacket extends Schema {
  @type('string') direction: string = 'north'
  @type('number') intensity: number = 15
  @type('number') polarization: number = 0
  @type('number') phase: number = 1
}

/**
 * Player state
 */
export class Player extends Schema {
  @type('string') id: string = ''
  @type('string') name: string = ''
  @type(Position) position: Position = new Position()
  @type('number') rotation: number = 0
  @type('number') score: number = 0
  @type('string') selectedBlockType: string = 'emitter'
  @type('boolean') isReady: boolean = false
}

/**
 * Main game room state
 */
export class PolarCraftState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>()
  @type({ map: Block }) blocks = new MapSchema<Block>()
  @type('number') levelIndex: number = 0
  @type('boolean') levelComplete: boolean = false
  @type('number') startTime: number = 0
  @type('number') elapsedTime: number = 0
  @type('boolean') isPaused: boolean = false
}
