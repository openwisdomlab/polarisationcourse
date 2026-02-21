/**
 * regionCourseMap.ts -- 区域到课程单元的映射
 *
 * 将 6 个 Odyssey 区域映射到对应的课程单元标签。
 * 用于 WelcomeOverlay, HUD, WorldMap 等多处显示。
 */

export interface RegionCourseInfo {
  regionId: string
  regionKey: string // camelCase for i18n
  unitLabelKey: string // i18n key for unit label
}

export const REGION_COURSE_MAP: RegionCourseInfo[] = [
  { regionId: 'crystal-lab', regionKey: 'crystalLab', unitLabelKey: 'odyssey.welcome.unitLabel.crystalLab' },
  { regionId: 'wave-platform', regionKey: 'wavePlatform', unitLabelKey: 'odyssey.welcome.unitLabel.wavePlatform' },
  { regionId: 'refraction-bench', regionKey: 'refractionBench', unitLabelKey: 'odyssey.welcome.unitLabel.refractionBench' },
  { regionId: 'scattering-chamber', regionKey: 'scatteringChamber', unitLabelKey: 'odyssey.welcome.unitLabel.scatteringChamber' },
  { regionId: 'interface-lab', regionKey: 'interfaceLab', unitLabelKey: 'odyssey.welcome.unitLabel.interfaceLab' },
  { regionId: 'measurement-studio', regionKey: 'measurementStudio', unitLabelKey: 'odyssey.welcome.unitLabel.measurementStudio' },
]

/** 按区域 ID 查找课程信息 */
export function getCourseInfoForRegion(regionId: string): RegionCourseInfo | undefined {
  return REGION_COURSE_MAP.find((r) => r.regionId === regionId)
}
