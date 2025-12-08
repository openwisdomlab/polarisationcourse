/**
 * PolarCraft Colyseus Room
 * Handles real-time multiplayer game sessions
 */
import { Room, Client } from '@colyseus/core'
import { PolarCraftState, Player, Position, Block, BlockState } from '../schemas/game.schema'

interface JoinOptions {
  name?: string
  levelIndex?: number
}

interface BlockPlaceMessage {
  position: { x: number; y: number; z: number }
  type: string
  state?: Partial<BlockState>
}

interface BlockRemoveMessage {
  position: { x: number; y: number; z: number }
}

interface PlayerMoveMessage {
  position: { x: number; y: number; z: number }
  rotation: number
}

export class PolarCraftRoom extends Room<PolarCraftState> {
  maxClients = 4 // Maximum players per room

  onCreate(options: JoinOptions) {
    this.setState(new PolarCraftState())
    this.state.startTime = Date.now()
    this.state.levelIndex = options.levelIndex || 0

    // Set up message handlers
    this.onMessage('move', (client, message: PlayerMoveMessage) => {
      this.handlePlayerMove(client, message)
    })

    this.onMessage('place_block', (client, message: BlockPlaceMessage) => {
      this.handleBlockPlace(client, message)
    })

    this.onMessage('remove_block', (client, message: BlockRemoveMessage) => {
      this.handleBlockRemove(client, message)
    })

    this.onMessage('rotate_block', (client, message: { position: { x: number; y: number; z: number } }) => {
      this.handleBlockRotate(client, message)
    })

    this.onMessage('change_level', (client, message: { levelIndex: number }) => {
      this.handleLevelChange(client, message)
    })

    this.onMessage('ready', (client) => {
      this.handlePlayerReady(client)
    })

    this.onMessage('chat', (client, message: { text: string }) => {
      this.handleChat(client, message)
    })

    // Set up game loop
    this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / 20) // 20 ticks/second

