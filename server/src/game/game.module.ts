/**
 * Game Module - Colyseus integration for real-time multiplayer
 *
 * Architecture decision: All real-time game communication goes through Colyseus.
 * The previous Socket.io GameGateway has been removed to eliminate redundancy.
 * Colyseus provides:
 * - Room-based state synchronization
 * - Delta compression for bandwidth efficiency
 * - Server-authoritative game state
 *
 * @see rooms/polarcraft.room.ts — Main game room with physics validation
 */
import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Server as ColyseusServer } from '@colyseus/core'
import { WebSocketTransport } from '@colyseus/ws-transport'
import { createServer } from 'http'
import { PolarCraftRoom } from './rooms/polarcraft.room'
import { LobbyRoom } from './rooms/lobby.room'
import { GameService } from './game.service'

@Module({
  providers: [GameService],
  exports: [GameService],
})
export class GameModule implements OnModuleInit, OnModuleDestroy {
  private gameServer: ColyseusServer

  async onModuleInit() {
    // Create Colyseus server
    const httpServer = createServer()

    this.gameServer = new ColyseusServer({
      transport: new WebSocketTransport({
        server: httpServer,
      }),
    })

    // Register room types
    this.gameServer.define('polarcraft', PolarCraftRoom)
    this.gameServer.define('sandbox', PolarCraftRoom).enableRealtimeListing()
    this.gameServer.define('lobby', LobbyRoom)

    // Start game server on separate port
    const gamePort = parseInt(process.env.GAME_PORT || '2567', 10)
    httpServer.listen(gamePort)

    console.log(`Colyseus game server started on ws://localhost:${gamePort}`)
  }

  async onModuleDestroy() {
    if (this.gameServer) {
      await this.gameServer.gracefullyShutdown()
    }
  }
}
