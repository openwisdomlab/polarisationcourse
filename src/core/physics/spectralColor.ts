/**
 * CIE 1931 标准观察者光谱颜色转换模块
 *
 * Converts visible-light wavelengths (380-780 nm) to sRGB colors using the
 * CIE 1931 2-degree standard observer color matching functions.
 *
 * Pipeline:
 *   wavelength → CIE XYZ (via x̄, ȳ, z̄ interpolation)
 *              → linear sRGB (D65 matrix)
 *              → gamut-mapped linear sRGB (desaturation toward equal-energy white)
 *              → gamma-encoded sRGB
 *
 * Edge intensity falloff is applied near UV (380-420 nm) and IR (700-780 nm)
 * boundaries to model reduced visual sensitivity at the spectral extremes.
 *
 * Reference: CIE 015:2004, "Colorimetry", 3rd edition.
 */

// ========== CIE 1931 2° Standard Observer Data (5 nm intervals, 380-780 nm) ==========

/** CIE 1931 x̄(λ) color matching function — 81 points at 5 nm intervals, 380-780 nm */
const CMF_X = [
  0.001368, 0.002236, 0.004243, 0.007650, 0.014310,
  0.023190, 0.043510, 0.077630, 0.134380, 0.214770,
  0.283900, 0.328500, 0.348280, 0.348060, 0.336200,
  0.318700, 0.290800, 0.251100, 0.195360, 0.142100,
  0.095640, 0.058150, 0.032010, 0.014700, 0.004900,
  0.002400, 0.009300, 0.029100, 0.063270, 0.109600,
  0.165500, 0.225750, 0.290400, 0.359700, 0.433450,
  0.512050, 0.594500, 0.678400, 0.762100, 0.842500,
  0.916300, 0.978600, 1.026300, 1.056700, 1.062200,
  1.045600, 1.002600, 0.938400, 0.854450, 0.751400,
  0.642400, 0.541900, 0.447900, 0.360800, 0.283500,
  0.218700, 0.164900, 0.121200, 0.087400, 0.063600,
  0.046770, 0.032900, 0.022700, 0.015840, 0.011359,
  0.008111, 0.005790, 0.004109, 0.002899, 0.002049,
  0.001440, 0.001000, 0.000690, 0.000476, 0.000332,
  0.000235, 0.000166, 0.000117, 0.000083, 0.000059,
  0.000042,
];

/** CIE 1931 ȳ(λ) color matching function (luminosity) */
const CMF_Y = [
  0.000039, 0.000064, 0.000120, 0.000217, 0.000396,
  0.000640, 0.001210, 0.002180, 0.004000, 0.007300,
  0.011600, 0.016840, 0.023000, 0.029800, 0.038000,
  0.048000, 0.060000, 0.073900, 0.090980, 0.112600,
  0.139020, 0.169300, 0.208020, 0.258600, 0.323000,
  0.407300, 0.503000, 0.608200, 0.710000, 0.793200,
  0.862000, 0.914850, 0.954000, 0.980300, 0.994950,
  1.000000, 0.995000, 0.978600, 0.952000, 0.915400,
  0.870000, 0.816300, 0.757000, 0.694900, 0.631000,
  0.566800, 0.503000, 0.441200, 0.381000, 0.321000,
  0.265000, 0.217000, 0.175000, 0.138200, 0.107000,
  0.081600, 0.061000, 0.044580, 0.032000, 0.023200,
  0.017000, 0.011920, 0.008210, 0.005723, 0.004102,
  0.002929, 0.002091, 0.001484, 0.001047, 0.000740,
  0.000520, 0.000361, 0.000249, 0.000172, 0.000120,
  0.000085, 0.000060, 0.000042, 0.000030, 0.000021,
  0.000015,
];

