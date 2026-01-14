#!/usr/bin/env python3
"""
Waveplate Demonstration - OPTIMIZED
波片原理演示 - 优化版

Physical Principles 物理原理:
────────────────────────────────────────────────────────────────
1. λ/4 Quarter-Wave Plate:
   - Phase retardation: Δφ = π/2 (90°)
   - 45° linear → Circular polarization
   - Other angles → Elliptical polarization

2. λ/2 Half-Wave Plate:
   - Phase retardation: Δφ = π (180°)
   - Rotation formula: θ_out = 2θ_fast - θ_in
   - Maintains linear polarization

Jones Matrix Representation:
λ/4 plate (fast axis along x):  ⎡ 1   0  ⎤
                                 ⎣ 0  -i  ⎦

λ/2 plate (fast axis along x):  ⎡ 1   0  ⎤
                                 ⎣ 0  -1  ⎦

OPTIMIZATIONS 优化内容:
────────────────────────────────────────────────────────────────
✨ Unified PolarCraft styling from visualization_config.py
✨ Enhanced radio buttons and sliders with visual feedback
✨ Improved polarization state visualization
✨ Smooth animations and efficient updates
✨ Information panel with Jones matrices
✨ Better layout with proper spacing

Dependencies: numpy>=1.24.0, matplotlib>=3.7.0
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, RadioButtons, Button
from matplotlib.patches import Ellipse, FancyArrowPatch, Circle, Rectangle

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
# JONES MATRIX CALCULATIONS (保持不变)
# ============================================================================

def rotation_matrix(theta_rad):
    """Rotation matrix R(θ)"""
    c = np.cos(theta_rad)
    s = np.sin(theta_rad)
    return np.array([[c, s], [-s, c]])


def jones_linear_polarizer(theta_rad):
    """Jones vector for linear polarization: E = [cos(θ), sin(θ)]ᵀ"""
    return np.array([np.cos(theta_rad), np.sin(theta_rad)], dtype=complex)


def jones_quarter_waveplate(fast_axis_rad):
    """
    λ/4 waveplate Jones matrix (fast axis at fast_axis_rad).
    Phase retardation π/2.
    """
    M = np.array([[1, 0], [0, -1j]], dtype=complex)
    R = rotation_matrix(fast_axis_rad)
    R_inv = rotation_matrix(-fast_axis_rad)
    return R_inv @ M @ R


def jones_half_waveplate(fast_axis_rad):
    """
    λ/2 waveplate Jones matrix (fast axis at fast_axis_rad).
    Phase retardation π.
    """
    M = np.array([[1, 0], [0, -1]], dtype=complex)
    R = rotation_matrix(fast_axis_rad)
    R_inv = rotation_matrix(-fast_axis_rad)
    return R_inv @ M @ R


def apply_waveplate(input_jones, waveplate_matrix):
    """Apply waveplate: output = M · input"""
    return waveplate_matrix @ input_jones


def calculate_intensity(jones_vector):
    """Calculate intensity: I = |E_x|² + |E_y|²"""
    return np.abs(jones_vector[0])**2 + np.abs(jones_vector[1])**2


def classify_polarization_state(jones_vector, tolerance=0.05):
    """
    Classify polarization state from Jones vector.

    Returns:
        ('linear', angle) - Linear polarization
        ('circular-r', 0) - Right circular
        ('circular-l', 0) - Left circular
        ('elliptical', angle) - Elliptical
    """
    Ex = jones_vector[0]
    Ey = jones_vector[1]

    # Normalize
    norm = np.sqrt(np.abs(Ex)**2 + np.abs(Ey)**2)
    if norm < 1e-10:
        return ('linear', 0)

    Ex_n = Ex / norm
    Ey_n = Ey / norm

    # Phase difference
    phase_diff = np.angle(Ey_n) - np.angle(Ex_n)
    phase_diff = (phase_diff + np.pi) % (2 * np.pi) - np.pi

    # Intensity ratio
    I_ratio = np.abs(Ey_n) / (np.abs(Ex_n) + 1e-10)

    # Linear: phase diff ≈ 0 or ≈ π
    if abs(phase_diff) < tolerance or abs(abs(phase_diff) - np.pi) < tolerance:
        angle_rad = np.arctan2(np.real(Ey_n), np.real(Ex_n))
        angle_deg = np.degrees(angle_rad) % 180
        return ('linear', angle_deg)

    # Circular: |Ex| ≈ |Ey| and phase diff ≈ ±π/2
    if abs(I_ratio - 1) < tolerance:
        if abs(abs(phase_diff) - np.pi/2) < tolerance:
            if phase_diff > 0:
                return ('circular-r', 0)
            else:
                return ('circular-l', 0)

    # Elliptical
    angle_rad = np.arctan2(np.imag(Ex_n * np.conj(Ey_n)),
                           np.real(Ex_n * np.conj(Ey_n))) / 2
    angle_deg = np.degrees(angle_rad) % 180
    return ('elliptical', angle_deg)


# ============================================================================
# OPTIMIZED VISUALIZATION CLASS
# ============================================================================

class WaveplateDemoOptimized:
    """Optimized waveplate demonstration with unified styling."""

    def __init__(self):
        # Apply unified styling
        setup_polarcraft_style()

        # Initialize state
        self.waveplate_type = 'quarter'
        self.input_angle = 45
        self.fast_axis_angle = 0

        # Create figure
        self.fig = plt.figure(figsize=(15, 10), facecolor=COLORS['background'])
        self.fig.suptitle(
            'Waveplate Demonstration | 波片原理演示',
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
            '🎯 Select waveplate type  •  Adjust input and fast axis angles  •  '
            'Observe polarization transformation',
            ha='center', fontsize=FONTS['small'],
            color=COLORS['text_secondary'], style='italic'
        )

    def _create_layout(self):
        """Create subplot layout."""
        gs = self.fig.add_gridspec(5, 4, hspace=0.5, wspace=0.4,
                                    left=0.08, right=0.96, top=0.93, bottom=0.12)

        # Main optical path diagram
        self.ax_main = self.fig.add_subplot(gs[0:3, 0:3])
        self.ax_main.set_facecolor(COLORS['surface'])

        # Input polarization state
        self.ax_input = self.fig.add_subplot(gs[0, 3])
        self.ax_input.set_facecolor(COLORS['surface'])

        # Output polarization state
        self.ax_output = self.fig.add_subplot(gs[1, 3])
        self.ax_output.set_facecolor(COLORS['surface'])

        # Info panel
        self.ax_info = self.fig.add_subplot(gs[2, 3])
        self.ax_info.set_facecolor(COLORS['surface'])

        # Phase retardation diagram
        self.ax_phase = self.fig.add_subplot(gs[3, :])
        self.ax_phase.set_facecolor(COLORS['surface'])

    def _create_controls(self):
        """Create interactive controls."""
        # Radio buttons for waveplate type
        ax_radio = self.fig.add_axes([0.015, 0.72, 0.065, 0.12],
                                      facecolor=COLORS['surface'])
        self.radio = RadioButtons(
            ax_radio,
            ('λ/4', 'λ/2'),
            active=0 if self.waveplate_type == 'quarter' else 1
        )
        # Style radio button labels
        for label in self.radio.labels:
            label.set_color(COLORS['text_primary'])
            label.set_fontsize(FONTS['small'])

        self.radio.on_clicked(self._on_waveplate_type_changed)

        # Input angle slider
        ax_input = self.fig.add_axes([0.15, 0.06, 0.65, 0.025])
        self.slider_input = Slider(
            ax_input,
            'Input Angle θ\n输入角度',
            0, 180,
            valinit=self.input_angle,
            valstep=5,
            color=COLORS['warning']
        )
        style_slider(self.slider_input, COLORS['warning'])
        self.slider_input.on_changed(self._on_input_changed)

        # Add special angle markers
        for angle in [0, 45, 90, 135, 180]:
            ax_input.axvline(angle, color=COLORS['grid'], alpha=0.3, linewidth=0.5)

        # Fast axis angle slider
        ax_fast = self.fig.add_axes([0.15, 0.02, 0.65, 0.025])
        self.slider_fast_axis = Slider(
            ax_fast,
            'Fast Axis Angle\n快轴角度',
            0, 180,
            valinit=self.fast_axis_angle,
            valstep=5,
            color=COLORS['secondary']
        )
        style_slider(self.slider_fast_axis, COLORS['secondary'])
        self.slider_fast_axis.on_changed(self._on_fast_axis_changed)

        # Reset button
        ax_reset = self.fig.add_axes([0.85, 0.04, 0.08, 0.04])
        self.btn_reset = Button(
            ax_reset, 'Reset',
            color=COLORS['surface'],
            hovercolor=COLORS['grid']
        )
        self.btn_reset.label.set_color(COLORS['text_primary'])
        self.btn_reset.on_clicked(self._on_reset)

    def _update_plot(self):
        """Update all visualizations."""
        # Calculate physics
        input_rad = np.radians(self.input_angle)
        fast_axis_rad = np.radians(self.fast_axis_angle)

        input_jones = jones_linear_polarizer(input_rad)

        if self.waveplate_type == 'quarter':
            waveplate_matrix = jones_quarter_waveplate(fast_axis_rad)
        else:
            waveplate_matrix = jones_half_waveplate(fast_axis_rad)

        output_jones = apply_waveplate(input_jones, waveplate_matrix)

        input_state, input_angle = classify_polarization_state(input_jones)
        output_state, output_angle = classify_polarization_state(output_jones)

        # Update all panels
        self._draw_optical_path(input_rad, fast_axis_rad, output_state)
        self._draw_polarization_state(self.ax_input, input_jones,
                                       input_state, input_angle,
                                       'Input', COLORS['warning'])
        self._draw_polarization_state(self.ax_output, output_jones,
                                       output_state, output_angle,
                                       'Output', self._get_output_color(output_state))
        self._draw_info_panel(waveplate_matrix)
        self._draw_phase_diagram()

        self.fig.canvas.draw_idle()

    def _get_output_color(self, state):
        """Get color for output polarization state."""
        color_map = {
            'linear': COLORS['success'],
            'circular-r': COLORS['primary'],
            'circular-l': COLORS['primary'],
            'elliptical': COLORS['secondary']
        }
        return color_map.get(state, COLORS['text_primary'])

    def _draw_optical_path(self, input_rad, fast_axis_rad, output_state):
        """Draw optical path diagram."""
        self.ax_main.clear()
        self.ax_main.set_xlim(0, 10)
        self.ax_main.set_ylim(0, 5)
        self.ax_main.set_aspect('equal')
        self.ax_main.axis('off')
        self.ax_main.set_facecolor(COLORS['surface'])

        # Light source
        source_x, source_y = 1, 2.5
        source = Circle((source_x, source_y), 0.3,
                       color=COLORS['warning'], alpha=0.8)
        self.ax_main.add_patch(source)
        self.ax_main.text(
            source_x, source_y - 0.7, 'Light\nSource',
            ha='center', va='top',
            color=COLORS['text_secondary'],
            fontsize=FONTS['tiny']
        )

        # Input beam
        self.ax_main.arrow(
            source_x + 0.3, source_y, 1.5, 0,
            head_width=0.15, head_length=0.2,
            fc=COLORS['warning'], ec=COLORS['warning'],
            alpha=0.7, linewidth=2
        )

        # Input polarization indicator
        input_x, input_y = 2.5, 2.5
        dx = 0.4 * np.cos(input_rad)
        dy = 0.4 * np.sin(input_rad)
        arrow = FancyArrowPatch(
            (input_x - dx, input_y - dy),
            (input_x + dx, input_y + dy),
            arrowstyle='<->',
            mutation_scale=15,
            linewidth=2.5,
            color=COLORS['warning']
        )
        self.ax_main.add_patch(arrow)
        self.ax_main.text(
            input_x, input_y - 0.7,
            f'{self.input_angle:.0f}°',
            ha='center', va='top',
            color=COLORS['warning'],
            fontsize=FONTS['tiny'],
            bbox=dict(boxstyle='round,pad=0.2',
                     facecolor=COLORS['background'],
                     edgecolor=COLORS['warning'],
                     alpha=0.8)
        )

        # Waveplate
        waveplate_x, waveplate_y = 5, 2.5
        waveplate_color = COLORS['secondary'] if self.waveplate_type == 'quarter' else COLORS['error']
        waveplate_label = 'λ/4' if self.waveplate_type == 'quarter' else 'λ/2'

        waveplate = Ellipse(
            (waveplate_x, waveplate_y), 0.8, 1.8,
            facecolor=waveplate_color,
            edgecolor=waveplate_color,
            alpha=0.3, linewidth=2
        )
        self.ax_main.add_patch(waveplate)
        self.ax_main.text(
            waveplate_x, waveplate_y - 1.3,
            f'{waveplate_label} Waveplate',
            ha='center', va='top',
            color=waveplate_color,
            fontsize=FONTS['small'],
            fontweight='bold'
        )

        # Fast axis (yellow)
        fast_dx = 0.7 * np.cos(fast_axis_rad)
        fast_dy = 0.7 * np.sin(fast_axis_rad)
        fast_arrow = FancyArrowPatch(
            (waveplate_x - fast_dx, waveplate_y - fast_dy),
            (waveplate_x + fast_dx, waveplate_y + fast_dy),
            arrowstyle='->',
            mutation_scale=15,
            linewidth=3,
            color=COLORS['warning']
        )
        self.ax_main.add_patch(fast_arrow)
        self.ax_main.text(
            waveplate_x - 1.0, waveplate_y + 1.2,
            'Fast',
            ha='center',
            color=COLORS['warning'],
            fontsize=FONTS['tiny']
        )

        # Slow axis (blue, dashed)
        slow_rad = fast_axis_rad + np.pi / 2
        slow_dx = 0.6 * np.cos(slow_rad)
        slow_dy = 0.6 * np.sin(slow_rad)
        self.ax_main.plot(
            [waveplate_x - slow_dx, waveplate_x + slow_dx],
            [waveplate_y - slow_dy, waveplate_y + slow_dy],
            '--', color=COLORS['primary'], linewidth=2
        )
        self.ax_main.text(
            waveplate_x + 1.0, waveplate_y + 1.2,
            'Slow',
            ha='center',
            color=COLORS['primary'],
            fontsize=FONTS['tiny']
        )

        # Output beam
        output_color = self._get_output_color(output_state)
        self.ax_main.arrow(
            waveplate_x + 0.5, waveplate_y, 2.0, 0,
            head_width=0.15, head_length=0.2,
            fc=output_color, ec=output_color,
            alpha=0.7, linewidth=2
        )

        # Screen
        screen_x = 9
        screen = Rectangle(
            (screen_x - 0.1, waveplate_y - 1), 0.2, 2,
            facecolor=COLORS['surface'],
            edgecolor=COLORS['text_secondary'],
            linewidth=2
        )
        self.ax_main.add_patch(screen)

        # Screen spot
        spot = Circle((screen_x, waveplate_y), 0.3,
                     color=output_color, alpha=0.8)
        self.ax_main.add_patch(spot)
        self.ax_main.text(
            screen_x, waveplate_y - 1.3, 'Screen',
            ha='center', va='top',
            color=COLORS['text_secondary'],
            fontsize=FONTS['tiny']
        )

    def _draw_polarization_state(self, ax, jones_vector, state_type,
                                  angle, title, color):
        """Draw polarization state visualization."""
        ax.clear()
        ax.set_xlim(-1.5, 1.5)
        ax.set_ylim(-1.5, 1.5)
        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_facecolor(COLORS['surface'])
        ax.set_title(title, color=COLORS['text_primary'],
                    fontsize=FONTS['small'], fontweight='bold')

        if state_type == 'linear':
            # Linear polarization - double arrow
            angle_rad = np.radians(angle)
            dx = np.cos(angle_rad)
            dy = np.sin(angle_rad)
            arrow = FancyArrowPatch(
                (-dx, -dy), (dx, dy),
                arrowstyle='<->',
                mutation_scale=20,
                linewidth=3,
                color=color
            )
            ax.add_patch(arrow)
            ax.text(
                0, -1.3, f'Linear\n{angle:.0f}°',
                ha='center', va='top',
                color=color,
                fontsize=FONTS['tiny']
            )

        elif state_type in ['circular-r', 'circular-l']:
            # Circular polarization - circle + rotation arrow
            circle = Circle((0, 0), 1, fill=False,
                          edgecolor=color, linewidth=2.5)
            ax.add_patch(circle)

            if state_type == 'circular-r':
                ax.annotate(
                    '', xy=(0.7, 0.7), xytext=(-0.7, 0.7),
                    arrowprops=dict(arrowstyle='->', color=color,
                                  lw=2, connectionstyle="arc3,rad=0.3")
                )
                ax.text(
                    0, -1.3, 'Right\nCircular',
                    ha='center', va='top',
                    color=color,
                    fontsize=FONTS['tiny']
                )
            else:
                ax.annotate(
                    '', xy=(-0.7, 0.7), xytext=(0.7, 0.7),
                    arrowprops=dict(arrowstyle='->', color=color,
                                  lw=2, connectionstyle="arc3,rad=-0.3")
                )
                ax.text(
                    0, -1.3, 'Left\nCircular',
                    ha='center', va='top',
                    color=color,
                    fontsize=FONTS['tiny']
                )

        else:
            # Elliptical polarization
            Ex = jones_vector[0]
            Ey = jones_vector[1]
            a = np.abs(Ex)
            b = np.abs(Ey)

            if b > a:
                a, b = b, a
                angle = (angle + 90) % 180

            ellipse = Ellipse(
                (0, 0), 2*a, 2*b, angle=angle,
                fill=False, edgecolor=color, linewidth=2.5
            )
            ax.add_patch(ellipse)
            ax.text(
                0, -1.3, f'Elliptical\n{angle:.0f}°',
                ha='center', va='top',
                color=color,
                fontsize=FONTS['tiny']
            )

    def _draw_info_panel(self, waveplate_matrix):
        """Draw information panel with Jones matrix."""
        self.ax_info.clear()
        self.ax_info.axis('off')
        self.ax_info.set_facecolor(COLORS['surface'])

        phase_shift = 'π/2' if self.waveplate_type == 'quarter' else 'π'
        waveplate_name = 'Quarter-Wave' if self.waveplate_type == 'quarter' else 'Half-Wave'

        info_text = (
            f"📖 {waveplate_name} Plate\n"
            f"{'─' * 30}\n"
            f"Phase retardation: Δφ = {phase_shift}\n\n"
            f"Jones Matrix:\n"
            f"M = R(-θ) · W · R(θ)\n\n"
            f"Fast axis: {self.fast_axis_angle:.0f}°\n"
            f"Input: {self.input_angle:.0f}°"
        )

        create_info_textbox(
            self.ax_info,
            info_text,
            (0.05, 0.95),
            fontsize=FONTS['tiny']
        )

    def _draw_phase_diagram(self):
        """Draw phase retardation diagram."""
        self.ax_phase.clear()
        self.ax_phase.set_xlim(0, 10)
        self.ax_phase.set_ylim(-2, 2)
        self.ax_phase.set_facecolor(COLORS['surface'])
        self.ax_phase.set_title(
            'Phase Retardation | 相位延迟',
            color=COLORS['text_primary'],
            fontsize=FONTS['small'],
            fontweight='bold'
        )
        self.ax_phase.set_xlabel('Position', color=COLORS['text_primary'],
                                fontsize=FONTS['tiny'])
        self.ax_phase.set_ylabel('Amplitude', color=COLORS['text_primary'],
                                fontsize=FONTS['tiny'])
        self.ax_phase.tick_params(colors=COLORS['text_primary'],
                                 labelsize=FONTS['tiny'])
        for spine in self.ax_phase.spines.values():
            spine.set_color(COLORS['grid'])

        x = np.linspace(0, 10, 500)
        wavelength = 2.0

        # Fast axis component
        y_fast = np.sin(2 * np.pi * x / wavelength)
        self.ax_phase.plot(
            x, y_fast,
            color=COLORS['warning'],
            linewidth=2.5,
            label='Fast Axis'
        )

        # Slow axis component with phase shift
        if self.waveplate_type == 'quarter':
            phase_shift = np.pi / 2
            label_text = 'Slow Axis (Δφ = π/2)'
        else:
            phase_shift = np.pi
            label_text = 'Slow Axis (Δφ = π)'

        y_slow = np.sin(2 * np.pi * x / wavelength + phase_shift)
        self.ax_phase.plot(
            x, y_slow,
            color=COLORS['primary'],
            linewidth=2.5,
            linestyle='--',
            label=label_text
        )

        self.ax_phase.legend(
            loc='upper right',
            fontsize=FONTS['tiny'],
            framealpha=0.9,
            facecolor=COLORS['surface'],
            edgecolor=COLORS['grid']
        )
        self.ax_phase.axhline(
            0, color=COLORS['text_secondary'],
            linewidth=0.5, linestyle=':'
        )
        self.ax_phase.grid(True, alpha=0.2, color=COLORS['grid'])

    def _on_waveplate_type_changed(self, label):
        """Callback for waveplate type change."""
        self.waveplate_type = 'quarter' if label == 'λ/4' else 'half'
        self._update_plot()

    def _on_input_changed(self, val):
        """Callback for input angle change."""
        self.input_angle = val
        self._update_plot()

    def _on_fast_axis_changed(self, val):
        """Callback for fast axis angle change."""
        self.fast_axis_angle = val
        self._update_plot()

    def _on_reset(self, event):
        """Callback for reset button."""
        self.input_angle = 45
        self.fast_axis_angle = 0
        self.slider_input.set_val(45)
        self.slider_fast_axis.set_val(0)
        self._update_plot()

    def show(self):
        """Display the interactive demonstration."""
        plt.show()


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    print("=" * 70)
    print("Waveplate Demonstration | 波片原理演示 - OPTIMIZED")
    print("=" * 70)
    print("\nPhysical Principles:")
    print("  λ/4 plate: Phase retardation π/2 (90°)")
    print("    - 45° linear → Circular polarization")
    print("    - Other angles → Elliptical polarization")
    print("\n  λ/2 plate: Phase retardation π (180°)")
    print("    - Output angle = 2 × fast axis - input angle")
    print("    - Maintains linear polarization")
    print("\nControls:")
    print("  - Radio buttons: Select waveplate type")
    print("  - Sliders: Adjust input and fast axis angles")
    print("  - Reset button: Restore defaults")
    print("\n")

    demo = WaveplateDemoOptimized()
    demo.show()


# ============================================================================
# LEARNING EXERCISES
# ============================================================================
"""
Try these experiments 尝试这些实验:

