/**
 * Bill of Materials (BOM) for UC2 Polarization System
 * 核心/扩展/样品 三套配置
 */

import type { BOMItem, BOMConfig } from '../types'

// ===== Core BOM - Essential Components =====
const CORE_BOM_ITEMS: BOMItem[] = [
  {
    id: 'bom-baseplate-4x4',
    name: 'UC2 Baseplate 4x4',
    nameZh: 'UC2基板 4x4',
    category: 'core',
    quantity: 1,
    unitPrice: 15,
    currency: 'EUR',
    supplier: '3D Print / OpenUC2 Shop',
    partNumber: 'UC2-BP-44',
    essential: true
  },
  {
    id: 'bom-cube-shell',
    name: 'UC2 Cube Shell',
    nameZh: 'UC2立方体外壳',
    category: 'core',
    quantity: 4,
    unitPrice: 3,
    currency: 'EUR',
    supplier: '3D Print / OpenUC2 Shop',
    partNumber: 'UC2-CUBE',
    essential: true
  },
  {
    id: 'bom-magnets',
    name: 'Neodymium Magnets 5x2mm',
    nameZh: '钕磁铁 5x2mm',
    category: 'core',
    quantity: 32,
    unitPrice: 0.1,
    currency: 'EUR',
    supplier: 'Amazon / AliExpress',
    partNumber: 'MAG-5X2',
    notes: '8 magnets per cube, 4 cubes',
    notesZh: '每个立方体8颗，共4个立方体',
    essential: true
  },
  {
    id: 'bom-polarizer-film',
    name: 'Linear Polarizer Film 100x100mm',
    nameZh: '线偏振膜 100x100mm',
    category: 'core',
    quantity: 2,
    unitPrice: 5,
    currency: 'EUR',
    supplier: 'Edmund Optics / Thorlabs / AliExpress',
    partNumber: 'POL-LIN-100',
    essential: true
  },
  {
    id: 'bom-led-white',
    name: 'White LED 3W with Heatsink',
    nameZh: '白光LED 3W 含散热片',
    category: 'core',
    quantity: 1,
    unitPrice: 2,
    currency: 'EUR',
    supplier: 'AliExpress',
    partNumber: 'LED-W3',
    essential: true
  },
  {
    id: 'bom-diffuser',
    name: 'Diffuser Sheet 50x50mm',
    nameZh: '漫射片 50x50mm',
    category: 'core',
    quantity: 1,
    unitPrice: 1,
    currency: 'EUR',
    supplier: 'Hardware Store',
    partNumber: 'DIFF-50',
    essential: true
  },
  {
    id: 'bom-usb-power',
    name: 'USB Power Cable',
    nameZh: 'USB电源线',
    category: 'core',
    quantity: 1,
    unitPrice: 2,
    currency: 'EUR',
    supplier: 'Generic',
    partNumber: 'USB-PWR',
    essential: true
  },
  {
    id: 'bom-screws-m3',
    name: 'M3 Screws Assortment',
    nameZh: 'M3螺丝套装',
    category: 'core',
    quantity: 1,
    unitPrice: 5,
    currency: 'EUR',
    supplier: 'Hardware Store',
    partNumber: 'SCREW-M3-KIT',
    notes: 'M3x8, M3x12, M3x16',
    essential: true
  }
]

