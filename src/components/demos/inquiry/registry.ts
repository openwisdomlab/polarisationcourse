/**
 * registry.ts - Demo ID → InquiryConfig 映射
 *
 * 注册所有配置了探究点的演示
 */

import type { InquiryConfig } from '@/stores/inquiryStore'
import { malusInquiryPoints } from './points/malus'
import { threePolarizersInquiryPoints } from './points/three-polarizers'
import { fresnelInquiryPoints } from './points/fresnel'
import { waveplateInquiryPoints } from './points/waveplate'
import { opticalRotationInquiryPoints } from './points/optical-rotation'
import { stokesVectorInquiryPoints } from './points/stokes-vector'

const INQUIRY_REGISTRY: Record<string, InquiryConfig> = {
  malus: {
    demoId: 'malus',
    points: malusInquiryPoints,
    autoStartFoundation: true,
  },
  'three-polarizers': {
    demoId: 'three-polarizers',
    points: threePolarizersInquiryPoints,
    autoStartFoundation: true,
  },
  fresnel: {
    demoId: 'fresnel',
    points: fresnelInquiryPoints,
    autoStartFoundation: true,
  },
  waveplate: {
    demoId: 'waveplate',
    points: waveplateInquiryPoints,
    autoStartFoundation: true,
  },
  'optical-rotation': {
    demoId: 'optical-rotation',
    points: opticalRotationInquiryPoints,
    autoStartFoundation: true,
  },
  stokes: {
    demoId: 'stokes',
    points: stokesVectorInquiryPoints,
    autoStartFoundation: true,
  },
}

/**
 * 获取指定demo的探究配置，无配置则返回undefined
 */
export function getInquiryConfig(demoId: string | undefined): InquiryConfig | undefined {
  if (!demoId) return undefined
  return INQUIRY_REGISTRY[demoId]
}