/** CIE 1931 z̄(λ) color matching function */
const CMF_Z = [
  0.006450, 0.010550, 0.020050, 0.036210, 0.067850,
  0.110200, 0.207400, 0.371300, 0.645600, 1.039050,
  1.385600, 1.622960, 1.747060, 1.782600, 1.772110,
  1.744100, 1.669200, 1.528100, 1.287640, 1.041900,
  0.812950, 0.616200, 0.465180, 0.353300, 0.272000,
  0.212300, 0.158200, 0.111700, 0.078250, 0.057250,
  0.042160, 0.029840, 0.020300, 0.013400, 0.008750,
  0.005750, 0.003900, 0.002750, 0.002100, 0.001800,
  0.001650, 0.001400, 0.001100, 0.001000, 0.000800,
  0.000600, 0.000340, 0.000240, 0.000190, 0.000100,
  0.000050, 0.000030, 0.000020, 0.000010, 0.000000,
  0.000000, 0.000000, 0.000000, 0.000000, 0.000000,
  0.000000, 0.000000, 0.000000, 0.000000, 0.000000,
  0.000000, 0.000000, 0.000000, 0.000000, 0.000000,
  0.000000, 0.000000, 0.000000, 0.000000, 0.000000,
  0.000000, 0.000000, 0.000000, 0.000000, 0.000000,
  0.000000,
];

// ========== Internal Helpers ==========

/**
 * 线性插值 CIE 色匹配函数值
 *
 * Linearly interpolates the CMF data at an arbitrary wavelength.
 * Clamps to 380-780 nm range.
 */
function interpolateCMF(wavelengthNm: number): { X: number; Y: number; Z: number } {
  const wl = Math.max(380, Math.min(780, wavelengthNm));
  const idx = (wl - 380) / 5;
  const i = Math.floor(idx);
  const frac = idx - i;

  if (i >= CMF_X.length - 1) {
    return { X: CMF_X[CMF_X.length - 1], Y: CMF_Y[CMF_Y.length - 1], Z: CMF_Z[CMF_Z.length - 1] };
  }

  return {
    X: CMF_X[i] + frac * (CMF_X[i + 1] - CMF_X[i]),
    Y: CMF_Y[i] + frac * (CMF_Y[i + 1] - CMF_Y[i]),
    Z: CMF_Z[i] + frac * (CMF_Z[i + 1] - CMF_Z[i]),
  };
}

/**
 * CIE XYZ → 线性 sRGB 转换 (D65 白点)
 *
 * Uses the IEC 61966-2-1 sRGB matrix (D65 illuminant).
 */
function xyzToLinearSRGB(X: number, Y: number, Z: number): [number, number, number] {
  const r = 3.2406255 * X - 1.5372080 * Y - 0.4986286 * Z;
  const g = -0.9689307 * X + 1.8757561 * Y + 0.0415175 * Z;
  const b = 0.0557101 * X - 0.2040211 * Y + 1.0569959 * Z;
  return [r, g, b];
}

/**
 * 色域映射: 向等能白点去饱和
 *
 * If any linear sRGB channel is negative, desaturates toward equal-energy
 * white (the Y channel / luminance) until all channels are non-negative.
 * Then clamps to [0, 1].
 */
function gamutMap(r: number, g: number, b: number, Y: number): [number, number, number] {
  // 找到需要的最小去饱和比例
  const w = Y; // luminance as white point
  let t = 0;  // desaturation fraction: 0 = full color, 1 = pure white

  for (const c of [r, g, b]) {
    if (c < 0) {
      // Solve: c * (1 - t) + w * t >= 0  →  t >= -c / (w - c)
      const needed = -c / (w - c);
      if (needed > t) t = needed;
    }
  }

  const mr = r * (1 - t) + w * t;
  const mg = g * (1 - t) + w * t;
  const mb = b * (1 - t) + w * t;

  // Clamp to [0, 1] for safety (handles edge rounding)
  return [
    Math.max(0, Math.min(1, mr)),
    Math.max(0, Math.min(1, mg)),
    Math.max(0, Math.min(1, mb)),
  ];
}

/**
 * sRGB 伽马编码
 *
 * IEC 61966-2-1 companding: linear → gamma-encoded sRGB.
 */
function srgbGamma(linear: number): number {
  if (linear <= 0.0031308) {
    return 12.92 * linear;
  }
  return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
}

