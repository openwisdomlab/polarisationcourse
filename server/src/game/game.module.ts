/**
 * Game Module - Colyseus integration for real-time multiplayer
 */
import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Server as ColyseusServer, Room } from '@colyseus/core'
import { WebSocketTransport } from '@colyseus/ws-transport'
import { createServer } from 'http'
import { PolarCraftRoom } from './rooms/polarcraft.room'
import { GameGateway } from './game.gateway'
import { GameService } from './game.service'

@Module({
  providers: [GameGateway, GameService],
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

    // Start game server on separate port
    const gamePort = parseInt(process.env.GAME_PORT || '2567', 10)
    httpServer.listen(gamePort)

    console.log(`🎮 Colyseus game server started on ws://localhost:${gamePort}`)
  }

  async onModuleDestroy() {
    if (this.gameServer) {
      await this.gameServer.gracefullyShutdown()
    }
  }
}