// ===== Extension BOM - Advanced Components =====
const EXTENSION_BOM_ITEMS: BOMItem[] = [
  {
    id: 'bom-waveplate-qtr',
    name: 'Quarter Wave Plate Film',
    nameZh: 'λ/4波片膜',
    category: 'extension',
    quantity: 1,
    unitPrice: 15,
    currency: 'EUR',
    supplier: 'Edmund Optics / 3Dlens',
    partNumber: 'WP-QTR-550',
    essential: false
  },
  {
    id: 'bom-waveplate-half',
    name: 'Half Wave Plate Film',
    nameZh: 'λ/2波片膜',
    category: 'extension',
    quantity: 1,
    unitPrice: 15,
    currency: 'EUR',
    supplier: 'Edmund Optics / 3Dlens',
    partNumber: 'WP-HALF-550',
    essential: false
  },
  {
    id: 'bom-calcite',
    name: 'Calcite Crystal 20x20x10mm',
    nameZh: '方解石晶体 20x20x10mm',
    category: 'extension',
    quantity: 1,
    unitPrice: 25,
    currency: 'EUR',
    supplier: 'Mineral Shop / eBay',
    partNumber: 'CALC-20',
    essential: false
  },
  {
    id: 'bom-rotation-insert',
    name: 'Rotation Stage Insert (Manual)',
    nameZh: '旋转台插件（手动）',
    category: 'extension',
    quantity: 1,
    unitPrice: 5,
    currency: 'EUR',
    supplier: '3D Print',
    partNumber: 'UC2-ROT-MAN',
    essential: false
  },
  {
    id: 'bom-camera',
    name: 'USB Camera Module 5MP',
    nameZh: 'USB相机模块 5MP',
    category: 'extension',
    quantity: 1,
    unitPrice: 15,
    currency: 'EUR',
    supplier: 'AliExpress',
    partNumber: 'CAM-USB-5MP',
    essential: false
  },
  {
    id: 'bom-esp32',
    name: 'ESP32 Development Board',
    nameZh: 'ESP32开发板',
    category: 'extension',
    quantity: 1,
    unitPrice: 8,
    currency: 'EUR',
    supplier: 'AliExpress',
    partNumber: 'ESP32-WROOM',
    essential: false
  },
  {
    id: 'bom-stepper',
    name: 'Stepper Motor 28BYJ-48 + Driver',
    nameZh: '步进电机 28BYJ-48 + 驱动板',
    category: 'extension',
    quantity: 1,
    unitPrice: 3,
    currency: 'EUR',
    supplier: 'AliExpress',
    partNumber: 'STEP-28BYJ',
    essential: false
  },
  {
    id: 'bom-laser',
    name: 'Laser Diode 650nm <1mW',
    nameZh: '激光二极管 650nm <1mW',
    category: 'extension',
    quantity: 1,
    unitPrice: 2,
    currency: 'EUR',
    supplier: 'AliExpress',
    partNumber: 'LASER-650-1MW',
    notes: 'Class 2 laser, safety glasses recommended',
    notesZh: '二类激光，建议佩戴安全眼镜',
    essential: false
  }
]

// ===== Sample BOM - Sample Materials =====
const SAMPLE_BOM_ITEMS: BOMItem[] = [
  {
    id: 'bom-cellophane',
    name: 'Cellophane Sheet Pack (10 colors)',
    nameZh: '玻璃纸套装（10色）',
    category: 'sample',
    quantity: 1,
    unitPrice: 3,
    currency: 'EUR',
    supplier: 'Craft Store',
    partNumber: 'CELL-10COL',
    essential: false
  },
  {
    id: 'bom-mica',
    name: 'Mica Flakes Natural',
    nameZh: '天然云母片',
    category: 'sample',
    quantity: 1,
    unitPrice: 5,
    currency: 'EUR',
    supplier: 'Mineral Shop',
    partNumber: 'MICA-NAT',
    essential: false
  },
  {
    id: 'bom-stress-ruler',
    name: 'Transparent Polycarbonate Ruler',
    nameZh: '透明聚碳酸酯尺',
    category: 'sample',
    quantity: 1,
    unitPrice: 2,
    currency: 'EUR',
    supplier: 'Stationery Store',
    partNumber: 'RULER-PC',
    essential: false
  },
  {
    id: 'bom-sugar',
    name: 'Sucrose (Table Sugar) 500g',
    nameZh: '蔗糖 500g',
    category: 'sample',
    quantity: 1,
    unitPrice: 2,
    currency: 'EUR',
    supplier: 'Grocery Store',
    partNumber: 'SUGAR-500',
    essential: false
  },
  {
    id: 'bom-test-tube',
    name: 'Glass Test Tube 100mm',
    nameZh: '玻璃试管 100mm',
    category: 'sample',
    quantity: 2,
    unitPrice: 1,
    currency: 'EUR',
    supplier: 'Lab Supply',
    partNumber: 'TUBE-100',
    essential: false
  },
  {
    id: 'bom-tape-clear',
    name: 'Clear Tape (Scotch type)',
    nameZh: '透明胶带（思高型）',
    category: 'sample',
    quantity: 1,
    unitPrice: 2,
    currency: 'EUR',
    supplier: 'Stationery Store',
    partNumber: 'TAPE-CLR',
    notes: 'Layering creates retardation',
    notesZh: '叠层产生相位延迟',
    essential: false
  },
  {
    id: 'bom-corn-syrup',
    name: 'Corn Syrup (Karo type)',
    nameZh: '玉米糖浆',
    category: 'sample',
    quantity: 1,
    unitPrice: 4,
    currency: 'EUR',
    supplier: 'Grocery Store',
    partNumber: 'SYRUP-CORN',
    notes: 'For optical rotation demo',
    notesZh: '用于旋光演示',
    essential: false
  }
]

