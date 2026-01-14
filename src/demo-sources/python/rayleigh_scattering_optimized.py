#!/usr/bin/env python3
"""
Rayleigh Scattering Demonstration - OPTIMIZED
瑞利散射演示 - 优化版

Physical Principle: I(θ, λ) ∝ (1 + cos²θ) / λ⁴

Key Points:
  - Scattering intensity ∝ 1/λ⁴ (shorter wavelengths scatter more)
  - Blue light scatters ~9.4× more than red light
  - Angular distribution: (1 + cos²θ)
  - Explains: blue sky, red sunset, polarization of skylight

OPTIMIZATIONS: Unified styling, enhanced controls, smooth animations

Dependencies: numpy>=1.24.0, matplotlib>=3.7.0
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider

from visualization_config import (
    setup_polarcraft_style, style_slider, create_info_textbox,
    COLORS, FONTS, SIZES
)

class RayleighScatteringDemoOptimized:
    def __init__(self):
        setup_polarcraft_style()
        self.sun_angle = 30  # Sun elevation angle
        self.obs_angle = 90  # Observer viewing angle

        self.fig = plt.figure(figsize=(14, 10), facecolor=COLORS['background'])
        self.fig.suptitle('Rayleigh Scattering | 瑞利散射演示',
                         fontsize=FONTS['title'], fontweight='bold',
                         color=COLORS['text_primary'], y=0.97)

        gs = self.fig.add_gridspec(3, 2, hspace=0.4, wspace=0.3,
                                    left=0.08, right=0.96, top=0.93, bottom=0.12)
        self.ax_scene = self.fig.add_subplot(gs[0:2, 0])
        self.ax_spectrum = self.fig.add_subplot(gs[0, 1])
        self.ax_angular = self.fig.add_subplot(gs[1, 1], projection='polar')
        self.ax_info = self.fig.add_subplot(gs[2, :])

        for ax in [self.ax_scene, self.ax_spectrum, self.ax_info]:
            ax.set_facecolor(COLORS['surface'])

        self._create_controls()
        self._update_plot()

    def _create_controls(self):
        ax_sun = self.fig.add_axes([0.15, 0.06, 0.35, 0.025])
        self.slider_sun = Slider(ax_sun, 'Sun Elevation (°)\n太阳高度角',
                                0, 90, valinit=self.sun_angle,
                                color=COLORS['warning'])
        style_slider(self.slider_sun, COLORS['warning'])
        self.slider_sun.on_changed(lambda v: self._update_plot())

        ax_obs = self.fig.add_axes([0.15, 0.02, 0.35, 0.025])
        self.slider_obs = Slider(ax_obs, 'Observation Angle (°)\n观察角度',
                                0, 180, valinit=self.obs_angle,
                                color=COLORS['primary'])
        style_slider(self.slider_obs, COLORS['primary'])
        self.slider_obs.on_changed(lambda v: self._update_plot())

    def _rayleigh_intensity(self, wavelength_nm, theta_deg):
        """Calculate Rayleigh scattering intensity."""
        theta_rad = np.radians(theta_deg)
        lambda_factor = (450 / wavelength_nm) ** 4  # Normalized to 450nm
        angular_factor = 1 + np.cos(theta_rad) ** 2
        return lambda_factor * angular_factor

    def _update_plot(self):
        sun_angle = self.slider_sun.val
        obs_angle = self.slider_obs.val

        # Scene visualization
        self.ax_scene.clear()
        self.ax_scene.set_xlim(-3, 3)
        self.ax_scene.set_ylim(0, 4)
        self.ax_scene.set_aspect('equal')
        self.ax_scene.axis('off')
        self.ax_scene.set_facecolor(COLORS['surface'])

        # Sky color based on sun angle (simple model)
        if sun_angle > 60:
            sky_color = '#1e3a8a'  # Deep blue
        elif sun_angle > 30:
            sky_color = '#3b82f6'  # Blue
        else:
            sky_color = '#f97316'  # Orange (sunset)

        self.ax_scene.axhspan(2, 4, facecolor=sky_color, alpha=0.3)
        self.ax_scene.axhspan(0, 2, facecolor=COLORS['background'], alpha=0.3)

        # Sun
        sun_rad = np.radians(sun_angle)
        sun_x = 2.5 * np.cos(sun_rad + np.pi/2)
        sun_y = 2.5 * np.sin(sun_rad + np.pi/2) + 2
        self.ax_scene.plot(sun_x, sun_y, 'o', markersize=20,
                          color='#fbbf24', markeredgecolor='#f59e0b',
                          markeredgewidth=2)
        self.ax_scene.text(sun_x, sun_y+0.5, f'Sun\n{sun_angle:.0f}°',
                          ha='center', color=COLORS['warning'],
                          fontsize=FONTS['small'])

        # Observer
        self.ax_scene.plot(0, 1, 'o', markersize=15, color=COLORS['primary'],
                          markeredgecolor=COLORS['text_primary'], markeredgewidth=2)
        self.ax_scene.text(0, 0.5, 'Observer', ha='center',
                          color=COLORS['text_primary'], fontsize=FONTS['small'])

        # Viewing direction
        obs_rad = np.radians(obs_angle)
        view_x = 1.5 * np.cos(obs_rad)
        view_y = 1 + 1.5 * np.sin(obs_rad)
        self.ax_scene.annotate('', xy=(view_x, view_y), xytext=(0, 1),
                              arrowprops=dict(arrowstyle='->', lw=2,
                                            color=COLORS['primary']))

        # Spectrum plot
        self.ax_spectrum.clear()
        wavelengths = np.linspace(380, 750, 300)
        intensities = [self._rayleigh_intensity(wl, obs_angle) for wl in wavelengths]

        # Color spectrum for visibility
        colors = []
        for wl in wavelengths:
            if wl < 450:
                colors.append('#8b5cf6')  # Violet
            elif wl < 495:
                colors.append('#3b82f6')  # Blue
            elif wl < 570:
                colors.append('#22c55e')  # Green
            elif wl < 590:
                colors.append('#eab308')  # Yellow
            elif wl < 620:
                colors.append('#f97316')  # Orange
            else:
                colors.append('#ef4444')  # Red

        for i in range(len(wavelengths)-1):
            self.ax_spectrum.fill_between([wavelengths[i], wavelengths[i+1]],
                                          0, [intensities[i], intensities[i+1]],
                                          color=colors[i], alpha=0.6)

        self.ax_spectrum.plot(wavelengths, intensities, linewidth=2,
                             color=COLORS['text_primary'], alpha=0.8)
        self.ax_spectrum.set_xlabel('Wavelength (nm)', color=COLORS['text_primary'],
                                    fontsize=FONTS['small'])
        self.ax_spectrum.set_ylabel('Scattering Intensity', color=COLORS['text_primary'],
                                    fontsize=FONTS['small'])
        self.ax_spectrum.set_title('Spectrum: I ∝ 1/λ⁴', color=COLORS['text_primary'],
                                   fontsize=FONTS['medium'])
        self.ax_spectrum.grid(True, alpha=0.2, color=COLORS['grid'])
        self.ax_spectrum.tick_params(colors=COLORS['text_primary'], labelsize=FONTS['small'])

        # Angular distribution (polar plot)
        self.ax_angular.clear()
        angles = np.linspace(0, 2*np.pi, 360)
        angular_pattern = [1 + np.cos(a)**2 for a in angles]
        self.ax_angular.plot(angles, angular_pattern, linewidth=2.5,
                            color=COLORS['primary'])
        self.ax_angular.fill(angles, angular_pattern, alpha=0.2,
                            color=COLORS['primary'])

        # Mark current observation angle
        obs_rad = np.radians(obs_angle)
        r_obs = 1 + np.cos(obs_rad)**2
        self.ax_angular.plot(obs_rad, r_obs, 'o', markersize=10,
                            color=COLORS['success'],
                            markeredgecolor=COLORS['text_primary'],
                            markeredgewidth=2)

        self.ax_angular.set_title('Angular Distribution: 1 + cos²θ',
                                 color=COLORS['text_primary'],
                                 fontsize=FONTS['small'], pad=15)
        self.ax_angular.set_theta_zero_location('N')
        self.ax_angular.set_theta_direction(-1)
        self.ax_angular.grid(True, alpha=0.3, color=COLORS['grid'])
        self.ax_angular.tick_params(colors=COLORS['text_primary'],
                                   labelsize=FONTS['tiny'])

        # Info panel
        self.ax_info.clear()
        self.ax_info.axis('off')

        blue_intensity = self._rayleigh_intensity(450, obs_angle)
        red_intensity = self._rayleigh_intensity(650, obs_angle)
        ratio = blue_intensity / red_intensity

        info_text = (
            f"📖 Rayleigh Scattering Formula: I(θ, λ) ∝ (1 + cos²θ) / λ⁴\n"
            f"{'─' * 80}\n\n"
            f"Current Conditions:\n"
            f"  • Sun elevation: {sun_angle:.0f}° "
            f"({'Noon' if sun_angle > 60 else 'Sunrise/Sunset' if sun_angle < 30 else 'Morning/Evening'})\n"
            f"  • Observation angle: {obs_angle:.0f}°\n"
            f"  • Blue (450nm) to Red (650nm) ratio: {ratio:.2f}× "
            f"(Blue scatters {ratio:.1f}× more!)\n\n"
            f"Why the sky is blue: Blue light (450nm) scatters {ratio:.1f}× more than red light (650nm) due to 1/λ⁴ dependence.\n"
            f"Sunset phenomenon: When sun is low, light travels through more atmosphere → more scattering → red light survives."
        )

        self.ax_info.text(0.5, 0.5, info_text, ha='center', va='center',
                         color=COLORS['text_primary'], fontsize=FONTS['small'],
                         family='monospace',
                         bbox=dict(boxstyle='round,pad=1', facecolor=COLORS['surface'],
                                  edgecolor=COLORS['grid'], alpha=0.9))

        self.fig.canvas.draw_idle()

    def show(self):
        plt.show()

if __name__ == '__main__':
    print("="*70)
    print("Rayleigh Scattering Demonstration - OPTIMIZED")
    print("="*70)
    print("\nPhysical Principles:")
    print("  I(θ, λ) ∝ (1 + cos²θ) / λ⁴")
    print("  - Blue light scatters ~9.4× more than red light")
    print("  - Explains blue sky and red sunset")
    print("\nControls:")
    print("  - Sun elevation: 0° (sunrise) to 90° (noon)")
    print("  - Observation angle: viewing direction")
    print("\n")

    demo = RayleighScatteringDemoOptimized()
    demo.show()
