#!/usr/bin/env python3
"""
Brewster's Angle Demonstration - OPTIMIZED
布儒斯特角演示 - 优化版

Physical Principle 物理原理:
────────────────────────────────────────────────────────────────
Brewster's angle definition:
    tan(θ_B) = n₂/n₁
    θ_B = arctan(n₂/n₁)

At Brewster's angle:
    - p-polarized reflectance: R_p = 0 (no reflection!)
    - s-polarized reflectance: R_s ≠ 0
    - Reflected light is completely s-polarized
    - Reflected and refracted rays are perpendicular: θ_i + θ_t = 90°

Applications 应用:
    - Polarizer manufacturing
    - Laser Brewster windows
    - Anti-glare lenses
    - Photography polarizing filters

OPTIMIZATIONS 优化内容:
────────────────────────────────────────────────────────────────
✨ Unified PolarCraft dark theme styling
✨ Enhanced dual sliders with Brewster angle markers
✨ Real-time visual feedback when near Brewster angle
✨ Improved reflectance curve with clear annotations
✨ Information panel with formulas and results
✨ Professional layout with proper spacing

Dependencies: numpy>=1.24.0, matplotlib>=3.7.0
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from matplotlib.patches import FancyArrowPatch, Wedge, Rectangle

# Import unified styling
from visualization_config import (
    setup_polarcraft_style,
    style_slider,
    create_info_textbox,
    COLORS,
    FONTS,
    SIZES
)

# ============================================================================
# PHYSICS FUNCTIONS (保持不变)
# ============================================================================

def fresnel_coefficients(theta1_deg, n1, n2):
    """Calculate Fresnel reflection coefficients."""
    theta1_rad = np.radians(theta1_deg)
    sin_theta1 = np.sin(theta1_rad)
    cos_theta1 = np.cos(theta1_rad)

    # Snell's law
    sin_theta2 = (n1 / n2) * sin_theta1

    # Total internal reflection check
    if sin_theta2 > 1:
        return {'Rs': 1.0, 'Rp': 1.0, 'theta2': 90, 'tir': True}

    cos_theta2 = np.sqrt(1 - sin_theta2**2)
    theta2_deg = np.degrees(np.arcsin(sin_theta2))

    # Fresnel equations
    rs = (n1*cos_theta1 - n2*cos_theta2) / (n1*cos_theta1 + n2*cos_theta2)
    rp = (n2*cos_theta1 - n1*cos_theta2) / (n2*cos_theta1 + n1*cos_theta2)

    Rs = rs**2
    Rp = rp**2

    return {'Rs': Rs, 'Rp': Rp, 'theta2': theta2_deg, 'tir': False}


# ============================================================================
# OPTIMIZED VISUALIZATION CLASS
# ============================================================================

class BrewsterDemoOptimized:
    """Optimized Brewster's angle demonstration with unified styling."""

    def __init__(self):
        # Apply unified styling
        setup_polarcraft_style()

        # Initialize parameters
        self.n1 = 1.0  # Air
        self.n2 = 1.5  # Glass
        self.theta_deg = 56.3  # Initial angle

        # Calculate Brewster's angle
        self.theta_brewster = np.degrees(np.arctan(self.n2/self.n1))

        # Create figure
        self.fig = plt.figure(figsize=(14, 9), facecolor=COLORS['background'])
        self.fig.suptitle(
            "Brewster's Angle Demonstration | 布儒斯特角演示",
            fontsize=FONTS['title'], fontweight='bold',
            color=COLORS['text_primary'], y=0.97
        )

        # Create layout
        self._create_layout()
        self._create_controls()
        self._update_plot()

        # Instructions
        self.fig.text(
            0.5, 0.01,
            '🎯 Adjust incident angle and refractive index  •  '
            '🔬 Observe R_p = 0 at Brewster angle',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['text_secondary'], style='italic'
        )

    def _create_layout(self):
        """Create subplot layout."""
        gs = self.fig.add_gridspec(4, 2, hspace=0.4, wspace=0.3,
                                    left=0.08, right=0.96, top=0.93, bottom=0.12)

        # Main optical path diagram
        self.ax_main = self.fig.add_subplot(gs[0:3, 0])
        self.ax_main.set_facecolor(COLORS['surface'])

        # Reflectance curve
        self.ax_curve = self.fig.add_subplot(gs[0:2, 1])
        self.ax_curve.set_facecolor(COLORS['surface'])

        # Info panel
        self.ax_info = self.fig.add_subplot(gs[2, 1])
        self.ax_info.set_facecolor(COLORS['surface'])

    def _create_controls(self):
        """Create interactive sliders."""
        # Incident angle slider
        ax_theta = self.fig.add_axes([0.15, 0.06, 0.35, 0.025])
        self.slider_theta = Slider(
            ax_theta,
            'Incident Angle θ\n入射角度',
            0, 90,
            valinit=self.theta_deg,
            valstep=0.5,
            color=COLORS['primary']
        )
        style_slider(self.slider_theta, COLORS['primary'])
        self.slider_theta.on_changed(self._on_theta_changed)

        # Add angle markers
        for angle in [0, 30, 45, 60, 90]:
            if angle <= 90:
                ax_theta.axvline(angle, color=COLORS['grid'], alpha=0.3, linewidth=0.5)

        # Refractive index slider
        ax_n2 = self.fig.add_axes([0.15, 0.02, 0.35, 0.025])
        self.slider_n2 = Slider(
            ax_n2,
            'Refractive Index n₂\n折射率',
            1.0, 2.5,
            valinit=self.n2,
            valstep=0.1,
            color=COLORS['secondary']
        )
        style_slider(self.slider_n2, COLORS['secondary'])
        self.slider_n2.on_changed(self._on_n2_changed)

        # Add material markers
        materials = [(1.0, 'Air'), (1.333, 'Water'), (1.5, 'Glass'), (2.417, 'Diamond')]
        for n, name in materials:
            ax_n2.axvline(n, color=COLORS['grid'], alpha=0.3, linewidth=0.5)
            ax_n2.text(
                n, -0.5, name,
                ha='center', va='top',
                fontsize=FONTS['tiny'],
                color=COLORS['text_secondary']
            )

    def _update_plot(self):
        """Update all visualizations."""
        self._draw_optical_path()
        self._draw_reflectance_curve()
        self._draw_info_panel()
        self.fig.canvas.draw_idle()

    def _draw_optical_path(self):
        """Draw optical path diagram."""
        self.ax_main.clear()
        self.ax_main.set_xlim(-3, 3)
        self.ax_main.set_ylim(-2, 3)
        self.ax_main.set_aspect('equal')
        self.ax_main.axis('off')
        self.ax_main.set_facecolor(COLORS['surface'])
        self.ax_main.set_title(
            'Optical Path | 光路图',
            fontsize=FONTS['medium'], fontweight='bold',
            color=COLORS['text_primary']
        )

        # Interface line
        self.ax_main.axhline(0, color=COLORS['primary'], linewidth=3, linestyle='--', alpha=0.7)

        # Medium labels
        self.ax_main.text(
            2.5, 0.5, f'Air\nn₁={self.n1:.1f}',
            color=COLORS['text_primary'], fontsize=FONTS['small'],
            bbox=dict(boxstyle='round,pad=0.3', facecolor=COLORS['surface'],
                     edgecolor=COLORS['primary'], alpha=0.8)
        )
        self.ax_main.text(
            2.5, -0.5, f'Glass\nn₂={self.n2:.1f}',
            color=COLORS['text_primary'], fontsize=FONTS['small'],
            bbox=dict(boxstyle='round,pad=0.3', facecolor=COLORS['surface'],
                     edgecolor=COLORS['warning'], alpha=0.8)
        )

        # Shade regions
        self.ax_main.fill_between([-3, 3], 0, 3, alpha=0.05, color=COLORS['primary'])
        self.ax_main.fill_between([-3, 3], -2, 0, alpha=0.05, color=COLORS['warning'])

        # Normal line
        self.ax_main.plot(
            [0, 0], [-2, 3], ':',
            color=COLORS['text_secondary'],
            linewidth=1.5, alpha=0.5
        )
        self.ax_main.text(
            0.1, 2.7, 'Normal',
            color=COLORS['text_secondary'],
            fontsize=FONTS['tiny']
        )

        # Calculate physics
        result = fresnel_coefficients(self.theta_deg, self.n1, self.n2)
        theta1_rad = np.radians(self.theta_deg)
        theta2_rad = np.radians(result['theta2'])

        # Incident ray
        x_inc = -2 * np.sin(theta1_rad)
        y_inc = 2 * np.cos(theta1_rad)
        arrow_inc = FancyArrowPatch(
            (x_inc, y_inc), (0, 0),
            arrowstyle='->',
            mutation_scale=20,
            linewidth=3,
            color=COLORS['warning']
        )
        self.ax_main.add_patch(arrow_inc)
        self.ax_main.text(
            x_inc-0.4, y_inc+0.3,
            f'Incident\n{self.theta_deg:.1f}°',
            color=COLORS['warning'],
            fontsize=FONTS['tiny'],
            ha='right'
        )

        # Angle arc for incident ray
        arc_radius = 0.7
        arc = Wedge(
            (0, 0), arc_radius, 90-self.theta_deg, 90,
            facecolor=COLORS['warning'],
            alpha=0.2,
            edgecolor=COLORS['warning']
        )
        self.ax_main.add_patch(arc)

        # Reflected ray (s-polarized)
        x_ref = 2 * np.sin(theta1_rad)
        y_ref = 2 * np.cos(theta1_rad)
        intensity_s = result['Rs']

        # Enhanced visual feedback when near Brewster angle
        at_brewster = abs(self.theta_deg - self.theta_brewster) < 2

        arrow_ref = FancyArrowPatch(
            (0, 0), (x_ref, y_ref),
            arrowstyle='->',
            mutation_scale=20,
            linewidth=2 + intensity_s*3,
            color=COLORS['error'],
            alpha=0.5 + intensity_s*0.5
        )
        self.ax_main.add_patch(arrow_ref)
        self.ax_main.text(
            x_ref+0.3, y_ref,
            f'Reflected (s-pol)\nR_s={intensity_s:.3f}',
            color=COLORS['error'],
            fontsize=FONTS['tiny'],
            ha='left',
            bbox=dict(boxstyle='round,pad=0.3', facecolor=COLORS['background'],
                     edgecolor=COLORS['error'], alpha=0.8)
        )

        # Refracted ray
        if not result['tir']:
            x_refr = 2 * np.sin(theta2_rad)
            y_refr = -2 * np.cos(theta2_rad)
            arrow_refr = FancyArrowPatch(
                (0, 0), (x_refr, y_refr),
                arrowstyle='->',
                mutation_scale=20,
                linewidth=3,
                color=COLORS['primary']
            )
            self.ax_main.add_patch(arrow_refr)
            self.ax_main.text(
                x_refr+0.3, y_refr,
                f'Refracted\n{result["theta2"]:.1f}°',
                color=COLORS['primary'],
                fontsize=FONTS['tiny'],
                ha='left'
            )

            # Perpendicularity indicator at Brewster angle
            if at_brewster:
                # Draw perpendicular indicator
                perp_size = 0.3
                mid_x = (x_ref + x_refr) / 4
                mid_y = (y_ref + y_refr) / 4
                square = Rectangle(
                    (mid_x - perp_size/2, mid_y - perp_size/2),
                    perp_size, perp_size,
                    facecolor='none',
                    edgecolor=COLORS['success'],
                    linewidth=2
                )
                self.ax_main.add_patch(square)

        # Brewster angle indicator
        if at_brewster:
            wedge = Wedge(
                (0, 0), 1.5, 90-self.theta_brewster, 90,
                facecolor=COLORS['success'],
                alpha=0.2,
                edgecolor=COLORS['success'],
                linewidth=2
            )
            self.ax_main.add_patch(wedge)
            self.ax_main.text(
                -0.8, 1.5,
                "Brewster's\nAngle!",
                color=COLORS['success'],
                fontsize=FONTS['medium'],
                fontweight='bold',
                ha='center',
                bbox=dict(boxstyle='round,pad=0.5',
                         facecolor=COLORS['background'],
                         edgecolor=COLORS['success'],
                         alpha=0.9)
            )

    def _draw_reflectance_curve(self):
        """Draw reflectance vs angle curve."""
        self.ax_curve.clear()
        self.ax_curve.set_facecolor(COLORS['surface'])
        self.ax_curve.set_title(
            'Reflectance vs Angle\n反射率曲线',
            fontsize=FONTS['medium'], fontweight='bold',
            color=COLORS['text_primary']
        )

        # Calculate curves
        angles = np.linspace(0, 90, 300)
        Rs_vals = []
        Rp_vals = []

        for angle in angles:
            res = fresnel_coefficients(angle, self.n1, self.n2)
            Rs_vals.append(res['Rs'])
            Rp_vals.append(res['Rp'])

        # Plot curves
        self.ax_curve.plot(
            angles, Rs_vals, '-',
            color=COLORS['error'],
            linewidth=2.5,
            label='R_s (s-polarization)',
            alpha=0.9
        )
        self.ax_curve.plot(
            angles, Rp_vals, '-',
            color=COLORS['primary'],
            linewidth=2.5,
            label='R_p (p-polarization)',
            alpha=0.9
        )

        # Mark current angle
        result = fresnel_coefficients(self.theta_deg, self.n1, self.n2)
        self.ax_curve.plot(
            self.theta_deg, result['Rs'], 'o',
            color=COLORS['error'],
            markersize=10,
            markeredgecolor=COLORS['text_primary'],
            markeredgewidth=2
        )
        self.ax_curve.plot(
            self.theta_deg, result['Rp'], 'o',
            color=COLORS['primary'],
            markersize=10,
            markeredgecolor=COLORS['text_primary'],
            markeredgewidth=2
        )

        # Vertical line at current angle
        self.ax_curve.axvline(
            self.theta_deg,
            color=COLORS['text_secondary'],
            linestyle=':',
            linewidth=1.5,
            alpha=0.6
        )

        # Shade current angle region
        self.ax_curve.axvspan(
            max(0, self.theta_deg - 2),
            min(90, self.theta_deg + 2),
            color=COLORS['primary'],
            alpha=0.1
        )

        # Brewster angle marker
        self.ax_curve.axvline(
            self.theta_brewster,
            color=COLORS['success'],
            linestyle='--',
            linewidth=2.5,
            alpha=0.8
        )
        self.ax_curve.text(
            self.theta_brewster, 0.95,
            f"Brewster's Angle\nθ_B={self.theta_brewster:.1f}°",
            ha='center', va='top',
            color=COLORS['success'],
            fontsize=FONTS['tiny'],
            fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3',
                     facecolor=COLORS['background'],
                     edgecolor=COLORS['success'],
                     alpha=0.9)
        )

        # Axes labels and styling
        self.ax_curve.set_xlabel(
            'Incident Angle (°)',
            color=COLORS['text_primary'],
            fontsize=FONTS['small']
        )
        self.ax_curve.set_ylabel(
            'Reflectance',
            color=COLORS['text_primary'],
            fontsize=FONTS['small']
        )
        self.ax_curve.set_xlim(0, 90)
        self.ax_curve.set_ylim(0, 1)
        self.ax_curve.legend(
            loc='upper left',
            fontsize=FONTS['small'],
            framealpha=0.9,
            facecolor=COLORS['surface'],
            edgecolor=COLORS['grid']
        )
        self.ax_curve.grid(True, alpha=0.2, color=COLORS['grid'], linestyle='--')
        self.ax_curve.tick_params(
            colors=COLORS['text_primary'],
            labelsize=FONTS['small']
        )
        for spine in self.ax_curve.spines.values():
            spine.set_color(COLORS['grid'])

    def _draw_info_panel(self):
        """Draw information panel."""
        self.ax_info.clear()
        self.ax_info.axis('off')
        self.ax_info.set_facecolor(COLORS['surface'])

        result = fresnel_coefficients(self.theta_deg, self.n1, self.n2)

        info_text = (
            f"📖 Brewster's Angle Formula\n"
            f"{'─' * 35}\n"
            f"θ_B = arctan(n₂/n₁) = {self.theta_brewster:.2f}°\n\n"
            f"Current Settings:\n"
            f"  Incident angle: {self.theta_deg:.1f}°\n"
            f"  Refractive indices: n₁={self.n1:.1f}, n₂={self.n2:.1f}\n\n"
            f"Reflectance:\n"
            f"  R_s = {result['Rs']:.4f}\n"
            f"  R_p = {result['Rp']:.4f}\n\n"
            f"Key Features:\n"
            f"  • At Brewster angle: R_p = 0\n"
            f"  • Reflected light is 100% s-polarized\n"
            f"  • Reflected ⊥ refracted rays\n"
            f"  • Applications: polarizers, laser windows"
        )

        create_info_textbox(
            self.ax_info,
            info_text,
            (0.05, 0.95),
            fontsize=FONTS['tiny']
        )

    def _on_theta_changed(self, val):
        """Callback for angle slider."""
        self.theta_deg = val
        self._update_plot()

    def _on_n2_changed(self, val):
        """Callback for refractive index slider."""
        self.n2 = val
        self.theta_brewster = np.degrees(np.arctan(self.n2/self.n1))
        self._update_plot()

    def show(self):
        """Display the interactive demonstration."""
        plt.show()


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    print("=" * 70)
    print("Brewster's Angle Demonstration | 布儒斯特角演示 - OPTIMIZED")
    print("=" * 70)
    print("\nPhysical Principles:")
    print("  θ_B = arctan(n₂/n₁)")
    print("  At Brewster's angle: R_p = 0, reflected light is 100% s-polarized")
    print("\nControls:")
    print("  - Angle slider: Adjust incident angle")
    print("  - n₂ slider: Change refractive index")
    print("  - Observe R_p → 0 at Brewster angle")
    print("\n")

    demo = BrewsterDemoOptimized()
    demo.show()


