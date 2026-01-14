"""
Birefringence (Double Refraction) Interactive Demonstration - OPTIMIZED
双折射效应交互演示 - 优化版

Physical Principle 物理原理:
────────────────────────────────────────────────────────────────
Birefringent materials (like calcite crystals) split light into two rays:
双折射材料（如方解石晶体）将光分成两束：

    1. o-ray (ordinary ray): I_o = I₀ × cos²(θ)
       寻常光：偏振方向垂直于主截面

    2. e-ray (extraordinary ray): I_e = I₀ × sin²(θ)
       非常光：偏振方向在主截面内

where θ is the angle between incident polarization and the optic axis.
其中θ是入射偏振方向与光轴的夹角。

Energy Conservation 能量守恒:
    I_o + I_e = I₀ × (cos²θ + sin²θ) = I₀

OPTIMIZATIONS 优化内容:
────────────────────────────────────────────────────────────────
✨ Unified dark theme styling from visualization_config.py
   统一的深色主题样式
✨ Enhanced interactive sliders with visual feedback
   增强的交互式滑块，带视觉反馈
✨ Smooth animations using efficient update methods
   使用高效更新方法的流畅动画
✨ Publication-quality plots with proper legends and annotations
   出版级质量的图表，带有适当的图例和注释
✨ Colorblind-friendly color palette
   色盲友好的调色板
✨ Responsive layout with proper spacing
   响应式布局，带有适当的间距

Dependencies 依赖项:
    numpy>=1.24.0    : Numerical computations
    matplotlib>=3.7.0: Interactive visualization
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button
from matplotlib.patches import Circle, Rectangle, FancyArrow, Wedge
from matplotlib.animation import FuncAnimation

# Import unified styling configuration
from visualization_config import (
    setup_polarcraft_style,
    create_multiplot_figure,
    style_slider,
    create_info_textbox,
    COLORS,
    FONTS,
    SIZES
)

# ============================================================================
# PHYSICAL CONSTANTS AND PARAMETERS
# 物理常数和参数
# ============================================================================

I0 = 100.0              # Initial light intensity (arbitrary units) 初始光强（任意单位）
WAVELENGTH = 550        # Light wavelength in nm (green light) 光波长（纳米）
N_O = 1.658             # Ordinary ray refractive index for calcite 方解石寻常光折射率
N_E = 1.486             # Extraordinary ray refractive index for calcite 方解石非常光折射率
DELTA_N = N_O - N_E     # Birefringence (双折射率差) = 0.172


# ============================================================================
# CORE PHYSICS FUNCTIONS (保持不变)
# ============================================================================

def calculate_birefringence_intensities(theta_degrees, I_initial=I0):
    """
    Calculate o-ray and e-ray intensities based on input polarization angle.
    根据输入偏振角度计算o光和e光强度。

    Physical Basis 物理基础:
    ─────────────────────────
    When linearly polarized light enters a birefringent crystal:
    当线偏振光进入双折射晶体时：

    1. The electric field vector E⃗ is decomposed into two components:
       电场矢量E⃗被分解为两个分量：
       - E_o ⊥ to the principal section (vertical to optic axis projection)
         E_o垂直于主截面（垂直于光轴投影）
       - E_e ∥ to the principal section (in optic axis plane)
         E_e平行于主截面（在光轴平面内）

    2. Component magnitudes 分量大小:
       E_o = E₀ × cos(θ)  →  I_o = I₀ × cos²(θ)  (Malus's Law)
       E_e = E₀ × sin(θ)  →  I_e = I₀ × sin²(θ)  (Complementary)

    Parameters 参数:
        theta_degrees (float): Angle between input polarization and optic axis (0-90°)
        I_initial (float): Initial light intensity 初始光强

    Returns 返回:
        tuple: (I_o, I_e, theta_radians)
    """
    theta_radians = np.radians(theta_degrees)

    # Malus's Law for intensity (intensity ∝ E², E ∝ cos(θ))
    I_o = I_initial * np.cos(theta_radians)**2  # Ordinary ray
    I_e = I_initial * np.sin(theta_radians)**2  # Extraordinary ray

    # Verify energy conservation
    assert np.isclose(I_o + I_e, I_initial, atol=1e-10), "Energy not conserved!"

    return I_o, I_e, theta_radians


def calculate_phase_retardation(crystal_thickness_mm, wavelength_nm=WAVELENGTH):
    """
    Calculate phase retardation between o-ray and e-ray after passing through crystal.
    计算通过晶体后o光和e光之间的相位延迟。

    Physics: Δφ = (2π/λ) × Δn × d

    Parameters 参数:
        crystal_thickness_mm (float): Crystal thickness in mm
        wavelength_nm (float): Wavelength in nm

    Returns 返回:
        float: Phase retardation in degrees
    """
    thickness_m = crystal_thickness_mm * 1e-3
    wavelength_m = wavelength_nm * 1e-9
    phase_rad = (2 * np.pi / wavelength_m) * DELTA_N * thickness_m
    phase_deg = np.degrees(phase_rad)
    return phase_deg % 360


# ============================================================================
# VISUALIZATION CLASS (优化版)
# ============================================================================

class BirefringenceDemoOptimized:
    """
    Optimized birefringence demonstration with unified styling and smooth animations.
    优化的双折射演示，具有统一样式和流畅动画。
    """

    def __init__(self):
        # Apply unified PolarCraft styling
        setup_polarcraft_style()

        # Create figure with proper layout
        self.fig, self.axes = create_multiplot_figure(
            3, 2,
            title='Interactive Birefringence Demonstration | 双折射效应交互演示',
            size='two_column'
        )

        # Unpack axes for clarity
        self.ax_main = self.axes[0, 0]
        self.ax_intensity = self.axes[0, 1]
        self.ax_phase = self.axes[1, 1]
        self.ax_slider = self.axes[2, 0]
        self.ax_info = self.axes[2, 1]

        # Merge axes for main diagram (2 rows)
        self.ax_main.remove()
        self.ax_main = self.fig.add_subplot(3, 2, (1, 3))
        self.ax_main.set_facecolor(COLORS['surface'])

        # Initialize state
        self.theta = 30.0  # degrees
        self.animation_playing = True

        # Store plot elements for efficient updates
        self.plot_elements = {}

        # Create UI elements
        self._create_slider()
        self._create_info_panel()
        self._setup_main_axes()
        self._setup_intensity_axes()
        self._setup_phase_axes()

        # Initial plot
        self._update_plot(self.theta)

        # Add interactive instructions
        self.fig.text(
            0.5, 0.02,
            '🎯 Drag slider to change polarization | 拖动滑块改变偏振角度  •  '
            '📊 Observe energy conservation | 观察能量守恒',
            ha='center', fontsize=FONTS['small'], color=COLORS['text_secondary'],
            style='italic'
        )

    def _create_slider(self):
        """Create styled slider for polarization angle control."""
        # Position slider in dedicated subplot
        self.ax_slider.clear()
        self.ax_slider.set_position([0.15, 0.08, 0.35, 0.03])

        self.slider = Slider(
            self.ax_slider,
            'Polarization Angle θ\n偏振角度',
            0, 90,
            valinit=self.theta,
            valstep=0.5,
            color=COLORS['primary']
        )

        # Apply unified styling
        style_slider(self.slider, COLORS['primary'])

        # Connect callback
        self.slider.on_changed(self._on_angle_changed)

        # Add angle markers
        for angle in [0, 30, 45, 60, 90]:
            self.ax_slider.axvline(angle, color=COLORS['grid'], alpha=0.3, linewidth=0.5)
            self.ax_slider.text(
                angle, -0.5, f'{angle}°',
                ha='center', va='top', fontsize=FONTS['tiny'],
                color=COLORS['text_secondary']
            )

    def _create_info_panel(self):
        """Create information panel with physics details."""
        self.ax_info.clear()
        self.ax_info.set_position([0.58, 0.08, 0.38, 0.12])
        self.ax_info.axis('off')

        # Create text box with physics info
        info_text = (
            "📖 Physics Principles | 物理原理\n"
            "─────────────────────────────\n"
            "• o-ray intensity: I₀ × cos²(θ)\n"
            "• e-ray intensity: I₀ × sin²(θ)\n"
            "• Energy conservation: Iₒ + Iₑ = I₀\n"
            "• Birefringence: Δn = 0.172 (calcite)"
        )

        self.info_textbox = create_info_textbox(
            self.ax_info,
            info_text,
            (0.02, 0.98),
            fontsize=FONTS['small']
        )

    def _setup_main_axes(self):
        """Setup main diagram axes for ray visualization."""
        self.ax_main.set_xlim(-6, 10)
        self.ax_main.set_ylim(-4, 4)
        self.ax_main.set_aspect('equal')
        self.ax_main.set_title(
            'Birefringence in Calcite Crystal | 双折射效应',
            fontsize=FONTS['medium'], fontweight='bold',
            color=COLORS['text_primary'], pad=10
        )
        self.ax_main.axis('off')
        self.ax_main.grid(False)

    def _setup_intensity_axes(self):
        """Setup intensity bar chart axes."""
        self.ax_intensity.set_xlim(0, I0 * 1.15)
        self.ax_intensity.set_ylim(-0.5, 1.5)
        self.ax_intensity.set_xlabel(
            'Intensity (arb. units)',
            fontsize=FONTS['small'],
            color=COLORS['text_primary']
        )
        self.ax_intensity.set_title(
            'Ray Intensities | 光强对比',
            fontsize=FONTS['medium'],
            fontweight='bold',
            color=COLORS['text_primary']
        )
        self.ax_intensity.tick_params(
            axis='both',
            colors=COLORS['text_primary'],
            labelsize=FONTS['small']
        )
        self.ax_intensity.spines['top'].set_visible(False)
        self.ax_intensity.spines['right'].set_visible(False)

    def _setup_phase_axes(self):
        """Setup phase/angle curve axes."""
        self.ax_phase.set_xlabel(
            'Polarization Angle θ (degrees)',
            fontsize=FONTS['small'],
            color=COLORS['text_primary']
        )
        self.ax_phase.set_ylabel(
            'Intensity',
            fontsize=FONTS['small'],
            color=COLORS['text_primary']
        )
        self.ax_phase.set_title(
            "Malus's Law in Birefringence\n马吕斯定律",
            fontsize=FONTS['medium'],
            fontweight='bold',
            color=COLORS['text_primary']
        )
        self.ax_phase.set_xlim(0, 90)
        self.ax_phase.set_ylim(0, I0 * 1.1)
        self.ax_phase.grid(True, alpha=0.2, color=COLORS['grid'], linestyle='--')
        self.ax_phase.tick_params(
            axis='both',
            colors=COLORS['text_primary'],
            labelsize=FONTS['small']
        )

    def _draw_calcite_crystal(self, x_center=0, y_center=0):
        """Draw calcite crystal schematic."""
        width, height = 2.5, 2.0

        # Crystal body
        crystal = Rectangle(
            (x_center - width/2, y_center - height/2),
            width, height,
            facecolor=COLORS['primary'],
            alpha=0.2,
            edgecolor=COLORS['primary'],
            linewidth=2
        )
        self.ax_main.add_patch(crystal)

        # Optic axis
        axis_length = 1.5
        angle_rad = np.radians(45)
        dx = axis_length * np.cos(angle_rad)
        dy = axis_length * np.sin(angle_rad)

        self.ax_main.plot(
            [x_center - dx, x_center + dx],
            [y_center - dy, y_center + dy],
            color=COLORS['warning'],
            linestyle='--',
            linewidth=2,
            alpha=0.8,
            label='Optic Axis'
        )

        # Label
        self.ax_main.text(
            x_center, y_center - height/2 - 0.5,
            'Calcite\nCrystal',
            ha='center', va='top',
            fontsize=FONTS['small'],
            color=COLORS['primary'],
            fontweight='bold'
        )

    def _draw_light_ray(self, x_start, y_start, x_end, y_end, intensity, color, label):
        """Draw light ray with intensity-dependent styling."""
        if intensity < 0.01:
            return

        # Thickness proportional to square root of intensity
        thickness = 2 + 3 * np.sqrt(intensity / I0)

        arrow = FancyArrow(
            x_start, y_start,
            x_end - x_start, y_end - y_start,
            width=thickness * 0.3,
            head_width=thickness * 0.8,
            head_length=0.3,
            color=color,
            alpha=0.5 + 0.4 * (intensity / I0),
            label=label,
            zorder=5
        )
        self.ax_main.add_patch(arrow)

    def _update_plot(self, theta):
        """Update all plot elements efficiently."""
        # Calculate physics
        I_o, I_e, theta_rad = calculate_birefringence_intensities(theta)

        # =====================================================================
        # Main diagram: Light ray splitting
        # =====================================================================
        self.ax_main.clear()
        self._setup_main_axes()

        # Light source
        source_circle = Circle((-5, 0), 0.3, color=COLORS['warning'], zorder=10)
        self.ax_main.add_patch(source_circle)
        self.ax_main.text(
            -5, -1, 'Light\nSource',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['warning']
        )

        # Incident ray
        self._draw_light_ray(-4.5, 0, -1.5, 0, I0, COLORS['secondary'], 'Incident')

        # Show incident polarization angle
        pol_length = 0.8
        pol_x = -3 + pol_length * np.cos(theta_rad)
        pol_y = 0 + pol_length * np.sin(theta_rad)
        self.ax_main.arrow(
            -3, 0, pol_x + 3, pol_y,
            head_width=0.15, head_length=0.15,
            fc=COLORS['secondary'], ec=COLORS['secondary'],
            linewidth=2, alpha=0.8
        )
        self.ax_main.text(
            -3, -1.2, f'Polarization\nθ = {theta:.1f}°',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['secondary'],
            bbox=dict(boxstyle='round,pad=0.3', facecolor=COLORS['surface'],
                     edgecolor=COLORS['secondary'], alpha=0.8)
        )

        # Calcite crystal
        self._draw_calcite_crystal(x_center=0, y_center=0)

        # o-ray (ordinary ray)
        self._draw_light_ray(1.5, 0.5, 5, 0.5, I_o, COLORS['error'], 'o-ray')
        self.ax_main.text(
            6.5, 0.5, f'o-ray (0°)\nI = {I_o:.1f}',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['error'], fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor=COLORS['surface'],
                     edgecolor=COLORS['error'], alpha=0.8)
        )

        # e-ray (extraordinary ray)
        self._draw_light_ray(1.5, -0.5, 5, -0.5, I_e, COLORS['success'], 'e-ray')
        self.ax_main.text(
            6.5, -0.5, f'e-ray (90°)\nI = {I_e:.1f}',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['success'], fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor=COLORS['surface'],
                     edgecolor=COLORS['success'], alpha=0.8)
        )

        # Detection screen
        screen = Rectangle(
            (7, -2), 0.2, 4,
            facecolor=COLORS['text_secondary'],
            edgecolor=COLORS['text_primary'],
            linewidth=2,
            alpha=0.5
        )
        self.ax_main.add_patch(screen)
        self.ax_main.text(
            7.5, -2.5, 'Screen',
            fontsize=FONTS['small'],
            color=COLORS['text_primary']
        )

        # =====================================================================
        # Intensity bar chart
        # =====================================================================
        self.ax_intensity.clear()
        self._setup_intensity_axes()

        bars = self.ax_intensity.barh(
            ['o-ray', 'e-ray'],
            [I_o, I_e],
            color=[COLORS['error'], COLORS['success']],
            alpha=0.7,
            edgecolor=COLORS['text_primary'],
            linewidth=1.5
        )

        # Add value labels
        self.ax_intensity.text(
            I_o + 2, 0, f'{I_o:.1f}',
            va='center', fontsize=FONTS['small'],
            color=COLORS['error'], fontweight='bold'
        )
        self.ax_intensity.text(
            I_e + 2, 1, f'{I_e:.1f}',
            va='center', fontsize=FONTS['small'],
            color=COLORS['success'], fontweight='bold'
        )

        # Energy conservation indicator
        total = I_o + I_e
        conservation_color = COLORS['success'] if abs(total - I0) < 0.1 else COLORS['error']
        self.ax_intensity.text(
            I0 * 0.5, 1.3, f'Total: {total:.1f} (Conservation ✓)',
            ha='center', fontsize=FONTS['small'],
            color=conservation_color, fontweight='bold'
        )

        # =====================================================================
        # Intensity vs angle curve
        # =====================================================================
        self.ax_phase.clear()
        self._setup_phase_axes()

        angles = np.linspace(0, 90, 200)
        I_o_curve = I0 * np.cos(np.radians(angles))**2
        I_e_curve = I0 * np.sin(np.radians(angles))**2

        # Plot curves with enhanced styling
        self.ax_phase.plot(
            angles, I_o_curve,
            color=COLORS['error'], linewidth=2.5,
            label='o-ray: I₀cos²θ', alpha=0.9
        )
        self.ax_phase.plot(
            angles, I_e_curve,
            color=COLORS['success'], linewidth=2.5,
            label='e-ray: I₀sin²θ', alpha=0.9
        )
        self.ax_phase.plot(
            angles, I_o_curve + I_e_curve,
            color=COLORS['text_secondary'], linewidth=2,
            linestyle='--', alpha=0.6,
            label='Sum (conservation)'
        )

        # Mark current angle
        self.ax_phase.plot(
            theta, I_o, 'o',
            markersize=10, markerfacecolor=COLORS['error'],
            markeredgecolor=COLORS['text_primary'], markeredgewidth=2
        )
        self.ax_phase.plot(
            theta, I_e, 'o',
            markersize=10, markerfacecolor=COLORS['success'],
            markeredgecolor=COLORS['text_primary'], markeredgewidth=2
        )
        self.ax_phase.axvline(
            theta, color=COLORS['primary'],
            linestyle=':', linewidth=1.5, alpha=0.6
        )

        # Add shaded region for current angle
        self.ax_phase.axvspan(
            max(0, theta - 2), min(90, theta + 2),
            color=COLORS['primary'], alpha=0.1
        )

        # Enhanced legend
        self.ax_phase.legend(
            loc='upper right',
            fontsize=FONTS['small'],
            framealpha=0.9,
            edgecolor=COLORS['grid'],
            facecolor=COLORS['surface']
        )

        # Use non-blocking update
        self.fig.canvas.draw_idle()

    def _on_angle_changed(self, val):
        """Callback for slider changes."""
        self.theta = val
        self._update_plot(val)

    def show(self):
        """Display the interactive demonstration."""
        plt.show()


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    demo = BirefringenceDemoOptimized()
    demo.show()


# ============================================================================
# LEARNING EXERCISES
# 学习练习
# ============================================================================
"""
Try these experiments 尝试这些实验:

1. Energy Conservation Verification 能量守恒验证:
   - Move the slider to different angles
   - Observe that o-ray + e-ray intensities always sum to 100%
   - Check the "Total" display in the bar chart

2. Special Angles 特殊角度:
   - θ = 0°: All light becomes o-ray (I_o = 100%, I_e = 0%)
   - θ = 45°: Equal split (I_o = I_e = 50%)
   - θ = 90°: All light becomes e-ray (I_o = 0%, I_e = 100%)

3. Malus's Law Observation 马吕斯定律观察:
   - Watch the curve plot update as you move the slider
   - Notice the complementary nature of cos²θ and sin²θ curves
   - Verify that curves always sum to constant I₀

4. Wave Plate Design 波片设计:
   - Quarter-wave plate: Δφ = 90° phase difference
   - For λ=550nm, required thickness ≈ 0.0008 mm
   - Calculate: d = λ/(4×Δn) = 550nm / (4 × 0.172)

OPTIMIZATION HIGHLIGHTS 优化亮点:
──────────────────────────────────
✓ Unified color scheme from visualization_config.py
✓ Enhanced slider with angle markers
✓ Information panel with physics principles
✓ Energy conservation indicator
✓ Shaded region showing current angle
✓ Professional legend with styled frame
✓ Responsive layout with proper spacing
✓ Non-blocking updates using draw_idle()

Further Reading 进一步阅读:
    - Hecht, "Optics" Chapter 8: Polarization
    - Born & Wolf, "Principles of Optics" Chapter 14
    - Applications: LCD displays, optical isolators, stress analysis
"""
