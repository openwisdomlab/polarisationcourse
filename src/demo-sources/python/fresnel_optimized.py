"""
Fresnel Equations Interactive Demonstration - OPTIMIZED
菲涅尔方程交互演示 - 优化版

Physical Principle 物理原理:
────────────────────────────────────────────────────────────────
The Fresnel equations describe reflection and transmission at optical interfaces.
菲涅尔方程描述光在光学界面的反射和透射。

For s-polarization (⊥ to plane of incidence):
    r_s = (n₁cosθ₁ - n₂cosθ₂) / (n₁cosθ₁ + n₂cosθ₂)
    R_s = |r_s|²

For p-polarization (∥ to plane of incidence):
    r_p = (n₂cosθ₁ - n₁cosθ₂) / (n₂cosθ₁ + n₁cosθ₂)
    R_p = |r_p|²

Brewster's Angle: θ_B = arctan(n₂/n₁)  →  R_p = 0
Total Internal Reflection: θ > θ_c = arcsin(n₂/n₁) when n₁ > n₂

OPTIMIZATIONS 优化内容:
────────────────────────────────────────────────────────────────
✨ Unified PolarCraft dark theme styling
✨ Enhanced dual sliders with visual markers
✨ Improved checkbox styling for polarization selection
✨ Real-time Brewster angle and critical angle annotations
✨ Smooth curve updates with optimized rendering
✨ Energy conservation indicators
✨ Information panel with physics equations
✨ Responsive layout with proper spacing

Dependencies:
    numpy>=1.24.0, matplotlib>=3.7.0
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, CheckButtons
from matplotlib.patches import Wedge, FancyArrowPatch
from matplotlib.patches import Rectangle

# Import unified styling
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
# PHYSICAL CONSTANTS
# ============================================================================

N1_AIR = 1.0
N2_GLASS = 1.5
N2_WATER = 1.333
N2_DIAMOND = 2.417


# ============================================================================
# CORE PHYSICS FUNCTIONS (保持不变)
# ============================================================================

def snells_law(theta1_deg, n1, n2):
    """Apply Snell's law: n₁sin(θ₁) = n₂sin(θ₂)"""
    theta1_rad = np.radians(theta1_deg)
    sin_theta2 = (n1 / n2) * np.sin(theta1_rad)

    if sin_theta2 > 1.0:
        return None  # Total internal reflection

    theta2_rad = np.arcsin(sin_theta2)
    return np.degrees(theta2_rad)


def fresnel_coefficients(theta1_deg, n1, n2):
    """
    Calculate Fresnel reflection and transmission coefficients.
    计算菲涅尔反射和透射系数。

    Returns dict with:
        rs, rp: amplitude reflection coefficients
        Rs, Rp: intensity reflectance
        Ts, Tp: intensity transmittance
        theta2: refraction angle
        tir: total internal reflection flag
    """
    theta1_rad = np.radians(theta1_deg)
    cos_theta1 = np.cos(theta1_rad)
    sin_theta1 = np.sin(theta1_rad)

    sin_theta2 = (n1 / n2) * sin_theta1

    # Check for total internal reflection
    if sin_theta2 > 1.0:
        return {
            'rs': 1.0, 'rp': 1.0,
            'ts': 0.0, 'tp': 0.0,
            'theta2': 90.0,
            'Rs': 1.0, 'Rp': 1.0,
            'Ts': 0.0, 'Tp': 0.0,
            'tir': True
        }

    cos_theta2 = np.sqrt(1 - sin_theta2**2)
    theta2_deg = np.degrees(np.arcsin(sin_theta2))

    # Fresnel equations
    rs = (n1 * cos_theta1 - n2 * cos_theta2) / (n1 * cos_theta1 + n2 * cos_theta2)
    ts = (2 * n1 * cos_theta1) / (n1 * cos_theta1 + n2 * cos_theta2)

    rp = (n2 * cos_theta1 - n1 * cos_theta2) / (n2 * cos_theta1 + n1 * cos_theta2)
    tp = (2 * n1 * cos_theta1) / (n2 * cos_theta1 + n1 * cos_theta2)

    # Intensity coefficients
    Rs = rs**2
    Rp = rp**2

    angle_factor = (n2 * cos_theta2) / (n1 * cos_theta1)
    Ts = angle_factor * ts**2
    Tp = angle_factor * tp**2

    # Verify energy conservation
    assert np.isclose(Rs + Ts, 1.0, atol=1e-6), f"Energy not conserved for s"
    assert np.isclose(Rp + Tp, 1.0, atol=1e-6), f"Energy not conserved for p"

    return {
        'rs': rs, 'rp': rp,
        'ts': ts, 'tp': tp,
        'theta2': theta2_deg,
        'Rs': Rs, 'Rp': Rp,
        'Ts': Ts, 'Tp': Tp,
        'tir': False
    }


