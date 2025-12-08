/**
 * Game Service - Business logic for game state management
 */
import { Injectable } from '@nestjs/common'

export interface Player {
  id: string
  name: string
  position: { x: number; y: number; z: number }
  rotation: number
  score: number
  connectedAt: Date
}

export interface GameSession {
  id: string
  players: Map<string, Player>
  levelIndex: number
  createdAt: Date
  isActive: boolean
}

@Injectable()
export class GameService {
  private sessions: Map<string, GameSession> = new Map()

  createSession(sessionId: string): GameSession {
    const session: GameSession = {
      id: sessionId,
      players: new Map(),
      levelIndex: 0,
      createdAt: new Date(),
      isActive: true,
    }
    this.sessions.set(sessionId, session)
    return session
  }

  getSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId)
  }

  addPlayer(sessionId: string, player: Player): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    session.players.set(player.id, player)
    return true
  }

  removePlayer(sessionId: string, playerId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    session.players.delete(playerId)

    // Clean up empty sessions
    if (session.players.size === 0) {
      this.sessions.delete(sessionId)
    }

    return true
  }

  updatePlayerPosition(
    sessionId: string,
    playerId: string,
    position: { x: number; y: number; z: number }
  ): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const player = session.players.get(playerId)
    if (!player) return false

    player.position = position
    return true
  }

  getActiveSessions(): GameSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.isActive)
  }

  getSessionStats(): { totalSessions: number; totalPlayers: number } {
    let totalPlayers = 0
    this.sessions.forEach((session) => {
      totalPlayers += session.players.size
    })
    return {
      totalSessions: this.sessions.size,
      totalPlayers,
    }
  }
}
