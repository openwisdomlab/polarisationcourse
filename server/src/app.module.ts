/**
 * Main Application Module
 * Integrates NestJS with Colyseus game server
 */
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
// TODO: Install @nestjs/throttler (`npm install @nestjs/throttler`) and uncomment the imports below
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { GameModule } from './game/game.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ProgressModule } from './progress/progress.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 环境变量验证：确保关键配置项存在
      // Environment variable validation: ensure critical config keys exist
      validationSchema: undefined, // TODO: Add Joi schema for env validation (npm install joi)
    }),
    // TODO: Uncomment after installing @nestjs/throttler
    // ThrottlerModule.forRoot([{
    //   ttl: 60000,
    //   limit: 100,
    // }]),
    PrismaModule,
    AuthModule,
    ProgressModule,
    GameModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    // TODO: Uncomment after installing @nestjs/throttler
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