// ===== Consumable BOM - Consumable Items =====
const CONSUMABLE_BOM_ITEMS: BOMItem[] = [
  {
    id: 'bom-pla-filament',
    name: '3D Printer PLA Filament 500g',
    nameZh: '3D打印PLA耗材 500g',
    category: 'consumable',
    quantity: 1,
    unitPrice: 15,
    currency: 'EUR',
    supplier: 'Amazon',
    partNumber: 'PLA-BLK-500',
    notes: 'Black recommended for optical housings',
    notesZh: '推荐黑色，用于光学外壳',
    essential: false
  },
  {
    id: 'bom-cleaning',
    name: 'Lens Cleaning Kit',
    nameZh: '镜头清洁套装',
    category: 'consumable',
    quantity: 1,
    unitPrice: 5,
    currency: 'EUR',
    supplier: 'Camera Store',
    partNumber: 'CLEAN-KIT',
    essential: false
  }
]

// ===== BOM Configurations =====
export const BOM_CONFIGS: BOMConfig[] = [
  {
    id: 'bom-core',
    name: 'Core Polarization Kit',
    nameZh: '核心偏振套件',
    items: CORE_BOM_ITEMS
  },
  {
    id: 'bom-extension',
    name: 'Extension Kit',
    nameZh: '扩展套件',
    items: EXTENSION_BOM_ITEMS
  },
  {
    id: 'bom-samples',
    name: 'Sample Materials Kit',
    nameZh: '样品材料套件',
    items: SAMPLE_BOM_ITEMS
  },
  {
    id: 'bom-consumables',
    name: 'Consumables',
    nameZh: '耗材',
    items: CONSUMABLE_BOM_ITEMS
  },
  {
    id: 'bom-complete',
    name: 'Complete Polarimetry Lab',
    nameZh: '完整偏振实验室',
    items: [...CORE_BOM_ITEMS, ...EXTENSION_BOM_ITEMS, ...SAMPLE_BOM_ITEMS, ...CONSUMABLE_BOM_ITEMS]
  }
]

// Get BOM config by ID
export function getBOMConfigById(id: string): BOMConfig | undefined {
  return BOM_CONFIGS.find(c => c.id === id)
}

// Calculate total cost for a BOM config
export function calculateBOMTotal(config: BOMConfig): { total: number; currency: string } {
  let total = 0
  for (const item of config.items) {
    if (item.unitPrice) {
      total += item.unitPrice * item.quantity
    }
  }
  return { total, currency: 'EUR' }
}

// Export BOM to CSV format
export function exportBOMToCSV(config: BOMConfig, language: 'en' | 'zh' = 'en'): string {
  const headers = language === 'zh'
    ? ['物料编号', '名称', '类别', '数量', '单价', '货币', '供应商', '零件号', '备注']
    : ['Part ID', 'Name', 'Category', 'Quantity', 'Unit Price', 'Currency', 'Supplier', 'Part Number', 'Notes']

  const rows = config.items.map(item => [
    item.id,
    language === 'zh' ? item.nameZh : item.name,
    item.category,
    item.quantity.toString(),
    item.unitPrice?.toString() || '',
    item.currency || '',
    item.supplier || '',
    item.partNumber || '',
    language === 'zh' ? (item.notesZh || item.notes || '') : (item.notes || '')
  ])

  // Add total row
  const total = calculateBOMTotal(config)
  rows.push([
    '',
    language === 'zh' ? '总计' : 'TOTAL',
    '',
    '',
    total.total.toFixed(2),
    total.currency,
    '',
    '',
    ''
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return csvContent
}

// Category labels
export const BOM_CATEGORIES = {
  core: { label: 'Core', labelZh: '核心', color: 'cyan' },
  extension: { label: 'Extension', labelZh: '扩展', color: 'purple' },
  sample: { label: 'Sample', labelZh: '样品', color: 'green' },
  consumable: { label: 'Consumable', labelZh: '耗材', color: 'orange' }
}
