"""
Mie Scattering Interactive Demo - PolarCraft
米氏散射交互演示 - PolarCraft

Demonstrates Mie scattering for particles comparable to wavelength size.
演示波长量级粒子的米氏散射现象。

Key Concepts 核心概念:
- Mie scattering: particle size ~ wavelength (水滴、气溶胶)
- Size parameter: x = 2πr/λ (r: particle radius, λ: wavelength)
- Strong forward scattering for large particles (大粒子前向散射强)
- Less wavelength-dependent than Rayleigh (波长依赖性比瑞利散射弱)
- Explains white clouds vs. blue sky (解释白云与蓝天)

Physical Applications 物理应用:
- Cloud appearance (白云)
- Fog and mist (雾气)
- Aerosol scattering (气溶胶散射)
- Water droplet optics (水滴光学)
- Atmospheric visibility (大气能见度)

Author: PolarCraft Team
License: MIT
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button, RadioButtons
from matplotlib.patches import Circle, FancyArrowPatch
from matplotlib import colormaps

# Import PolarCraft unified styling
from visualization_config import (
    setup_polarcraft_style,
    style_slider,
    COLORS,
    FONTS,
    SIZES
)


class MieScatteringDemo:
    """
    Interactive Mie Scattering Demonstration
    交互式米氏散射演示

    Features:
    - Particle size control (relative to wavelength)
    - Scattering phase function visualization
    - Angular intensity distribution
    - Comparison with Rayleigh scattering
    - Wavelength dependence
    """

    def __init__(self):
        """Initialize the Mie scattering demonstration"""
        # Apply PolarCraft unified theme
        setup_polarcraft_style()

        # Physical parameters
        self.wavelength = 550  # nm (green light)
        self.particle_radius = 550  # nm (comparable to wavelength)
        self.n_particle = 1.33  # Refractive index (water)
        self.n_medium = 1.0  # Refractive index (air)

        # Scattering angles (0° to 180°)
        self.angles = np.linspace(0, 180, 361)
        self.angles_rad = np.deg2rad(self.angles)

        # Setup figure
        self.setup_figure()
        self.update_plot()

    def setup_figure(self):
        """Setup matplotlib figure with 4 panels + controls"""
        self.fig = plt.figure(figsize=(16, 10))
        self.fig.patch.set_facecolor(COLORS['background'])

        # Main title
        self.fig.suptitle(
            'Mie Scattering - Particle Size Effects | 米氏散射 - 粒子尺寸效应',
            fontsize=FONTS['title']['size'],
            fontweight='bold',
            color=COLORS['text_primary'],
            y=0.98
        )

        # Create axes
        # Top row: Scattering diagram and polar plot
        self.ax_diagram = plt.subplot(2, 3, 1)
        self.ax_polar = plt.subplot(2, 3, 2, projection='polar')
        self.ax_intensity = plt.subplot(2, 3, 3)

        # Bottom row: Wavelength dependence, size parameter effect, info
        self.ax_wavelength = plt.subplot(2, 3, 4)
        self.ax_size_param = plt.subplot(2, 3, 5)
        self.ax_info = plt.subplot(2, 3, 6)
        self.ax_info.axis('off')

        # Style all axes
        for ax in [self.ax_diagram, self.ax_intensity, self.ax_wavelength, self.ax_size_param]:
            ax.set_facecolor(COLORS['surface'])
            ax.spines['top'].set_color(COLORS['text_secondary'])
            ax.spines['bottom'].set_color(COLORS['text_secondary'])
            ax.spines['left'].set_color(COLORS['text_secondary'])
            ax.spines['right'].set_color(COLORS['text_secondary'])
            ax.tick_params(colors=COLORS['text_secondary'])

        self.ax_polar.set_facecolor(COLORS['surface'])

        # Control panel (bottom)
        plt.subplots_adjust(bottom=0.25, hspace=0.35, wspace=0.3)

        # Particle radius slider
        ax_radius = plt.axes([0.15, 0.14, 0.3, 0.02], facecolor=COLORS['surface'])
        self.slider_radius = Slider(
            ax_radius, 'Particle Radius (nm)',
            50, 2000, valinit=self.particle_radius,
            valstep=10,
            color=COLORS['primary']
        )
        style_slider(self.slider_radius, COLORS['primary'])
        self.slider_radius.on_changed(self.update_radius)

        # Wavelength slider
        ax_wavelength = plt.axes([0.15, 0.10, 0.3, 0.02], facecolor=COLORS['surface'])
        self.slider_wavelength = Slider(
            ax_wavelength, 'Wavelength (nm)',
            400, 700, valinit=self.wavelength,
            valstep=5,
            color=COLORS['warning']
        )
        style_slider(self.slider_wavelength, COLORS['warning'])
        self.slider_wavelength.on_changed(self.update_wavelength)

        # Refractive index slider
        ax_n = plt.axes([0.15, 0.06, 0.3, 0.02], facecolor=COLORS['surface'])
        self.slider_n = Slider(
            ax_n, 'Refractive Index',
            1.1, 2.0, valinit=self.n_particle,
            valstep=0.01,
            color=COLORS['secondary']
        )
        style_slider(self.slider_n, COLORS['secondary'])
        self.slider_n.on_changed(self.update_n)

        # Reset button
        ax_reset = plt.axes([0.55, 0.10, 0.08, 0.04])
        self.btn_reset = Button(
            ax_reset, 'Reset',
            color=COLORS['surface'],
            hovercolor=COLORS['primary']
        )
        self.btn_reset.label.set_color(COLORS['text_primary'])
        self.btn_reset.on_clicked(self.reset)

        # Comparison mode radio buttons
        ax_mode = plt.axes([0.55, 0.02, 0.15, 0.06], facecolor=COLORS['surface'])
        self.radio_mode = RadioButtons(
            ax_mode,
            ('Mie Only', 'Mie + Rayleigh', 'Size Comparison'),
            active=0
        )
        for label in self.radio_mode.labels:
            label.set_color(COLORS['text_primary'])
            label.set_fontsize(FONTS['label']['size'])
        self.radio_mode.on_clicked(self.update_mode)

        # Export button
        ax_export = plt.axes([0.75, 0.10, 0.1, 0.04])
        self.btn_export = Button(
            ax_export, 'Export Data',
            color=COLORS['success'],
            hovercolor=COLORS['primary']
        )
        self.btn_export.label.set_color(COLORS['text_primary'])
        self.btn_export.on_clicked(self.export_data)

    def calculate_size_parameter(self):
        """
        Calculate Mie size parameter
        计算米氏尺寸参数

        x = 2πr/λ
        where r is particle radius, λ is wavelength
        """
        return (2 * np.pi * self.particle_radius) / self.wavelength

    def mie_phase_function_approx(self, theta, x):
        """
        Approximate Mie scattering phase function
        近似米氏散射相函数

        Uses simplified model based on size parameter x and scattering angle θ.
        For full Mie theory, see pymiecoated or miepython libraries.

        Parameters:
            theta: Scattering angle (radians)
            x: Size parameter (2πr/λ)

        Returns:
            Normalized intensity
        """
        # Henyey-Greenstein approximation with size-dependent asymmetry parameter
        # g approaches 1 for large particles (strong forward scattering)
        g = 1 - 2/(x + 2)  # Asymmetry parameter (0 = isotropic, 1 = forward)

        cos_theta = np.cos(theta)

        # Henyey-Greenstein phase function
        numerator = 1 - g**2
        denominator = (1 + g**2 - 2*g*cos_theta)**(3/2)

        P_HG = numerator / denominator

        # Add oscillations for intermediate sizes (Mie ripples)
        if 1 < x < 50:
            ripple = 1 + 0.3 * np.cos(x * theta) * np.exp(-theta/np.pi)
            P_HG *= ripple

        return P_HG

    def rayleigh_phase_function(self, theta):
        """
        Rayleigh scattering phase function
        瑞利散射相函数

        P(θ) ∝ (1 + cos²θ)
        """
        return 1 + np.cos(theta)**2

    def wavelength_to_rgb(self, wavelength):
        """Convert wavelength (nm) to approximate RGB color"""
        if wavelength < 380:
            return (0.5, 0, 0.5)
        elif wavelength < 440:
            t = (wavelength - 380) / (440 - 380)
            return (0.5 * (1 - t), 0, 1)
        elif wavelength < 490:
            t = (wavelength - 440) / (490 - 440)
            return (0, t, 1)
        elif wavelength < 510:
            t = (wavelength - 490) / (510 - 490)
            return (0, 1, 1 - 0.5 * t)
        elif wavelength < 580:
            t = (wavelength - 510) / (580 - 510)
            return (t, 1, 0)
        elif wavelength < 645:
            t = (wavelength - 580) / (645 - 580)
            return (1, 1 - t, 0)
        elif wavelength <= 700:
            t = (wavelength - 645) / (700 - 645)
            return (1, 0, 0)
        else:
            return (0.5, 0, 0)

    def update_plot(self):
        """Update all plot panels"""
        # Calculate size parameter
        x = self.calculate_size_parameter()

        # Calculate Mie scattering intensity
        I_mie = self.mie_phase_function_approx(self.angles_rad, x)
        I_mie_norm = I_mie / np.max(I_mie)

        # Calculate Rayleigh scattering for comparison
        I_rayleigh = self.rayleigh_phase_function(self.angles_rad)
        I_rayleigh_norm = I_rayleigh / np.max(I_rayleigh)

        # Get color for current wavelength
        color_wave = self.wavelength_to_rgb(self.wavelength)

        # --- Panel 1: Scattering Diagram ---
        self.ax_diagram.clear()
        self.ax_diagram.set_xlim(-1.5, 1.5)
        self.ax_diagram.set_ylim(-1.5, 1.5)
        self.ax_diagram.set_aspect('equal')
        self.ax_diagram.set_title(
            'Scattering Geometry | 散射几何',
            fontsize=FONTS['subtitle']['size'],
            color=COLORS['text_primary'],
            pad=10
        )

        # Draw particle
        particle_size = 0.3 if x < 5 else 0.5
        particle = Circle((0, 0), particle_size,
                         color=color_wave, alpha=0.6, linewidth=2,
                         edgecolor=COLORS['text_primary'])
        self.ax_diagram.add_patch(particle)

        # Incident light arrow
        arrow = FancyArrowPatch(
            (-1.2, 0), (-particle_size-0.1, 0),
            arrowstyle='->', mutation_scale=30,
            linewidth=3, color=color_wave, alpha=0.8
        )
        self.ax_diagram.add_patch(arrow)
        self.ax_diagram.text(-1.3, 0.2, 'Incident\nLight',
                            ha='right', va='bottom',
                            color=COLORS['text_primary'],
                            fontsize=FONTS['label']['size'])

        # Scattered light directions (forward and backward)
        forward_intensity = I_mie_norm[0]  # 0° (forward)
        backward_intensity = I_mie_norm[180]  # 180° (backward)

        # Forward scatter arrow
        arrow_fwd = FancyArrowPatch(
            (particle_size+0.1, 0), (particle_size + 0.3 + 0.5*forward_intensity, 0),
            arrowstyle='->', mutation_scale=25,
            linewidth=2, color=COLORS['primary'], alpha=0.9
        )
        self.ax_diagram.add_patch(arrow_fwd)

        # Backward scatter arrow
        arrow_back = FancyArrowPatch(
            (-particle_size-0.1, 0), (-particle_size - 0.3 - 0.5*backward_intensity, 0),
            arrowstyle='->', mutation_scale=25,
            linewidth=2, color=COLORS['warning'], alpha=0.9
        )
        self.ax_diagram.add_patch(arrow_back)

        # Add info text
        info_text = f"Size Parameter x = {x:.2f}\n"
        if x < 0.5:
            regime = "Rayleigh Regime"
            regime_zh = "瑞利区"
        elif x < 10:
            regime = "Intermediate"
            regime_zh = "中间区"
        else:
            regime = "Mie Regime"
            regime_zh = "米氏区"

        info_text += f"{regime} | {regime_zh}\n"
        info_text += f"r/λ = {self.particle_radius/self.wavelength:.2f}"

        self.ax_diagram.text(0, -1.3, info_text,
                            ha='center', va='top',
                            color=COLORS['text_primary'],
                            fontsize=FONTS['label']['size'],
                            bbox=dict(boxstyle='round',
                                     facecolor=COLORS['surface'],
                                     edgecolor=COLORS['text_secondary'],
                                     alpha=0.8))

        self.ax_diagram.axis('off')

        # --- Panel 2: Polar Scattering Pattern ---
        self.ax_polar.clear()

        # Plot Mie pattern
        self.ax_polar.plot(self.angles_rad, I_mie_norm,
                          color=COLORS['primary'], linewidth=SIZES['line_thick'],
                          label='Mie', alpha=0.9)

        # Plot Rayleigh for comparison if selected
        mode = self.radio_mode.value_selected
        if mode == 'Mie + Rayleigh':
            self.ax_polar.plot(self.angles_rad, I_rayleigh_norm,
                              color=COLORS['warning'], linewidth=SIZES['line_normal'],
                              linestyle='--', label='Rayleigh', alpha=0.7)

        self.ax_polar.set_theta_zero_location('E')
        self.ax_polar.set_theta_direction(-1)
        self.ax_polar.set_title(
            'Scattering Phase Function | 散射相函数',
            fontsize=FONTS['subtitle']['size'],
            color=COLORS['text_primary'],
            pad=15
        )
        self.ax_polar.set_rlabel_position(45)
        self.ax_polar.tick_params(colors=COLORS['text_secondary'])
        self.ax_polar.grid(True, alpha=0.3, color=COLORS['text_secondary'])

        if mode == 'Mie + Rayleigh':
            self.ax_polar.legend(loc='upper right',
                                facecolor=COLORS['surface'],
                                edgecolor=COLORS['text_secondary'],
                                fontsize=FONTS['label']['size'])

        # --- Panel 3: Angular Intensity Distribution ---
        self.ax_intensity.clear()

        self.ax_intensity.plot(self.angles, I_mie_norm,
                              color=COLORS['primary'], linewidth=SIZES['line_thick'],
                              label='Mie Scattering')

        if mode == 'Mie + Rayleigh':
            self.ax_intensity.plot(self.angles, I_rayleigh_norm,
                                  color=COLORS['warning'], linewidth=SIZES['line_normal'],
                                  linestyle='--', label='Rayleigh')

        self.ax_intensity.set_xlabel('Scattering Angle θ (deg) | 散射角',
                                    fontsize=FONTS['label']['size'],
                                    color=COLORS['text_primary'])
        self.ax_intensity.set_ylabel('Normalized Intensity | 归一化强度',
                                    fontsize=FONTS['label']['size'],
                                    color=COLORS['text_primary'])
        self.ax_intensity.set_title(
            'Angular Distribution | 角度分布',
            fontsize=FONTS['subtitle']['size'],
            color=COLORS['text_primary'],
            pad=10
        )
        self.ax_intensity.grid(True, alpha=0.3, color=COLORS['text_secondary'])
        self.ax_intensity.set_xlim(0, 180)
        self.ax_intensity.set_ylim(0, 1.1)

        if mode == 'Mie + Rayleigh':
            self.ax_intensity.legend(facecolor=COLORS['surface'],
                                    edgecolor=COLORS['text_secondary'],
                                    fontsize=FONTS['label']['size'])

        # Highlight forward/backward scatter
        self.ax_intensity.axvline(0, color=COLORS['primary'],
                                 linestyle=':', alpha=0.5, linewidth=1)
        self.ax_intensity.axvline(180, color=COLORS['warning'],
                                 linestyle=':', alpha=0.5, linewidth=1)
        self.ax_intensity.text(5, 0.95, 'Forward',
                              color=COLORS['primary'],
                              fontsize=FONTS['label']['size'])
        self.ax_intensity.text(175, 0.95, 'Back',
                              ha='right',
                              color=COLORS['warning'],
                              fontsize=FONTS['label']['size'])

        # --- Panel 4: Wavelength Dependence ---
        self.ax_wavelength.clear()

        wavelengths = np.linspace(400, 700, 50)
        I_forward_mie = []
        I_forward_rayleigh = []

        for wl in wavelengths:
            x_temp = (2 * np.pi * self.particle_radius) / wl
            I_mie_temp = self.mie_phase_function_approx(0, x_temp)  # 0° (forward)
            I_rayleigh_temp = 1 / (wl**4)  # Rayleigh λ⁻⁴

            I_forward_mie.append(I_mie_temp)
            I_forward_rayleigh.append(I_rayleigh_temp)

        # Normalize
        I_forward_mie = np.array(I_forward_mie)
        I_forward_mie /= np.max(I_forward_mie)

        I_forward_rayleigh = np.array(I_forward_rayleigh)
        I_forward_rayleigh /= np.max(I_forward_rayleigh)

        self.ax_wavelength.plot(wavelengths, I_forward_mie,
                               color=COLORS['primary'], linewidth=SIZES['line_thick'],
                               label='Mie (forward)')
        self.ax_wavelength.plot(wavelengths, I_forward_rayleigh,
                               color=COLORS['warning'], linewidth=SIZES['line_normal'],
                               linestyle='--', label='Rayleigh (∝ λ⁻⁴)')

        # Mark current wavelength
        self.ax_wavelength.axvline(self.wavelength,
                                   color=color_wave, linestyle=':',
                                   linewidth=2, alpha=0.7)

        self.ax_wavelength.set_xlabel('Wavelength (nm) | 波长',
                                     fontsize=FONTS['label']['size'],
                                     color=COLORS['text_primary'])
        self.ax_wavelength.set_ylabel('Normalized Intensity | 归一化强度',
                                     fontsize=FONTS['label']['size'],
                                     color=COLORS['text_primary'])
        self.ax_wavelength.set_title(
            'Wavelength Dependence | 波长依赖性',
            fontsize=FONTS['subtitle']['size'],
            color=COLORS['text_primary'],
            pad=10
        )
        self.ax_wavelength.grid(True, alpha=0.3, color=COLORS['text_secondary'])
        self.ax_wavelength.legend(facecolor=COLORS['surface'],
                                 edgecolor=COLORS['text_secondary'],
                                 fontsize=FONTS['label']['size'])

        # --- Panel 5: Size Parameter Effects ---
        self.ax_size_param.clear()

        size_params = np.linspace(0.1, 50, 100)
        asymmetry_g = 1 - 2/(size_params + 2)

        self.ax_size_param.plot(size_params, asymmetry_g,
                               color=COLORS['secondary'], linewidth=SIZES['line_thick'])

        # Mark current size parameter
        g_current = 1 - 2/(x + 2)
        self.ax_size_param.plot(x, g_current, 'o',
                               color=COLORS['primary'],
                               markersize=SIZES['marker_normal'],
                               markeredgecolor=COLORS['text_primary'],
                               markeredgewidth=1.5)

        self.ax_size_param.axhline(0, color=COLORS['text_secondary'],
                                   linestyle='--', linewidth=1, alpha=0.5)
        self.ax_size_param.axhline(1, color=COLORS['text_secondary'],
                                   linestyle='--', linewidth=1, alpha=0.5)

        self.ax_size_param.set_xlabel('Size Parameter x = 2πr/λ | 尺寸参数',
                                     fontsize=FONTS['label']['size'],
                                     color=COLORS['text_primary'])
        self.ax_size_param.set_ylabel('Asymmetry Parameter g | 不对称参数',
                                     fontsize=FONTS['label']['size'],
                                     color=COLORS['text_primary'])
        self.ax_size_param.set_title(
            'Forward Scattering Strength | 前向散射强度',
            fontsize=FONTS['subtitle']['size'],
            color=COLORS['text_primary'],
            pad=10
        )
        self.ax_size_param.grid(True, alpha=0.3, color=COLORS['text_secondary'])
        self.ax_size_param.set_xlim(0, 50)
        self.ax_size_param.set_ylim(-0.1, 1.1)

        # Add annotations
        self.ax_size_param.text(2, 0.1, 'Rayleigh\n(isotropic)',
                               ha='center', va='bottom',
                               color=COLORS['text_secondary'],
                               fontsize=FONTS['label']['size'])
        self.ax_size_param.text(40, 0.9, 'Mie\n(forward)',
                               ha='center', va='top',
                               color=COLORS['text_secondary'],
                               fontsize=FONTS['label']['size'])

        # --- Panel 6: Info Panel ---
        self.ax_info.clear()
        self.ax_info.axis('off')

        info_text = "Mie Scattering 米氏散射\n\n"
        info_text += "Key Physics 关键物理:\n"
        info_text += f"• Size parameter: x = {x:.2f}\n"
        info_text += f"• Particle radius: r = {self.particle_radius:.0f} nm\n"
        info_text += f"• Wavelength: λ = {self.wavelength:.0f} nm\n"
        info_text += f"• r/λ = {self.particle_radius/self.wavelength:.2f}\n"
        info_text += f"• Refractive index: n = {self.n_particle:.2f}\n\n"

        info_text += "Scattering Regime 散射区域:\n"
        if x < 0.5:
            info_text += "• Rayleigh (x ≪ 1)\n"
            info_text += "• λ⁻⁴ dependence\n"
            info_text += "• Symmetric scattering\n"
        elif x < 10:
            info_text += "• Intermediate regime\n"
            info_text += "• Transition region\n"
            info_text += "• Mie ripples visible\n"
        else:
            info_text += "• Mie regime (x ≫ 1)\n"
            info_text += "• Strong forward peak\n"
            info_text += "• Weak λ dependence\n"

        info_text += "\nApplications 应用:\n"
        info_text += "• White clouds (白云)\n"
        info_text += "• Fog visibility (雾能见度)\n"
        info_text += "• Aerosol optics (气溶胶)\n"

        self.ax_info.text(0.1, 0.95, info_text,
                         transform=self.ax_info.transAxes,
                         fontsize=FONTS['label']['size'],
                         color=COLORS['text_primary'],
                         verticalalignment='top',
                         family='monospace',
                         bbox=dict(boxstyle='round',
                                  facecolor=COLORS['surface'],
                                  edgecolor=COLORS['text_secondary'],
                                  alpha=0.9,
                                  pad=1))

        plt.draw()

    def update_radius(self, val):
        """Update particle radius"""
        self.particle_radius = val
        self.update_plot()

    def update_wavelength(self, val):
        """Update wavelength"""
        self.wavelength = val
        self.update_plot()

    def update_n(self, val):
        """Update refractive index"""
        self.n_particle = val
        self.update_plot()

    def update_mode(self, label):
        """Update comparison mode"""
        self.update_plot()

    def reset(self, event):
        """Reset all parameters to defaults"""
        self.slider_radius.set_val(550)
        self.slider_wavelength.set_val(550)
        self.slider_n.set_val(1.33)

    def export_data(self, event):
        """Export scattering data to CSV"""
        try:
            from export_utils import export_plot_data

            # Calculate current scattering patterns
            x = self.calculate_size_parameter()
            I_mie = self.mie_phase_function_approx(self.angles_rad, x)
            I_mie_norm = I_mie / np.max(I_mie)

            I_rayleigh = self.rayleigh_phase_function(self.angles_rad)
            I_rayleigh_norm = I_rayleigh / np.max(I_rayleigh)

            # Export data
            export_plot_data(
                self.angles,
                [I_mie_norm, I_rayleigh_norm],
                'mie_scattering_data',
                x_label='Scattering Angle (deg)',
                y_labels=['Mie Intensity', 'Rayleigh Intensity'],
                format='csv',
                metadata={
                    'Demo': 'Mie Scattering',
                    'Particle Radius (nm)': self.particle_radius,
                    'Wavelength (nm)': self.wavelength,
                    'Refractive Index': self.n_particle,
                    'Size Parameter x': round(x, 4)
                }
            )

            print("Data exported successfully!")

        except ImportError:
            print("Warning: export_utils.py not found. Skipping export.")
        except Exception as e:
            print(f"Export error: {e}")

    def show(self):
        """Display the interactive demo"""
        plt.show()


# ============================================================================
# MAIN EXECUTION
# 主程序执行
# ============================================================================

if __name__ == '__main__':
    """
    Run the Mie scattering interactive demo
    运行米氏散射交互演示
    """
    print("=" * 60)
    print("Mie Scattering Demo - PolarCraft")
    print("米氏散射演示 - PolarCraft")
    print("=" * 60)
    print("\nPhysics Concepts 物理概念:")
    print("• Mie scattering: particle size ~ wavelength")
    print("• Size parameter: x = 2πr/λ")
    print("• Forward scattering for large particles")
    print("• White clouds vs. blue sky")
    print("\nInteractive Controls 交互控制:")
    print("• Adjust particle radius (50-2000 nm)")
    print("• Change wavelength (400-700 nm)")
    print("• Modify refractive index (1.1-2.0)")
    print("• Compare with Rayleigh scattering")
    print("• Export data to CSV")
    print("\n" + "=" * 60 + "\n")

    demo = MieScatteringDemo()
    demo.show()
