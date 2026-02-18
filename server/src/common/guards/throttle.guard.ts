/**
 * 节流守卫 - 用于速率限制
 * Throttle Guard - for rate limiting on specific routes
 *
 * TODO: Install @nestjs/throttler (`npm install @nestjs/throttler`) to enable this guard.
 *
 * Usage example on a controller or route:
 *
 *   import { Throttle } from '@nestjs/throttler'
 *   import { UseGuards } from '@nestjs/common'
 *   import { CustomThrottlerGuard } from '../common/guards/throttle.guard'
 *
 *   @Controller('auth')
 *   @UseGuards(CustomThrottlerGuard)
 *   export class AuthController {
 *
 *     @Throttle({ default: { ttl: 60000, limit: 5 } })
 *     @Post('login')
 *     login(@Body() dto: LoginDto) { ... }
 *
 *     @Throttle({ default: { ttl: 60000, limit: 3 } })
 *     @Post('register')
 *     register(@Body() dto: RegisterDto) { ... }
 *   }
 *
 * The global ThrottlerGuard (registered in AppModule as APP_GUARD) applies
 * the default rate limit (100 requests per 60 seconds) to all endpoints.
 *
 * This custom guard can be used to apply stricter rate limits to sensitive
 * auth endpoints (e.g., 5 login attempts per minute, 3 registrations per minute).
 */

// TODO: Uncomment after installing @nestjs/throttler
// import { Injectable } from '@nestjs/common'
// import { ThrottlerGuard } from '@nestjs/throttler'
//
// @Injectable()
// export class CustomThrottlerGuard extends ThrottlerGuard {
//   /**
//    * 使用客户端IP地址作为限流追踪键
//    * Use client IP address as the throttle tracking key
//    */
//   protected getTracker(req: Record<string, any>): Promise<string> {
//     return Promise.resolve(req.ip)
//   }
//
//   /**
//    * 自定义错误消息
//    * Custom error message when rate limit is exceeded
//    */
//   protected throwThrottlingException(): Promise<void> {
//     throw new (require('@nestjs/common').HttpException)(
//       {
//         statusCode: 429,
//         message: 'Too many requests. Please try again later.',
//         error: 'TooManyRequests',
//       },
//       429,
//     )
//   }
// }

export {}