/**
 * 光谱边缘强度衰减
 *
 * Models reduced visual sensitivity at UV (380-420 nm) and IR (700-780 nm)
 * edges of the visible spectrum. Returns a factor in [0, 1].
 */
function edgeIntensity(wavelengthNm: number): number {
  if (wavelengthNm < 380 || wavelengthNm > 780) return 0;
  if (wavelengthNm < 420) {
    return 0.3 + 0.7 * (wavelengthNm - 380) / (420 - 380);
  }
  if (wavelengthNm > 700) {
    return 0.3 + 0.7 * (780 - wavelengthNm) / (780 - 700);
  }
  return 1;
}

// ========== Core Conversion ==========

/**
 * 波长 → 归一化 sRGB (0-1 浮点)
 *
 * Internal core function that all public APIs delegate to.
 *
 * @param wavelengthNm - Wavelength in nanometers (380-780)
 * @returns [r, g, b] array with values in [0, 1]
 */
function wavelengthToSRGB01(wavelengthNm: number): [number, number, number] {
  if (wavelengthNm < 380 || wavelengthNm > 780) {
    return [0, 0, 0];
  }

  // Step 1: CIE XYZ from color matching functions
  const { X, Y, Z } = interpolateCMF(wavelengthNm);

  // Step 2: XYZ → linear sRGB
  let [lr, lg, lb] = xyzToLinearSRGB(X, Y, Z);

  // Step 3: Edge intensity falloff
  const edge = edgeIntensity(wavelengthNm);
  lr *= edge;
  lg *= edge;
  lb *= edge;

  // Step 4: Gamut mapping (desaturate toward white)
  const [mr, mg, mb] = gamutMap(lr, lg, lb, Y * edge);

  // Step 5: Normalize — scale so the brightest channel reaches 1.0
  const peak = Math.max(mr, mg, mb);
  if (peak <= 0) return [0, 0, 0];
  const nr = mr / peak;
  const ng = mg / peak;
  const nb = mb / peak;

  // Step 6: sRGB gamma encoding
  return [srgbGamma(nr), srgbGamma(ng), srgbGamma(nb)];
}

// ========== Public API ==========

/**
 * 波长 → RGB (0-255 整数)
 *
 * Returns an object with r, g, b integer values suitable for SVG attributes,
 * canvas drawing, or constructing CSS color strings.
 *
 * @param wavelengthNm - Wavelength in nanometers (380-780)
 * @returns Object with r, g, b values (0-255 integers)
 *
 * @example
 * ```ts
 * const { r, g, b } = wavelengthToRGB(550); // green light
 * element.setAttribute('fill', `rgb(${r}, ${g}, ${b})`);
 * ```
 */
export function wavelengthToRGB(wavelengthNm: number): { r: number; g: number; b: number } {
  const [r, g, b] = wavelengthToSRGB01(wavelengthNm);
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * 波长 → 归一化 RGB (0-1 浮点数组)
 *
 * Returns a tuple of [r, g, b] floats in [0, 1], suitable for Three.js
 * Color objects, WebGL uniforms, or any API expecting normalized color.
 *
 * @param wavelengthNm - Wavelength in nanometers (380-780)
 * @returns [r, g, b] tuple with values in [0, 1]
 *
 * @example
 * ```ts
 * const [r, g, b] = wavelengthToColor01(589); // sodium yellow
 * material.color.setRGB(r, g, b);
 * ```
 */
export function wavelengthToColor01(wavelengthNm: number): [number, number, number] {
  return wavelengthToSRGB01(wavelengthNm);
}

/**
 * 波长 → CSS 颜色字符串
 *
 * Returns an "rgb(r, g, b)" string for direct use in CSS properties,
 * inline styles, or SVG style attributes.
 *
 * @param wavelengthNm - Wavelength in nanometers (380-780)
 * @returns CSS color string like "rgb(255, 128, 0)"
 *
 * @example
 * ```ts
 * element.style.color = wavelengthToCSS(632.8); // HeNe laser red
 * ```
 */
export function wavelengthToCSS(wavelengthNm: number): string {
  const { r, g, b } = wavelengthToRGB(wavelengthNm);
  return `rgb(${r}, ${g}, ${b})`;
}
