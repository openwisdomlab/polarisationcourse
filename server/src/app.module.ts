/**
 * Main Application Module
 * Integrates NestJS with Colyseus game server
 */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GameModule } from './game/game.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ProgressModule } from './progress/progress.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProgressModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
