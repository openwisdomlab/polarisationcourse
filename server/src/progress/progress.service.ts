import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { SyncDto } from './dto/sync.dto'

type JsonInput = Prisma.InputJsonValue | undefined

function toJson(val: Record<string, unknown> | undefined): JsonInput {
  return val as JsonInput
}

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // --- Demos ---

  async getDemos(userId: string) {
    return this.prisma.demoProgress.findMany({ where: { userId } })
  }

  async completeDemo(userId: string, demoId: string, difficulty?: string) {
    return this.prisma.demoProgress.upsert({
      where: { userId_demoId: { userId, demoId } },
      update: { completed: true, difficulty, completedAt: new Date() },
      create: { userId, demoId, completed: true, difficulty, completedAt: new Date() },
    })
  }

  // --- Discoveries ---

  async getDiscoveries(userId: string) {
    return this.prisma.userDiscovery.findMany({ where: { userId } })
  }

  async unlockDiscovery(userId: string, discoveryId: string, discoveredIn?: string) {
    return this.prisma.userDiscovery.upsert({
      where: { userId_discoveryId: { userId, discoveryId } },
      update: {},
      create: { userId, discoveryId, discoveredIn },
    })
  }

  // --- Game Saves ---

  async getGameSaves(userId: string, gameType: string) {
    return this.prisma.gameSave.findMany({ where: { userId, gameType } })
  }

  async saveGame(
    userId: string,
    gameType: string,
    level: number,
    stateJson?: Record<string, unknown>,
  ) {
    return this.prisma.gameSave.upsert({
      where: { userId_gameType_level: { userId, gameType, level } },
      update: { stateJson: toJson(stateJson), savedAt: new Date() },
      create: { userId, gameType, level, stateJson: toJson(stateJson) },
    })
  }

  // --- Lab Progress ---

  async getLabProgress(userId: string) {
    return this.prisma.labProgress.findMany({ where: { userId } })
  }

  async updateLabTask(
    userId: string,
    taskId: string,
    data: {
      status?: string
      dataJson?: Record<string, unknown>
      fitJson?: Record<string, unknown>
      notes?: string
      skills?: Record<string, number>
    },
  ) {
    const now = new Date()
    return this.prisma.labProgress.upsert({
      where: { userId_taskId: { userId, taskId } },
      update: {
        status: data.status,
        notes: data.notes,
        dataJson: toJson(data.dataJson),
        fitJson: toJson(data.fitJson),
        skills: toJson(data.skills),
        ...(data.status === 'in-progress' && { startedAt: now }),
        ...(data.status === 'completed' && { completedAt: now }),
      },
      create: {
        userId,
        taskId,
        status: data.status ?? 'not-started',
        notes: data.notes,
        dataJson: toJson(data.dataJson),
        fitJson: toJson(data.fitJson),
        skills: toJson(data.skills),
        ...(data.status === 'in-progress' && { startedAt: now }),
        ...(data.status === 'completed' && { completedAt: now }),
      },
    })
  }

  // --- Bulk Sync ---

  async syncAll(userId: string, dto: SyncDto) {
    if (dto.demos?.length) {
      for (const demo of dto.demos) {
        await this.prisma.demoProgress.upsert({
          where: { userId_demoId: { userId, demoId: demo.demoId } },
          update: {
            completed: demo.completed,
            difficulty: demo.difficulty,
            completedAt: demo.completedAt ? new Date(demo.completedAt) : undefined,
          },
          create: {
            userId,
            demoId: demo.demoId,
            completed: demo.completed,
            difficulty: demo.difficulty,
            completedAt: demo.completedAt ? new Date(demo.completedAt) : null,
          },
        })
      }
    }

    if (dto.discoveries?.length) {
      for (const disc of dto.discoveries) {
        await this.prisma.userDiscovery.upsert({
          where: { userId_discoveryId: { userId, discoveryId: disc.discoveryId } },
          update: {},
          create: {
            userId,
            discoveryId: disc.discoveryId,
            discoveredIn: disc.discoveredIn,
            discoveredAt: disc.discoveredAt ? new Date(disc.discoveredAt) : undefined,
          },
        })
      }
    }

    if (dto.gameSaves?.length) {
      for (const save of dto.gameSaves) {
        await this.prisma.gameSave.upsert({
          where: {
            userId_gameType_level: { userId, gameType: save.gameType, level: save.level },
          },
          update: {
            stateJson: toJson(save.stateJson),
            savedAt: save.savedAt ? new Date(save.savedAt) : new Date(),
          },
          create: {
            userId,
            gameType: save.gameType,
            level: save.level,
            stateJson: toJson(save.stateJson),
            savedAt: save.savedAt ? new Date(save.savedAt) : undefined,
          },
        })
      }
    }

    if (dto.labProgress?.length) {
      for (const lab of dto.labProgress) {
        await this.prisma.labProgress.upsert({
          where: { userId_taskId: { userId, taskId: lab.taskId } },
          update: {
            status: lab.status,
            notes: lab.notes,
            dataJson: toJson(lab.dataJson),
            fitJson: toJson(lab.fitJson),
            skills: toJson(lab.skills),
            startedAt: lab.startedAt ? new Date(lab.startedAt) : undefined,
            completedAt: lab.completedAt ? new Date(lab.completedAt) : undefined,
          },
          create: {
            userId,
            taskId: lab.taskId,
            status: lab.status ?? 'not-started',
            notes: lab.notes,
            dataJson: toJson(lab.dataJson),
            fitJson: toJson(lab.fitJson),
            skills: toJson(lab.skills),
            startedAt: lab.startedAt ? new Date(lab.startedAt) : undefined,
            completedAt: lab.completedAt ? new Date(lab.completedAt) : undefined,
          },
        })
      }
    }

    return this.getFullProgress(userId)
  }

  // --- Full Progress Snapshot ---

  async getFullProgress(userId: string) {
    const [demos, discoveries, gameSaves, labProgress] = await Promise.all([
      this.prisma.demoProgress.findMany({ where: { userId } }),
      this.prisma.userDiscovery.findMany({ where: { userId } }),
      this.prisma.gameSave.findMany({ where: { userId } }),
      this.prisma.labProgress.findMany({ where: { userId } }),
    ])
    return { demos, discoveries, gameSaves, labProgress }
  }
}