    console.log(`Room ${this.roomId} created`)
  }

  onJoin(client: Client, options: JoinOptions) {
    console.log(`Player ${client.sessionId} joined room ${this.roomId}`)

    // Create new player
    const player = new Player()
    player.id = client.sessionId
    player.name = options.name || `Player ${this.state.players.size + 1}`
    player.position = new Position()
    player.position.x = Math.random() * 4 - 2
    player.position.y = 1
    player.position.z = Math.random() * 4 - 2

    this.state.players.set(client.sessionId, player)

    // Broadcast join event
    this.broadcast('player_joined', {
      id: client.sessionId,
      name: player.name,
    })
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`Player ${client.sessionId} left room ${this.roomId}`)

    const player = this.state.players.get(client.sessionId)
    if (player) {
      // Broadcast leave event
      this.broadcast('player_left', {
        id: client.sessionId,
        name: player.name,
      })

      this.state.players.delete(client.sessionId)
    }
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposed`)
  }

  // Game logic handlers

  private handlePlayerMove(client: Client, message: PlayerMoveMessage) {
    const player = this.state.players.get(client.sessionId)
    if (!player) return

    player.position.x = message.position.x
    player.position.y = message.position.y
    player.position.z = message.position.z
    player.rotation = message.rotation
  }

  private handleBlockPlace(client: Client, message: BlockPlaceMessage) {
    const { position, type, state } = message
    const key = `${position.x},${position.y},${position.z}`

    // Check if block already exists
    if (this.state.blocks.has(key)) {
      client.send('error', { message: 'Block already exists at this position' })
      return
    }

    // Create new block
    const block = new Block()
    block.position = new Position()
    block.position.x = position.x
    block.position.y = position.y
    block.position.z = position.z
    block.state = new BlockState()
    block.state.type = type

    // Apply custom state if provided
    if (state) {
      if (state.rotation !== undefined) block.state.rotation = state.rotation
      if (state.polarizationAngle !== undefined) block.state.polarizationAngle = state.polarizationAngle
      if (state.rotationAmount !== undefined) block.state.rotationAmount = state.rotationAmount
      if (state.facing !== undefined) block.state.facing = state.facing
    }

    this.state.blocks.set(key, block)

    // Broadcast to all clients
    this.broadcast('block_placed', {
      key,
      position,
      type,
      state: block.state,
      playerId: client.sessionId,
    })

    // Check level completion
    this.checkLevelCompletion()
  }

  private handleBlockRemove(client: Client, message: BlockRemoveMessage) {
    const { position } = message
    const key = `${position.x},${position.y},${position.z}`

    if (!this.state.blocks.has(key)) {
      client.send('error', { message: 'No block at this position' })
      return
    }

    // Don't allow removing ground blocks
    if (position.y === 0) {
      client.send('error', { message: 'Cannot remove ground blocks' })
      return
    }

    this.state.blocks.delete(key)

    // Broadcast to all clients
    this.broadcast('block_removed', {
      key,
      position,
      playerId: client.sessionId,
    })
  }

  private handleBlockRotate(client: Client, message: { position: { x: number; y: number; z: number } }) {
    const { position } = message
    const key = `${position.x},${position.y},${position.z}`

    const block = this.state.blocks.get(key)
    if (!block) {
      client.send('error', { message: 'No block at this position' })
      return
    }

    // Rotate block state
    block.state.rotation = (block.state.rotation + 90) % 360

    // For emitters and polarizers, cycle polarization angle
    if (block.state.type === 'emitter' || block.state.type === 'polarizer') {
      block.state.polarizationAngle = (block.state.polarizationAngle + 45) % 180
    }

    // For rotators, toggle rotation amount
    if (block.state.type === 'rotator') {
      block.state.rotationAmount = block.state.rotationAmount === 45 ? 90 : 45
    }

    // Broadcast rotation
    this.broadcast('block_rotated', {
      key,
      position,
      state: block.state,
      playerId: client.sessionId,
    })
  }

  private handleLevelChange(client: Client, message: { levelIndex: number }) {
    // Only allow level change if all players are ready or it's single player
    if (this.state.players.size > 1) {
      const allReady = Array.from(this.state.players.values()).every((p) => p.isReady)
      if (!allReady) {
        client.send('error', { message: 'All players must be ready to change level' })
        return
      }
    }

    this.state.levelIndex = message.levelIndex
    this.state.levelComplete = false
    this.state.blocks.clear()

    // Reset player ready states
    this.state.players.forEach((player) => {
      player.isReady = false
    })

    this.broadcast('level_changed', {
      levelIndex: message.levelIndex,
    })
  }

  private handlePlayerReady(client: Client) {
    const player = this.state.players.get(client.sessionId)
    if (!player) return

    player.isReady = !player.isReady

    this.broadcast('player_ready', {
      playerId: client.sessionId,
      isReady: player.isReady,
    })
  }

  private handleChat(client: Client, message: { text: string }) {
    const player = this.state.players.get(client.sessionId)
    if (!player) return

    this.broadcast('chat_message', {
      playerId: client.sessionId,
      playerName: player.name,
      text: message.text,
      timestamp: Date.now(),
    })
  }

  private checkLevelCompletion() {
    // This would integrate with the light physics system
    // For now, just check if all sensors are activated
    let allSensorsActivated = true
    this.state.blocks.forEach((block) => {
      if (block.state.type === 'sensor' && !block.state.activated) {
        allSensorsActivated = false
      }
    })

    if (allSensorsActivated && !this.state.levelComplete) {
      this.state.levelComplete = true
      this.broadcast('level_complete', {
        levelIndex: this.state.levelIndex,
        time: Date.now() - this.state.startTime,
      })
    }
  }

  private update(deltaTime: number) {
    if (this.state.isPaused) return

    // Update elapsed time
    this.state.elapsedTime = Date.now() - this.state.startTime

    // Here you would run light physics simulation
    // and update sensor states accordingly
  }
}
