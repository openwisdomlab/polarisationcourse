/**
 * Lobby Room - 大厅房间
 *
 * Manages room discovery and quick matchmaking for PolarCraft.
 * Players join the lobby to see available rooms and create/join games.
 */
import { Room, Client } from '@colyseus/core'
import { Schema, type, MapSchema } from '@colyseus/schema'

export class RoomListing extends Schema {
  @type('string') roomId: string = ''
  @type('string') roomName: string = ''
  @type('number') playerCount: number = 0
  @type('number') maxPlayers: number = 4
  @type('number') levelIndex: number = 0
  @type('string') hostName: string = ''
  @type('number') createdAt: number = 0
}

export class LobbyState extends Schema {
  @type({ map: RoomListing }) rooms = new MapSchema<RoomListing>()
  @type('number') onlineCount: number = 0
}

interface CreateRoomOptions {
  roomName: string
  maxPlayers?: number
  levelIndex?: number
}

export class LobbyRoom extends Room<LobbyState> {
  maxClients = 100

  onCreate() {
    this.setState(new LobbyState())

    this.onMessage('create_room', (client, options: CreateRoomOptions) => {
      this.handleCreateRoom(client, options)
    })

    this.onMessage('quick_match', (client) => {
      this.handleQuickMatch(client)
    })

    this.onMessage('refresh', (client) => {
      client.send('room_list', this.getRoomList())
    })

    // Periodically update room list
    this.setSimulationInterval(() => this.updateRoomList(), 5000)

    console.log('Lobby room created')
  }

  onJoin(client: Client) {
    this.state.onlineCount = this.clients.length
    client.send('room_list', this.getRoomList())
  }

  onLeave(client: Client) {
    this.state.onlineCount = this.clients.length
  }

  private async handleCreateRoom(client: Client, options: CreateRoomOptions) {
    try {
      const room = await this.presence.hget('polarcraft_rooms', options.roomName)
      if (room) {
        client.send('error', { message: 'Room name already taken' })
        return
      }

      client.send('room_created', {
        roomName: options.roomName,
        maxPlayers: options.maxPlayers ?? 4,
        levelIndex: options.levelIndex ?? 0,
      })
    } catch (e) {
      // Fallback: just notify the client to create the room directly
      client.send('room_created', {
        roomName: options.roomName,
        maxPlayers: options.maxPlayers ?? 4,
        levelIndex: options.levelIndex ?? 0,
      })
    }
  }

  private async handleQuickMatch(client: Client) {
    const rooms = this.getRoomList()
    // Find first room with available slots
    const available = rooms.find(r => r.playerCount < r.maxPlayers)

    if (available) {
      client.send('quick_match_found', { roomId: available.roomId })
    } else {
      client.send('quick_match_none', { message: 'No rooms available. Create one!' })
    }
  }

  private getRoomList(): Array<{
    roomId: string
    roomName: string
    playerCount: number
    maxPlayers: number
    levelIndex: number
  }> {
    const list: Array<{
      roomId: string
      roomName: string
      playerCount: number
      maxPlayers: number
      levelIndex: number
    }> = []

    this.state.rooms.forEach((room, key) => {
      list.push({
        roomId: room.roomId,
        roomName: room.roomName,
        playerCount: room.playerCount,
        maxPlayers: room.maxPlayers,
        levelIndex: room.levelIndex,
      })
    })

    return list
  }

  private updateRoomList() {
    this.state.onlineCount = this.clients.length
  }
}