def brewster_angle(n1, n2):
    """Calculate Brewster's angle: θ_B = arctan(n₂/n₁)"""
    theta_b_rad = np.arctan(n2 / n1)
    return np.degrees(theta_b_rad)


def critical_angle(n1, n2):
    """Calculate critical angle for TIR (only when n1 > n2)"""
    if n1 <= n2:
        return None
    sin_theta_c = n2 / n1
    theta_c_rad = np.arcsin(sin_theta_c)
    return np.degrees(theta_c_rad)


# ============================================================================
# OPTIMIZED VISUALIZATION CLASS
# ============================================================================

class FresnelDemoOptimized:
    """
    Optimized Fresnel equations demonstration with unified styling.
    优化的菲涅尔方程演示。
    """

    def __init__(self):
        # Apply unified styling
        setup_polarcraft_style()

        # Create figure
        self.fig = plt.figure(figsize=(16, 10), facecolor=COLORS['background'])
        self.fig.suptitle(
            'Interactive Fresnel Equations Demonstration | 菲涅尔方程交互演示',
            fontsize=FONTS['title'], fontweight='bold',
            color=COLORS['text_primary'], y=0.98
        )

        # Create layout
        self._create_layout()

        # Initialize state
        self.theta1 = 30.0
        self.n1 = N1_AIR
        self.n2 = N2_GLASS
        self.show_s = True
        self.show_p = True

        # Create UI elements
        self._create_sliders()
        self._create_checkboxes()
        self._create_info_panel()
        self._setup_axes()

        # Initial plot
        self._update_plot()

        # Instructions
        self.fig.text(
            0.5, 0.01,
            '🎯 Adjust angle and n₂  •  Toggle s/p polarization  •  '
            '🔬 Observe Brewster angle (R_p=0)',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['text_secondary'], style='italic'
        )

    def _create_layout(self):
        """Create subplot layout."""
        gs = self.fig.add_gridspec(5, 3, hspace=0.4, wspace=0.3,
                                    left=0.08, right=0.98, top=0.94, bottom=0.08)

        # Main plots
        self.ax_diagram = self.fig.add_subplot(gs[0:3, 0])
        self.ax_curves = self.fig.add_subplot(gs[0:3, 1:])

        # Sliders and controls
        self.ax_slider_angle = self.fig.add_subplot(gs[3, 0:2])
        self.ax_slider_n2 = self.fig.add_subplot(gs[4, 0:2])
        self.ax_info = self.fig.add_subplot(gs[3:5, 2])

        # Set background colors
        for ax in [self.ax_diagram, self.ax_curves]:
            ax.set_facecolor(COLORS['surface'])

    def _create_sliders(self):
        """Create styled sliders."""
        # Incident angle slider
        self.slider_angle = Slider(
            self.ax_slider_angle,
            'Incident Angle θ₁\n入射角度',
            0, 89,
            valinit=self.theta1,
            valstep=0.5,
            color=COLORS['primary']
        )
        style_slider(self.slider_angle, COLORS['primary'])

        # Add angle markers
        for angle in [0, 30, 45, 60, 90]:
            if angle < 89:
                self.ax_slider_angle.axvline(
                    angle, color=COLORS['grid'],
                    alpha=0.3, linewidth=0.5
                )

        # Refractive index slider
        self.slider_n2 = Slider(
            self.ax_slider_n2,
            'Refractive Index n₂\n折射率',
            1.0, 2.5,
            valinit=self.n2,
            valstep=0.01,
            color=COLORS['warning']
        )
        style_slider(self.slider_n2, COLORS['warning'])

        # Add material markers
        materials = [(1.0, 'Air'), (1.333, 'Water'), (1.5, 'Glass'), (2.417, 'Diamond')]
        for n, name in materials:
            self.ax_slider_n2.axvline(n, color=COLORS['grid'], alpha=0.3, linewidth=0.5)
            self.ax_slider_n2.text(
                n, -0.5, name,
                ha='center', va='top',
                fontsize=FONTS['tiny'],
                color=COLORS['text_secondary']
            )

        # Connect callbacks
        self.slider_angle.on_changed(self._on_slider_changed)
        self.slider_n2.on_changed(self._on_slider_changed)

    def _create_checkboxes(self):
        """Create styled checkboxes for polarization selection."""
        # Position checkboxes on left side
        ax_check = self.fig.add_axes([0.01, 0.45, 0.06, 0.1],
                                      facecolor=COLORS['surface'])
        self.check_polarization = CheckButtons(
            ax_check,
            ['s-pol', 'p-pol'],
            [True, True]
        )

        # Style checkbox labels
        for label in self.check_polarization.labels:
            label.set_color(COLORS['text_primary'])
            label.set_fontsize(FONTS['small'])

        # Connect callback
        self.check_polarization.on_clicked(self._on_checkbox_changed)

    def _create_info_panel(self):
        """Create information panel."""
        self.ax_info.axis('off')

        info_text = (
            "📖 Fresnel Equations | 菲涅尔方程\n"
            "─────────────────────────────────\n"
            "s-polarization (⊥ plane):\n"
            "  r_s = (n₁cosθ₁-n₂cosθ₂)/(n₁cosθ₁+n₂cosθ₂)\n"
            "  R_s = |r_s|²\n\n"
            "p-polarization (∥ plane):\n"
            "  r_p = (n₂cosθ₁-n₁cosθ₂)/(n₂cosθ₁+n₁cosθ₂)\n"
            "  R_p = |r_p|²\n\n"
            "Energy conservation:\n"
            "  R + T = 1 ✓\n\n"
            "Special angles:\n"
            "  Brewster: θ_B = arctan(n₂/n₁)\n"
            "  Critical: θ_c = arcsin(n₂/n₁)"
        )

        self.info_textbox = create_info_textbox(
            self.ax_info,
            info_text,
            (0.05, 0.95),
            fontsize=FONTS['tiny']
        )

    def _setup_axes(self):
        """Setup axes properties."""
        # Diagram axes
        self.ax_diagram.set_xlim(-3, 3)
        self.ax_diagram.set_ylim(-2, 2)
        self.ax_diagram.set_aspect('equal')
        self.ax_diagram.set_title(
            'Interface Diagram | 界面示意图',
            fontsize=FONTS['medium'],
            fontweight='bold',
            color=COLORS['text_primary']
        )
        self.ax_diagram.axis('off')

        # Curves axes
        self.ax_curves.set_xlabel(
            'Incident Angle θ₁ (degrees)',
            fontsize=FONTS['small'],
            color=COLORS['text_primary']
        )
        self.ax_curves.set_ylabel(
            'Percentage (%)',
            fontsize=FONTS['small'],
            color=COLORS['text_primary']
        )
        self.ax_curves.set_title(
            'Fresnel Coefficients vs Incident Angle\n菲涅尔系数随入射角变化',
            fontsize=FONTS['medium'],
            fontweight='bold',
            color=COLORS['text_primary']
        )
        self.ax_curves.set_xlim(0, 90)
        self.ax_curves.set_ylim(0, 105)
        self.ax_curves.grid(True, alpha=0.2, color=COLORS['grid'], linestyle='--')
        self.ax_curves.tick_params(
            axis='both',
            colors=COLORS['text_primary'],
            labelsize=FONTS['small']
        )

    def _draw_interface_diagram(self):
        """Draw optical interface with rays."""
        self.ax_diagram.clear()
        self._setup_axes()

        # Calculate Fresnel coefficients
        fresnel = fresnel_coefficients(self.theta1, self.n1, self.n2)

        # Draw interface
        self.ax_diagram.plot(
            [-3, 3], [0, 0],
            color=COLORS['text_primary'],
            linewidth=3
        )

        # Medium labels
        self.ax_diagram.text(
            -2.5, 1.5,
            f'Medium 1\nn₁ = {self.n1:.3f}',
            fontsize=FONTS['small'],
            color=COLORS['primary'],
            bbox=dict(boxstyle='round,pad=0.5',
                     facecolor=COLORS['surface'],
                     edgecolor=COLORS['primary'],
                     alpha=0.9)
        )
        self.ax_diagram.text(
            -2.5, -1.5,
            f'Medium 2\nn₂ = {self.n2:.3f}',
            fontsize=FONTS['small'],
            color=COLORS['warning'],
            bbox=dict(boxstyle='round,pad=0.5',
                     facecolor=COLORS['surface'],
                     edgecolor=COLORS['warning'],
                     alpha=0.9)
        )

        # Shade regions
        self.ax_diagram.fill_between(
            [-3, 3], 0, 2,
            alpha=0.1,
            color=COLORS['primary']
        )
        self.ax_diagram.fill_between(
            [-3, 3], -2, 0,
            alpha=0.1,
            color=COLORS['warning']
        )

        # Ray parameters
        ray_length = 1.5
        theta1_rad = np.radians(self.theta1)

        # Normal line
        self.ax_diagram.plot(
            [0, 0], [-2, 2],
            color=COLORS['text_secondary'],
            linestyle='--',
            linewidth=1,
            alpha=0.5
        )

        # Incident ray
        inc_x = -ray_length * np.sin(theta1_rad)
        inc_y = ray_length * np.cos(theta1_rad)
        self.ax_diagram.arrow(
            inc_x, inc_y, -inc_x, -inc_y,
            head_width=0.15, head_length=0.15,
            fc=COLORS['secondary'], ec=COLORS['secondary'],
            linewidth=2.5, alpha=0.9,
            length_includes_head=True
        )
        self.ax_diagram.text(
            inc_x - 0.3, inc_y,
            f'Incident\nθ₁={self.theta1:.1f}°',
            fontsize=FONTS['tiny'],
            color=COLORS['secondary'],
            ha='right'
        )

        # Reflected rays
        ref_x = ray_length * np.sin(theta1_rad)
        ref_y = ray_length * np.cos(theta1_rad)

        if self.show_s and fresnel['Rs'] > 0.01:
            self.ax_diagram.arrow(
                0, 0, ref_x, ref_y,
                head_width=0.15, head_length=0.15,
                fc=COLORS['error'], ec=COLORS['error'],
                linewidth=2 + 3*np.sqrt(fresnel['Rs']),
                alpha=0.5 + 0.4*fresnel['Rs'],
                length_includes_head=True
            )
            self.ax_diagram.text(
                ref_x + 0.3, ref_y,
                f's-pol\nR={fresnel["Rs"]*100:.1f}%',
                fontsize=FONTS['tiny'],
                color=COLORS['error'],
                ha='left'
            )

        if self.show_p and fresnel['Rp'] > 0.01:
            self.ax_diagram.arrow(
                0, 0, ref_x*0.9, ref_y*0.9,
                head_width=0.15, head_length=0.15,
                fc=COLORS['secondary'], ec=COLORS['secondary'],
                linewidth=2 + 3*np.sqrt(fresnel['Rp']),
                alpha=0.5 + 0.4*fresnel['Rp'],
                length_includes_head=True
            )
            self.ax_diagram.text(
                ref_x*0.9 + 0.5, ref_y*0.9 + 0.3,
                f'p-pol\nR={fresnel["Rp"]*100:.1f}%',
                fontsize=FONTS['tiny'],
                color=COLORS['secondary'],
                ha='left'
            )

        # Refracted rays or TIR indicator
        if not fresnel['tir']:
            theta2_rad = np.radians(fresnel['theta2'])
            refr_x = ray_length * np.sin(theta2_rad)
            refr_y = -ray_length * np.cos(theta2_rad)

            if self.show_s and fresnel['Ts'] > 0.01:
                self.ax_diagram.arrow(
                    0, 0, refr_x, refr_y,
                    head_width=0.15, head_length=0.15,
                    fc=COLORS['success'], ec=COLORS['success'],
                    linewidth=2 + 3*np.sqrt(fresnel['Ts']),
                    alpha=0.5 + 0.4*fresnel['Ts'],
                    length_includes_head=True
                )
                self.ax_diagram.text(
                    refr_x + 0.3, refr_y - 0.2,
                    f's-pol\nT={fresnel["Ts"]*100:.1f}%',
                    fontsize=FONTS['tiny'],
                    color=COLORS['success'],
                    ha='left'
                )

            if self.show_p and fresnel['Tp'] > 0.01:
                self.ax_diagram.arrow(
                    0, 0, refr_x*0.9, refr_y*0.9,
                    head_width=0.15, head_length=0.15,
                    fc=COLORS['primary'], ec=COLORS['primary'],
                    linewidth=2 + 3*np.sqrt(fresnel['Tp']),
                    alpha=0.5 + 0.4*fresnel['Tp'],
                    length_includes_head=True
                )
                self.ax_diagram.text(
                    refr_x*0.9 + 0.5, refr_y*0.9 - 0.3,
                    f'p-pol\nT={fresnel["Tp"]*100:.1f}%',
                    fontsize=FONTS['tiny'],
                    color=COLORS['primary'],
                    ha='left'
                )

            self.ax_diagram.text(
                0.5, -1,
                f'Refracted\nθ₂={fresnel["theta2"]:.1f}°',
                fontsize=FONTS['tiny'],
                color=COLORS['success'],
                ha='left'
            )
        else:
            # Total internal reflection warning
            self.ax_diagram.text(
                0, -1,
                'Total Internal\nReflection!',
                fontsize=FONTS['medium'],
                color=COLORS['error'],
                fontweight='bold',
                ha='center',
                bbox=dict(boxstyle='round,pad=0.5',
                         facecolor=COLORS['warning'],
                         alpha=0.3)
            )

        # Angle arc for incident ray
        arc_radius = 0.5
        arc1 = Wedge(
            (0, 0), arc_radius, 90-self.theta1, 90,
            facecolor=COLORS['secondary'],
            alpha=0.3,
            edgecolor=COLORS['secondary']
        )
        self.ax_diagram.add_patch(arc1)

    def _update_curves(self):
        """Update Fresnel coefficient curves."""
        self.ax_curves.clear()
        self._setup_axes()

        # Calculate curves
        angles = np.linspace(0, 89.5, 300)
        Rs_curve = []
        Rp_curve = []
        Ts_curve = []
        Tp_curve = []

        for angle in angles:
            fresnel = fresnel_coefficients(angle, self.n1, self.n2)
            Rs_curve.append(fresnel['Rs'] * 100)
            Rp_curve.append(fresnel['Rp'] * 100)
            Ts_curve.append(fresnel['Ts'] * 100)
            Tp_curve.append(fresnel['Tp'] * 100)

        # Plot curves with enhanced styling
        if self.show_s:
            self.ax_curves.plot(
                angles, Rs_curve,
                color=COLORS['error'],
                linewidth=2.5,
                label='Reflectance R_s',
                alpha=0.9
            )
            self.ax_curves.plot(
                angles, Ts_curve,
                color=COLORS['success'],
                linewidth=2.5,
                label='Transmittance T_s',
                alpha=0.9
            )

        if self.show_p:
            self.ax_curves.plot(
                angles, Rp_curve,
                color=COLORS['secondary'],
                linewidth=2.5,
                linestyle='--',
                label='Reflectance R_p',
                alpha=0.9
            )
            self.ax_curves.plot(
                angles, Tp_curve,
                color=COLORS['primary'],
                linewidth=2.5,
                linestyle='--',
                label='Transmittance T_p',
                alpha=0.9
            )

        # Mark current angle
        fresnel_current = fresnel_coefficients(self.theta1, self.n1, self.n2)

        if self.show_s:
            self.ax_curves.plot(
                self.theta1, fresnel_current['Rs']*100, 'o',
                markersize=10,
                markerfacecolor=COLORS['error'],
                markeredgecolor=COLORS['text_primary'],
                markeredgewidth=2
            )
            self.ax_curves.plot(
                self.theta1, fresnel_current['Ts']*100, 'o',
                markersize=10,
                markerfacecolor=COLORS['success'],
                markeredgecolor=COLORS['text_primary'],
                markeredgewidth=2
            )

        if self.show_p:
            self.ax_curves.plot(
                self.theta1, fresnel_current['Rp']*100, 'o',
                markersize=10,
                markerfacecolor=COLORS['secondary'],
                markeredgecolor=COLORS['text_primary'],
                markeredgewidth=2
            )
            self.ax_curves.plot(
                self.theta1, fresnel_current['Tp']*100, 'o',
                markersize=10,
                markerfacecolor=COLORS['primary'],
                markeredgecolor=COLORS['text_primary'],
                markeredgewidth=2
            )

        # Mark current angle with vertical line
        self.ax_curves.axvline(
            self.theta1,
            color=COLORS['text_secondary'],
            linestyle=':',
            linewidth=1.5,
            alpha=0.6
        )

        # Shade current angle region
        self.ax_curves.axvspan(
            max(0, self.theta1 - 2),
            min(90, self.theta1 + 2),
            color=COLORS['primary'],
            alpha=0.1
        )

        # Mark Brewster's angle
        theta_b = brewster_angle(self.n1, self.n2)
        self.ax_curves.axvline(
            theta_b,
            color=COLORS['warning'],
            linestyle=':',
            linewidth=2,
            alpha=0.7
        )
        self.ax_curves.text(
            theta_b, 100,
            f'Brewster\nθ_B={theta_b:.1f}°',
            ha='center', va='bottom',
            fontsize=FONTS['tiny'],
            color=COLORS['warning'],
            bbox=dict(boxstyle='round,pad=0.3',
                     facecolor=COLORS['surface'],
                     edgecolor=COLORS['warning'],
                     alpha=0.8)
        )

        # Mark critical angle if exists
        theta_c = critical_angle(self.n1, self.n2)
        if theta_c is not None:
            self.ax_curves.axvline(
                theta_c,
                color=COLORS['error'],
                linestyle=':',
                linewidth=2,
                alpha=0.7
            )
            self.ax_curves.text(
                theta_c, 100,
                f'Critical\nθ_c={theta_c:.1f}°',
                ha='center', va='bottom',
                fontsize=FONTS['tiny'],
                color=COLORS['error'],
                bbox=dict(boxstyle='round,pad=0.3',
                         facecolor=COLORS['surface'],
                         edgecolor=COLORS['error'],
                         alpha=0.8)
            )

        # Enhanced legend
        self.ax_curves.legend(
            loc='upper left',
            fontsize=FONTS['small'],
            framealpha=0.9,
            edgecolor=COLORS['grid'],
            facecolor=COLORS['surface']
        )

    def _update_plot(self):
        """Update all plot elements."""
        self._draw_interface_diagram()
        self._update_curves()
        self.fig.canvas.draw_idle()

    def _on_slider_changed(self, val):
        """Callback for slider changes."""
        self.theta1 = self.slider_angle.val
        self.n2 = self.slider_n2.val
        self._update_plot()

    def _on_checkbox_changed(self, label):
        """Callback for checkbox changes."""
        status = self.check_polarization.get_status()
        self.show_s = status[0]
        self.show_p = status[1]
        self._update_plot()

    def show(self):
        """Display the interactive demonstration."""
        plt.show()


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    demo = FresnelDemoOptimized()
    demo.show()


