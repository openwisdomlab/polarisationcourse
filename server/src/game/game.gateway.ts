/**
 * Game Gateway - WebSocket gateway for NestJS (alternative to Colyseus for simpler use cases)
 * Can be used alongside Colyseus for different features
 */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { GameService } from './game.service'

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; playerName: string },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, playerName } = data

    // Join the socket room
    client.join(roomId)

    // Create or get session
    let session = this.gameService.getSession(roomId)
    if (!session) {
      session = this.gameService.createSession(roomId)
    }

    // Add player
    this.gameService.addPlayer(roomId, {
      id: client.id,
      name: playerName,
      position: { x: 0, y: 1, z: 0 },
      rotation: 0,
      score: 0,
      connectedAt: new Date(),
    })

    // Notify others
    client.to(roomId).emit('player_joined', {
      playerId: client.id,
      playerName,
    })

    // Send current state to new player
    client.emit('room_state', {
      players: Array.from(session.players.values()),
      levelIndex: session.levelIndex,
    })

    return { success: true, roomId }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId } = data

    client.leave(roomId)
    this.gameService.removePlayer(roomId, client.id)

    client.to(roomId).emit('player_left', {
      playerId: client.id,
    })

    return { success: true }
  }

  @SubscribeMessage('player_move')
  handlePlayerMove(
    @MessageBody() data: { roomId: string; position: { x: number; y: number; z: number } },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, position } = data

    this.gameService.updatePlayerPosition(roomId, client.id, position)

    // Broadcast to others in the room
    client.to(roomId).emit('player_moved', {
      playerId: client.id,
      position,
    })
  }

  @SubscribeMessage('block_placed')
  handleBlockPlaced(
    @MessageBody()
    data: {
      roomId: string
      position: { x: number; y: number; z: number }
      blockType: string
      state: Record<string, unknown>
    },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, position, blockType, state } = data

    // Broadcast to all in room including sender for sync
    this.server.to(roomId).emit('block_update', {
      action: 'place',
      playerId: client.id,
      position,
      blockType,
      state,
    })
  }

  @SubscribeMessage('block_removed')
  handleBlockRemoved(
    @MessageBody() data: { roomId: string; position: { x: number; y: number; z: number } },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, position } = data

    this.server.to(roomId).emit('block_update', {
      action: 'remove',
      playerId: client.id,
      position,
    })
  }

  @SubscribeMessage('chat_message')
  handleChatMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, message } = data
    const session = this.gameService.getSession(roomId)
    const player = session?.players.get(client.id)

    this.server.to(roomId).emit('chat', {
      playerId: client.id,
      playerName: player?.name || 'Unknown',
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