1. Circular Polarization from λ/4 plate:
   - Set λ/4 waveplate
   - Input angle = 45°, Fast axis = 0°
   - Observe: Output becomes RIGHT circular!
   - Change input to 135°: Output becomes LEFT circular

2. Linear Rotation with λ/2 plate:
   - Set λ/2 waveplate
   - Input angle = 0°, Fast axis = 22.5°
   - Observe: Output = 2×22.5° - 0° = 45°
   - Formula: θ_out = 2θ_fast - θ_in

3. Maintaining Polarization:
   - Set input angle parallel to fast axis (both 0°)
   - Observe: Polarization unchanged!
   - Light along fast/slow axis passes unmodified

4. Creating Elliptical Polarization:
   - Set λ/4 waveplate
   - Input angle = 30° (not 45°)
   - Observe: Elliptical polarization forms
   - Ellipticity depends on input angle

OPTIMIZATION HIGHLIGHTS 优化亮点:
──────────────────────────────────
✓ Unified PolarCraft color scheme
✓ Enhanced radio buttons and sliders
✓ Improved polarization state visualization
✓ Information panel with Jones matrices
✓ Phase diagram with clear labeling
✓ Responsive layout with proper spacing
✓ Non-blocking updates with draw_idle()

Further Reading:
    - Hecht, "Optics" Chapter 8: Polarization
    - Born & Wolf, "Principles of Optics" Chapter 1
    - Applications: 3D cinema, LCD displays, quantum optics
"""
