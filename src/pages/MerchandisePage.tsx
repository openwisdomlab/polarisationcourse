/**
 * Merchandise Page - Polarization Art & Creative Products
 * 文创用品页面 - 偏振艺术与创意产品
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import {
  Home, Image, Users, Palette, AlertTriangle,
  ChevronRight, Eye, Sparkles,
  ShoppingBag, GraduationCap, Baby, Briefcase, User
} from 'lucide-react'

// Data imports
import {
  PRODUCTS, PRODUCT_CATEGORIES, PRICE_RANGES, AUDIENCE_LABELS
} from '@/data'
import type { Product, AudienceType } from '@/data/types'

// Shared components
import {
  SearchInput, FilterSelect, FilterBar, ToggleFilter, Badge,
  Card, CardHeader, CardContent, CardGrid,
  WarningBox, InfoBox, EmptyState
} from '@/components/shared'
import { PolarizationArt, ArtGallery } from '@/components/shared/PolarizationArt'

// ===== Product Card Component =====
interface ProductCardProps {
  product: Product
  onClick: () => void
}

function ProductCard({ product, onClick }: ProductCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const categoryInfo = PRODUCT_CATEGORIES[product.category]
  const priceInfo = PRICE_RANGES[product.priceRange]

  // Generate unique seed from product id
  const seed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return (
    <Card hoverable onClick={onClick} className="overflow-hidden">
      {/* Product Image (Generated Art) */}
      <div className="aspect-video -mx-4 -mt-4 mb-4 overflow-hidden">
        {product.artParams ? (
          <PolarizationArt
            params={product.artParams}
            seed={seed}
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center',
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
          )}>
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <CardHeader
        title={isZh ? product.nameZh : product.name}
        subtitle={isZh ? categoryInfo.labelZh : categoryInfo.label}
        badge={
          <Badge color={priceInfo.color as any} size="sm">
            {priceInfo.range}
          </Badge>
        }
      />

      <CardContent>
        <p className={cn(
          'text-sm line-clamp-2 mb-3',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? product.descriptionZh : product.description}
        </p>

        {/* Audience & Requirements */}
        <div className="flex flex-wrap gap-1">
          {product.targetAudience.slice(0, 2).map(aud => (
            <Badge key={aud} color="gray" size="sm">
              {isZh ? AUDIENCE_LABELS[aud].labelZh : AUDIENCE_LABELS[aud].label}
            </Badge>
          ))}
          {product.requiresPolarizer && (
            <Badge color="cyan" size="sm">
              <Eye className="w-3 h-3 mr-1" />
              {isZh ? '需偏振片' : 'Polarizer'}
            </Badge>
          )}
        </div>

        {product.safetyWarning && (
          <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="w-3 h-3" />
            <span>{isZh ? '有安全提示' : 'Safety note'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ===== Product Detail Modal =====
interface ProductDetailProps {
  product: Product | null
  onClose: () => void
}

function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  if (!product) return null

  const categoryInfo = PRODUCT_CATEGORIES[product.category]
  const priceInfo = PRICE_RANGES[product.priceRange]
  const seed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className={cn(
          'w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl',
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Product Image */}
        <div className="aspect-video w-full">
          {product.artParams ? (
            <PolarizationArt
              params={product.artParams}
              seed={seed}
              width={600}
              height={300}
              className="w-full h-full"
            />
          ) : (
            <div className={cn(
              'w-full h-full flex items-center justify-center',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
            )}>
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className={cn(
                'text-xl font-bold mb-1',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? product.nameZh : product.name}
              </h2>
              <div className="flex gap-2">
                <Badge color="cyan">{isZh ? categoryInfo.labelZh : categoryInfo.label}</Badge>
                <Badge color={priceInfo.color as any}>{priceInfo.range}</Badge>
              </div>
            </div>
          </div>

          <p className={cn(
            'text-sm mb-4',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? product.descriptionZh : product.description}
          </p>

          {/* Materials & Craft */}
          <div className="mb-4">
            <h3 className={cn(
              'font-semibold text-sm mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '材料与工艺' : 'Materials & Craft'}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {(isZh ? product.materialsZh : product.materials).map((mat, i) => (
                <Badge key={i} color="gray" size="sm">{mat}</Badge>
              ))}
            </div>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? product.craftProcessZh : product.craftProcess}
            </p>
          </div>

          {/* Use Cases */}
          <div className="mb-4">
            <h3 className={cn(
              'font-semibold text-sm mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '使用场景' : 'Use Cases'}
            </h3>
            <ul className={cn(
              'text-sm space-y-1',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {(isZh ? product.useCasesZh : product.useCases).map((use, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-500" />
                  {use}
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Value */}
          <InfoBox className="mb-4">
            <div>
              <span className="font-semibold">{isZh ? '教育价值：' : 'Educational Value: '}</span>
              {isZh ? product.educationalValueZh : product.educationalValue}
            </div>
            {product.relatedConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.relatedConcepts.map(concept => (
                  <Badge key={concept} color="cyan" size="sm">{concept}</Badge>
                ))}
              </div>
            )}
          </InfoBox>

          {/* Target Audience */}
          <div className="mb-4">
            <h3 className={cn(
              'font-semibold text-sm mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '目标受众' : 'Target Audience'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.targetAudience.map(aud => {
                const info = AUDIENCE_LABELS[aud]
                const Icon = aud === 'child' ? Baby :
                            aud === 'student' ? GraduationCap :
                            aud === 'professional' ? Briefcase :
                            aud === 'all' ? Users : User
                return (
                  <div
                    key={aud}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                      theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4 text-cyan-500" />
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {isZh ? info.labelZh : info.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Polarizer Requirement */}
          {product.requiresPolarizer && (
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg mb-4',
              theme === 'dark' ? 'bg-cyan-900/20' : 'bg-cyan-50'
            )}>
              <Eye className="w-5 h-5 text-cyan-500" />
              <span className={cn(
                'text-sm',
                theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
              )}>
                {isZh ? '此产品需要搭配偏振片使用' : 'This product requires a polarizer to use'}
              </span>
            </div>
          )}

          {/* Safety Warning */}
          {product.safetyWarning && (
            <WarningBox>
              {isZh ? product.safetyWarningZh : product.safetyWarning}
            </WarningBox>
          )}

          <button
            onClick={onClose}
            className={cn(
              'w-full mt-4 py-2 rounded-lg font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            )}
          >
            {isZh ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== Main Merchandise Page =====
export function MerchandisePage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [audienceFilter, setAudienceFilter] = useState('')
  const [requiresPolarizerOnly, setRequiresPolarizerOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showGallery, setShowGallery] = useState(false)

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = product.name.toLowerCase().includes(query) ||
                         product.nameZh.includes(query)
        const matchDesc = product.description.toLowerCase().includes(query) ||
                         product.descriptionZh.includes(query)
        if (!matchName && !matchDesc) return false
      }

      // Category filter
      if (categoryFilter && product.category !== categoryFilter) return false

      // Price filter
      if (priceFilter && product.priceRange !== priceFilter) return false

      // Audience filter
      if (audienceFilter && !product.targetAudience.includes(audienceFilter as AudienceType)) return false

      // Polarizer filter
      if (requiresPolarizerOnly && !product.requiresPolarizer) return false

      return true
    })
  }, [searchQuery, categoryFilter, priceFilter, audienceFilter, requiresPolarizerOnly])

  // Filter options
  const categoryOptions = Object.entries(PRODUCT_CATEGORIES).map(([key, val]) => ({
    value: key,
    label: val.label,
    labelZh: val.labelZh
  }))

  const priceOptions = Object.entries(PRICE_RANGES).map(([key, val]) => ({
    value: key,
    label: `${val.label} (${val.range})`,
    labelZh: `${val.labelZh} (${val.range})`
  }))

  const audienceOptions = Object.entries(AUDIENCE_LABELS).map(([key, val]) => ({
    value: key,
    label: val.label,
    labelZh: val.labelZh
  }))

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-pink-900/10 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-pink-50 to-gray-100'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{isZh ? '首页' : 'Home'}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-500" />
              <h1 className={cn(
                'text-lg font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振艺术文创' : 'Polarization Art & Merch'}
              </h1>
            </div>
          </div>
          <LanguageThemeSwitcher compact />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Art Gallery Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <h2 className={cn(
                'text-lg font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振艺术画廊' : 'Polarization Art Gallery'}
              </h2>
            </div>
            <button
              onClick={() => setShowGallery(!showGallery)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {showGallery ? (isZh ? '收起' : 'Collapse') : (isZh ? '展开' : 'Expand')}
            </button>
          </div>

          <p className={cn(
            'text-sm mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '程序生成的抽象偏振艺术图案，灵感来自干涉、双折射、应力和旋光效应。'
              : 'Programmatically generated abstract polarization art, inspired by interference, birefringence, stress patterns, and optical rotation.'}
          </p>

          {showGallery ? (
            <ArtGallery count={12} />
          ) : (
            <ArtGallery count={6} />
          )}
        </Card>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-500" />
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '文创产品' : 'Creative Products'}
            </h2>
            <Badge color="pink">{PRODUCTS.length} {isZh ? '个产品' : 'products'}</Badge>
          </div>

          <FilterBar>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={isZh ? '搜索产品...' : 'Search products...'}
              className="w-full sm:w-64"
            />
            <FilterSelect
              label="Category"
              labelZh="类别"
              value={categoryFilter}
              options={categoryOptions}
              onChange={setCategoryFilter}
            />
            <FilterSelect
              label="Price"
              labelZh="价位"
              value={priceFilter}
              options={priceOptions}
              onChange={setPriceFilter}
            />
            <FilterSelect
              label="Audience"
              labelZh="受众"
              value={audienceFilter}
              options={audienceOptions}
              onChange={setAudienceFilter}
            />
            <ToggleFilter
              label="Requires Polarizer"
              labelZh="需偏振片"
              checked={requiresPolarizerOnly}
              onChange={setRequiresPolarizerOnly}
            />
          </FilterBar>

          {/* Category Stats */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRODUCT_CATEGORIES).map(([cat, info]) => {
              const count = PRODUCTS.filter(p => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    categoryFilter === cat
                      ? 'bg-pink-500 text-white'
                      : theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {isZh ? info.labelZh : info.label}: {count}
                </button>
              )
            })}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <CardGrid columns={3}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </CardGrid>
          ) : (
            <EmptyState
              icon={<ShoppingBag className="w-8 h-8 text-gray-400" />}
              title={isZh ? '未找到产品' : 'No products found'}
              description={isZh ? '尝试调整搜索条件' : 'Try adjusting your filters'}
            />
          )}
        </div>

        {/* Product Lines Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(PRODUCT_CATEGORIES).map(([cat, info]) => {
            const products = PRODUCTS.filter(p => p.category === cat)
            if (products.length === 0) return null

            return (
              <Card key={cat}>
                <h3 className={cn(
                  'font-bold mb-2 flex items-center gap-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <Image className="w-5 h-5 text-pink-500" />
                  {isZh ? info.labelZh : info.label}
                </h3>
                <p className={cn(
                  'text-sm mb-3',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {products.length} {isZh ? '个产品' : 'products'}
                </p>
                <ul className={cn(
                  'text-sm space-y-1',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {products.slice(0, 3).map(p => (
                    <li key={p.id} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-pink-500" />
                      {isZh ? p.nameZh : p.name}
                    </li>
                  ))}
                  {products.length > 3 && (
                    <li className={cn(
                      'text-xs',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      +{products.length - 3} {isZh ? '更多...' : 'more...'}
                    </li>
                  )}
                </ul>
              </Card>
            )
          })}
        </div>

        {/* Educational Note */}
        <Card>
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
              theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'
            )}>
              <GraduationCap className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <h3 className={cn(
                'font-bold mb-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '教育与艺术的融合' : 'Education Meets Art'}
              </h3>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '每一件文创产品都蕴含着偏振光的科学原理。从干涉产生的绚丽色彩，到应力双折射的独特图案，这些产品不仅是美的展示，更是科学教育的载体。'
                  : 'Every creative product embodies the science of polarized light. From the brilliant colors of interference to the unique patterns of stress birefringence, these products are not just beautiful displays but carriers of scientific education.'}
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
