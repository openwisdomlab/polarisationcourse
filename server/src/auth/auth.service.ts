import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      },
    })

    const accessToken = this.signToken(user.id, user.email)
    const refreshToken = this.generateRefreshToken(user.id, user.email)
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = this.signToken(user.id, user.email)
    const refreshToken = this.generateRefreshToken(user.id, user.email)
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    const { passwordHash, ...profile } = user
    return profile
  }

  private signToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email }, { expiresIn: '1h' })
  }

  /**
   * 生成刷新令牌，有效期7天
   * Generate a refresh token with a 7-day expiration
   */
  generateRefreshToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { sub: userId, email, type: 'refresh' },
      { expiresIn: '7d' },
    )
  }
}