# ============================================================================
# LEARNING EXERCISES
# ============================================================================
"""
Try these experiments 尝试这些实验:

1. Finding Brewster's Angle:
   - Set n₂ = 1.5 (glass)
   - Slowly increase angle slider
   - Watch R_p curve approach zero
   - At θ_B ≈ 56.3°: R_p = 0 exactly!

2. Material Dependence:
   - Try different materials:
     * Water (n₂=1.333): θ_B ≈ 53.1°
     * Glass (n₂=1.5): θ_B ≈ 56.3°
     * Diamond (n₂=2.417): θ_B ≈ 67.5°
   - Higher refractive index → larger Brewster angle

3. Perpendicularity at Brewster Angle:
   - Set angle to Brewster angle
   - Observe: reflected and refracted rays are perpendicular!
   - This is the geometric condition: θ_i + θ_t = 90°

4. Complete Polarization:
   - At Brewster angle: R_s ≠ 0 but R_p = 0
   - Result: reflected light is 100% s-polarized
   - This is how natural polarizers work!

5. Laser Window Design:
   - Lasers use Brewster windows to minimize reflection loss
   - Set angle = Brewster angle
   - p-polarized laser beam passes with R_p = 0

OPTIMIZATION HIGHLIGHTS 优化亮点:
──────────────────────────────────
✓ Unified PolarCraft color scheme
✓ Enhanced dual sliders with material markers
✓ Real-time Brewster angle detection
✓ Perpendicularity indicator at Brewster angle
✓ Smooth reflectance curves (300 points)
✓ Information panel with complete formulas
✓ Professional layout with proper spacing

Further Reading:
    - Hecht, "Optics" Chapter 4: Reflection and Transmission
    - Born & Wolf, "Principles of Optics" Chapter 1
    - Applications: Sunglasses, laser optics, photography
"""