# ============================================================================
# LEARNING EXERCISES
# ============================================================================
"""
Try these experiments 尝试这些实验:

1. Brewster's Angle Discovery 布儒斯特角探索:
   - Set n₂ = 1.5 (glass)
   - Move angle slider to θ_B ≈ 56.3°
   - Observe: R_p becomes ZERO! (No p-polarized reflection)
   - This is why polarizing sunglasses work!

2. Total Internal Reflection 全内反射:
   - Set n₂ < n₁ (requires modifying code to allow n₁ > 1)
   - Increase angle beyond critical angle θ_c
   - Observe: All light reflects, no transmission!
   - Fiber optics principle

3. Polarization Dependence 偏振依赖性:
   - Toggle s/p checkboxes
   - Notice: s and p have DIFFERENT reflection curves
   - At Brewster angle: R_p = 0 but R_s ≠ 0

4. Energy Conservation 能量守恒:
   - At any angle: R + T = 100%
   - Check both s and p polarizations
   - This fundamental law always holds!

5. Material Exploration 材料探索:
   - Try different n₂ values:
     * Water (1.333): θ_B ≈ 53.1°
     * Glass (1.5): θ_B ≈ 56.3°
     * Diamond (2.417): θ_B ≈ 67.5°
   - Higher n₂ → larger Brewster angle

OPTIMIZATION HIGHLIGHTS 优化亮点:
──────────────────────────────────
✓ Unified PolarCraft color scheme
✓ Enhanced dual sliders with material markers
✓ Real-time Brewster and critical angle annotations
✓ Smooth curve rendering (300 points)
✓ Energy conservation always verified
✓ Information panel with complete equations
✓ Improved checkbox styling
✓ Responsive layout with proper spacing

Further Reading:
    - Hecht, "Optics" Chapter 4: Reflection and Transmission
    - Born & Wolf, "Principles of Optics" Chapter 1
    - Applications: Anti-reflection coatings, fiber optics, polarizers
"""
