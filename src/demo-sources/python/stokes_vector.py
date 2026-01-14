#!/usr/bin/env python3
"""
Stokes Vector Demonstration
斯托克斯矢量演示

Physical Principle (物理原理):
Stokes parameters provide a complete description of any polarization state,
including partial polarization. Unlike Jones calculus (complex vectors),
Stokes parameters use real numbers and are directly measurable.

Stokes Vector: S = [S₀, S₁, S₂, S₃]ᵀ
- S₀: Total intensity (总光强)
- S₁: H-V preference (水平-垂直偏好)
- S₂: ±45° preference (±45°偏好)
- S₃: R-L preference (右旋-左旋偏好)

Degree of Polarization: DOP = √(S₁² + S₂² + S₃²) / S₀
- DOP = 1: Fully polarized (完全偏振)
- DOP = 0: Unpolarized (非偏振)
- 0 < DOP < 1: Partially polarized (部分偏振)

Applications (应用场景):
- Atmospheric polarimetry (大气偏振测量)
- Remote sensing (遥感)
- Astronomy (polarized starlight) (天文偏振)
- Biomedical imaging (生物医学成像)
- LCD characterization (液晶显示器表征)

Author: PolarCraft Team
Date: 2026-01-14
Python Version: 3.8+
Dependencies: numpy, matplotlib
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button, RadioButtons
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.patches import Ellipse, FancyArrowPatch, Wedge, Circle
import warnings
warnings.filterwarnings('ignore')


class StokesVector:
    """
    Stokes Vector Representation
    斯托克斯矢量表示

    Stokes parameters describe any polarization state using 4 real numbers.
    斯托克斯参数使用4个实数描述任意偏振态。

    Attributes:
        S: numpy array [S₀, S₁, S₂, S₃]
    """

    def __init__(self, S0=1.0, S1=0.0, S2=0.0, S3=0.0):
        """
        Initialize Stokes Vector
        初始化斯托克斯矢量

        Parameters:
        - S0: Total intensity (总光强) ≥ 0
        - S1: H-V difference (水平-垂直差)
        - S2: ±45° difference (±45°差)
        - S3: R-L difference (右旋-左旋差)

        Constraint (约束): S₁² + S₂² + S₃² ≤ S₀²
        """
        self.S = np.array([S0, S1, S2, S3], dtype=float)
        self.validate()

    def validate(self):
        """
        Validate Physical Realizability
        验证物理可实现性

        Check: S₁² + S₂² + S₃² ≤ S₀²
        检查：偏振分量的平方和不能超过总光强的平方
        """
        S0, S1, S2, S3 = self.S

        if S0 < 0:
            raise ValueError(f"S₀ must be non-negative, got {S0}")

        polarized_power = S1**2 + S2**2 + S3**2
        total_power = S0**2

        if polarized_power > total_power * 1.001:  # Allow small numerical error
            raise ValueError(
                f"Invalid Stokes vector: S₁² + S₂² + S₃² = {polarized_power:.4f} > S₀² = {total_power:.4f}\n"
                f"Physical constraint violated: √(S₁² + S₂² + S₃²) ≤ S₀"
            )

    @classmethod
    def from_jones(cls, jones_vec):
        """
        Convert Jones Vector to Stokes Parameters
        将琼斯矢量转换为斯托克斯参数

        Formula:
        S₀ = |Ex|² + |Ey|²
        S₁ = |Ex|² - |Ey|²
        S₂ = 2·Re(Ex·Ey*)
        S₃ = 2·Im(Ex·Ey*)

        Parameters:
        - jones_vec: Complex 2D array [Ex, Ey]

        Returns:
        - StokesVector instance
        """
        Ex, Ey = jones_vec[0], jones_vec[1]

        S0 = np.abs(Ex)**2 + np.abs(Ey)**2
        S1 = np.abs(Ex)**2 - np.abs(Ey)**2
        S2 = 2 * np.real(Ex * np.conj(Ey))
        S3 = 2 * np.imag(Ex * np.conj(Ey))

        return cls(S0, S1, S2, S3)

    @classmethod
    def from_intensities(cls, I_H, I_V, I_45, I_m45, I_R, I_L):
        """
        Construct from 6 Intensity Measurements
        从6个强度测量值构造斯托克斯矢量

        Experimental measurement method:
        - I_H, I_V: Horizontal and vertical polarizer
        - I_45, I_m45: +45° and -45° polarizer
        - I_R, I_L: Right and left circular analyzer

        Formula:
        S₀ = I_H + I_V = I_45 + I_m45 = I_R + I_L
        S₁ = I_H - I_V
        S₂ = I_45 - I_m45
        S₃ = I_R - I_L

        Parameters:
        - I_H: Intensity through horizontal polarizer
        - I_V: Intensity through vertical polarizer
        - I_45: Intensity through +45° polarizer
        - I_m45: Intensity through -45° polarizer
        - I_R: Intensity through right circular analyzer
        - I_L: Intensity through left circular analyzer
        """
        S0 = (I_H + I_V + I_45 + I_m45 + I_R + I_L) / 3  # Average of 3 methods
        S1 = I_H - I_V
        S2 = I_45 - I_m45
        S3 = I_R - I_L

        return cls(S0, S1, S2, S3)

    def dop(self):
        """
        Calculate Degree of Polarization
        计算偏振度

        DOP = √(S₁² + S₂² + S₃²) / S₀

        Returns:
        - float: DOP value (0 to 1)
          - 0: Completely unpolarized
          - 1: Fully polarized
        """
        if self.S[0] == 0:
            return 0.0

        return np.sqrt(self.S[1]**2 + self.S[2]**2 + self.S[3]**2) / self.S[0]

    def to_poincare(self):
        """
        Convert to Poincaré Sphere Coordinates
        转换为庞加莱球坐标

        Normalized coordinates on unit sphere:
        s₁ = S₁/S₀ (x-axis: H ↔ V)
        s₂ = S₂/S₀ (y-axis: +45° ↔ -45°)
        s₃ = S₃/S₀ (z-axis: R ↔ L)

        The distance from origin equals DOP.
        距离原点的距离等于偏振度。

        Returns:
        - tuple: (s1, s2, s3)
        """
        if self.S[0] == 0:
            return (0, 0, 0)

        return (self.S[1] / self.S[0],
                self.S[2] / self.S[0],
                self.S[3] / self.S[0])

    def ellipse_parameters(self):
        """
        Extract Polarization Ellipse Parameters
        提取偏振椭圆参数

        From Stokes parameters:
        Orientation: ψ = 0.5 × arctan(S₂/S₁)
        Ellipticity: χ = 0.5 × arcsin(S₃/S₀)

        Returns:
        - tuple: (a, b, psi_deg, chi_deg, handedness)
          - a: Semi-major axis
          - b: Semi-minor axis
          - psi_deg: Orientation angle in degrees
          - chi_deg: Ellipticity angle in degrees
          - handedness: 'left', 'right', or 'linear'
        """
        S0, S1, S2, S3 = self.S

        if S0 == 0:
            return (0, 0, 0, 0, 'undefined')

        # Normalize
        s1, s2, s3 = S1/S0, S2/S0, S3/S0

        # Orientation angle (方位角)
        if abs(s1) < 1e-10 and abs(s2) < 1e-10:
            psi_rad = 0
        else:
            psi_rad = 0.5 * np.arctan2(s2, s1)
        psi_deg = np.degrees(psi_rad)

        # Ellipticity angle (椭圆率角)
        sin_2chi = np.clip(s3, -1, 1)
        chi_rad = 0.5 * np.arcsin(sin_2chi)
        chi_deg = np.degrees(chi_rad)

        # Semi-axes
        dop = np.sqrt(s1**2 + s2**2 + s3**2)
        a = np.sqrt(S0 * (1 + dop))
        b = np.sqrt(S0 * (1 - dop))

        # Handedness
        if abs(chi_deg) < 0.1:
            handedness = 'linear'
        elif chi_deg > 0:
            handedness = 'left'  # Left-handed
        else:
            handedness = 'right'  # Right-handed

        return (a, b, psi_deg, chi_deg, handedness)

    def to_jones(self):
        """
        Convert to Jones Vector (if fully polarized)
        转换为琼斯矢量（如果是完全偏振）

        Only valid when DOP = 1
        仅当偏振度为1时有效

        Returns:
        - complex numpy array: [Ex, Ey]
        """
        if self.dop() < 0.99:
            raise ValueError(
                f"Cannot convert to Jones vector: DOP = {self.dop():.3f} < 1\n"
                f"Jones calculus only describes fully polarized light"
            )

        S0, S1, S2, S3 = self.S

        # Calculate Ex, Ey amplitudes
        Ex_amp = np.sqrt((S0 + S1) / 2)
        Ey_amp = np.sqrt((S0 - S1) / 2)

        # Calculate relative phase
        if Ex_amp < 1e-10:
            phase = 0
        else:
            phase = np.arctan2(S3, S2)

        # Construct Jones vector
        Ex = Ex_amp
        Ey = Ey_amp * np.exp(1j * phase)

        return np.array([Ex, Ey], dtype=complex)

    def decompose(self):
        """
        Decompose into Polarized and Unpolarized Components
        分解为偏振和非偏振分量

        S = S_polarized + S_unpolarized

        S_polarized = DOP × S₀ × [1, s₁, s₂, s₃]ᵀ
        S_unpolarized = (1 - DOP) × S₀ × [1, 0, 0, 0]ᵀ

        Returns:
        - tuple: (S_polarized, S_unpolarized)
        """
        dop = self.dop()
        S0 = self.S[0]

        if S0 == 0:
            return (StokesVector(0, 0, 0, 0), StokesVector(0, 0, 0, 0))

        s1, s2, s3 = self.to_poincare()

        # Polarized component
        S_pol = StokesVector(
            dop * S0,
            dop * S0 * s1,
            dop * S0 * s2,
            dop * S0 * s3
        )

        # Unpolarized component
        S_unpol = StokesVector((1 - dop) * S0, 0, 0, 0)

        return (S_pol, S_unpol)

    def __add__(self, other):
        """
        Incoherent Addition of Stokes Vectors
        斯托克斯矢量的非相干叠加

        S_total = S1 + S2 (component-wise addition)

        This represents mixing of two incoherent light sources.
        这表示两个非相干光源的混合。
        """
        return StokesVector(*(self.S + other.S))

    def __mul__(self, scalar):
        """Scalar multiplication"""
        return StokesVector(*(self.S * scalar))

    def __repr__(self):
        return (f"StokesVector(S₀={self.S[0]:.3f}, S₁={self.S[1]:.3f}, "
                f"S₂={self.S[2]:.3f}, S₃={self.S[3]:.3f}, DOP={self.dop():.3f})")


class StokesVectorDemo:
    """
    Interactive Stokes Vector Demonstration
    交互式斯托克斯矢量演示

    6-panel visualization:
    1. Stokes parameter bar chart (斯托克斯参数柱状图)
    2. Poincaré sphere 3D (庞加莱球3D)
    3. Polarization ellipse (偏振椭圆)
    4. Intensity measurements (强度测量)
    5. DOP gauge (偏振度仪表)
    6. Parameters table (参数表)
    """

    def __init__(self):
        """Initialize the demonstration"""
        # Create figure with dark theme
        self.fig = plt.figure(figsize=(18, 10), facecolor='#0f172a')
        self.fig.suptitle('Stokes Vector Demonstration / 斯托克斯矢量演示',
                          fontsize=16, color='white', y=0.98)

        # Create subplots
        self.setup_figure()

        # Initial state: Horizontal linear polarization
        self.stokes = StokesVector(1.0, 1.0, 0.0, 0.0)

        # Create UI controls
        self.setup_controls()

        # Initial update
        self.update(None)

    def setup_figure(self):
        """Create subplot layout"""
        gs = self.fig.add_gridspec(3, 4, hspace=0.4, wspace=0.3,
                                   left=0.08, right=0.95, top=0.93, bottom=0.20)

        # 1. Stokes parameter bars (top left)
        self.ax_bars = self.fig.add_subplot(gs[0, :2])
        self.ax_bars.set_facecolor('#0f172a')
        self.ax_bars.set_title('Stokes Parameters / 斯托克斯参数',
                               color='white', fontsize=12)

        # 2. Poincaré sphere (top middle-right, 3D)
        self.ax_poincare = self.fig.add_subplot(gs[0, 2], projection='3d')
        self.ax_poincare.set_facecolor('#0f172a')
        self.ax_poincare.set_title('Poincaré Sphere / 庞加莱球',
                                   color='white', fontsize=12)

        # 3. Polarization ellipse (top right)
        self.ax_ellipse = self.fig.add_subplot(gs[0, 3])
        self.ax_ellipse.set_facecolor('#0f172a')
        self.ax_ellipse.set_title('Polarization Ellipse / 偏振椭圆',
                                  color='white', fontsize=12)
        self.ax_ellipse.set_aspect('equal')

        # 4. Intensity measurements (middle left)
        self.ax_intensity = self.fig.add_subplot(gs[1, :2])
        self.ax_intensity.set_facecolor('#0f172a')
        self.ax_intensity.set_title('Intensity Measurements / 强度测量',
                                    color='white', fontsize=12)

        # 5. DOP gauge (middle right)
        self.ax_dop = self.fig.add_subplot(gs[1, 2:])
        self.ax_dop.set_facecolor('#0f172a')
        self.ax_dop.set_title('Degree of Polarization / 偏振度',
                             color='white', fontsize=12)

        # 6. Parameters table (bottom)
        self.ax_params = self.fig.add_subplot(gs[2, :])
        self.ax_params.set_facecolor('#0f172a')
        self.ax_params.set_title('Parameters / 参数',
                                 color='white', fontsize=12)
        self.ax_params.axis('off')

    def setup_controls(self):
        """Create interactive sliders and buttons"""
        # Slider: S₁ (H-V)
        ax_s1 = plt.axes([0.15, 0.14, 0.25, 0.02], facecolor='#1e293b')
        self.slider_s1 = Slider(ax_s1, 'S₁ (H-V)', -1, 1, valinit=1, valstep=0.01,
                                color='#22d3ee')
        self.slider_s1.label.set_color('white')
        self.slider_s1.valtext.set_color('white')
        self.slider_s1.on_changed(self.update)

        # Slider: S₂ (±45°)
        ax_s2 = plt.axes([0.15, 0.10, 0.25, 0.02], facecolor='#1e293b')
        self.slider_s2 = Slider(ax_s2, 'S₂ (±45°)', -1, 1, valinit=0, valstep=0.01,
                                color='#f472b6')
        self.slider_s2.label.set_color('white')
        self.slider_s2.valtext.set_color('white')
        self.slider_s2.on_changed(self.update)

        # Slider: S₃ (R-L)
        ax_s3 = plt.axes([0.15, 0.06, 0.25, 0.02], facecolor='#1e293b')
        self.slider_s3 = Slider(ax_s3, 'S₃ (R-L)', -1, 1, valinit=0, valstep=0.01,
                                color='#a78bfa')
        self.slider_s3.label.set_color('white')
        self.slider_s3.valtext.set_color('white')
        self.slider_s3.on_changed(self.update)

        # Slider: DOP
        ax_dop = plt.axes([0.15, 0.02, 0.25, 0.02], facecolor='#1e293b')
        self.slider_dop = Slider(ax_dop, 'DOP', 0, 1, valinit=1, valstep=0.01,
                                 color='#10b981')
        self.slider_dop.label.set_color('white')
        self.slider_dop.valtext.set_color('white')
        self.slider_dop.on_changed(self.update)

        # Radio buttons: Preset states
        ax_radio = plt.axes([0.52, 0.02, 0.15, 0.14], facecolor='#1e293b')
        self.radio = RadioButtons(ax_radio,
            ('Horizontal', 'Vertical', '+45°', 'Right Circ', 'Unpolarized'),
            active=0)
        for label in self.radio.labels:
            label.set_color('white')
            label.set_fontsize(10)
        self.radio.on_clicked(self.set_preset)

        # Button: Reset
        ax_reset = plt.axes([0.75, 0.08, 0.08, 0.04])
        self.btn_reset = Button(ax_reset, 'Reset', color='#1e293b',
                                hovercolor='#334155')
        self.btn_reset.label.set_color('white')
        self.btn_reset.on_clicked(self.reset)

    def set_preset(self, label):
        """Set preset polarization states"""
        presets = {
            'Horizontal': (1, 0, 0, 1),      # S = [1, 1, 0, 0]
            'Vertical': (-1, 0, 0, 1),       # S = [1, -1, 0, 0]
            '+45°': (0, 1, 0, 1),            # S = [1, 0, 1, 0]
            'Right Circ': (0, 0, -1, 1),     # S = [1, 0, 0, -1]
            'Unpolarized': (0, 0, 0, 0),     # S = [1, 0, 0, 0]
        }

        if label in presets:
            s1, s2, s3, dop = presets[label]
            self.slider_s1.set_val(s1)
            self.slider_s2.set_val(s2)
            self.slider_s3.set_val(s3)
            self.slider_dop.set_val(dop)

    def update(self, val):
        """Update all visualizations"""
        # Get slider values
        s1 = self.slider_s1.val
        s2 = self.slider_s2.val
        s3 = self.slider_s3.val
        dop = self.slider_dop.val

        # Construct Stokes vector with DOP constraint
        # Scale s1, s2, s3 to have magnitude = dop
        magnitude = np.sqrt(s1**2 + s2**2 + s3**2)
        if magnitude > 1e-10:
            scale = dop / magnitude
            S1 = s1 * scale
            S2 = s2 * scale
            S3 = s3 * scale
        else:
            S1, S2, S3 = 0, 0, 0

        try:
            self.stokes = StokesVector(1.0, S1, S2, S3)
        except ValueError as e:
            # Invalid state, skip update
            return

        # Clear all axes
        self.ax_bars.clear()
        self.ax_poincare.clear()
        self.ax_ellipse.clear()
        self.ax_intensity.clear()
        self.ax_dop.clear()
        self.ax_params.clear()

        # Update visualizations
        self.plot_stokes_bars()
        self.plot_poincare_sphere()
        self.plot_ellipse()
        self.plot_intensities()
        self.plot_dop_gauge()
        self.display_parameters()

        # Redraw
        self.fig.canvas.draw_idle()

    def plot_stokes_bars(self):
        """Bar chart of S₀, S₁, S₂, S₃"""
        S = self.stokes.S

        # Bar positions
        labels = ['S₀', 'S₁', 'S₂', 'S₃']
        colors = ['#22d3ee', '#ef4444', '#f59e0b', '#a78bfa']

        # Plot bars
        bars = self.ax_bars.bar(labels, S, color=colors, alpha=0.8, edgecolor='white')

        # Add value labels on bars
        for bar, val in zip(bars, S):
            height = bar.get_height()
            self.ax_bars.text(bar.get_x() + bar.get_width()/2, height,
                             f'{val:.3f}', ha='center', va='bottom' if height >= 0 else 'top',
                             color='white', fontsize=11)

        # Styling
        self.ax_bars.set_ylabel('Value', color='white', fontsize=11)
        self.ax_bars.set_ylim(-1.2, 1.2)
        self.ax_bars.axhline(0, color='white', linewidth=0.5, alpha=0.3)
        self.ax_bars.grid(True, alpha=0.2, color='white')
        self.ax_bars.tick_params(colors='white', labelsize=10)
        self.ax_bars.set_title('Stokes Parameters / 斯托克斯参数', color='white', fontsize=12)

    def plot_poincare_sphere(self):
        """3D Poincaré sphere with state"""
        # Draw unit sphere
        u = np.linspace(0, 2 * np.pi, 40)
        v = np.linspace(0, np.pi, 40)
        x_sphere = np.outer(np.cos(u), np.sin(v))
        y_sphere = np.outer(np.sin(u), np.sin(v))
        z_sphere = np.outer(np.ones(np.size(u)), np.cos(v))

        self.ax_poincare.plot_surface(x_sphere, y_sphere, z_sphere,
                                      color='cyan', alpha=0.1, linewidth=0)

        # Draw axes
        axis_length = 1.3
        self.ax_poincare.plot([-axis_length, axis_length], [0, 0], [0, 0],
                             'r-', linewidth=2, alpha=0.6, label='S₁ (H-V)')
        self.ax_poincare.plot([0, 0], [-axis_length, axis_length], [0, 0],
                             'g-', linewidth=2, alpha=0.6, label='S₂ (±45°)')
        self.ax_poincare.plot([0, 0], [0, 0], [-axis_length, axis_length],
                             'b-', linewidth=2, alpha=0.6, label='S₃ (R-L)')

        # Labels
        self.ax_poincare.text(axis_length, 0, 0, 'H', color='red', fontsize=11)
        self.ax_poincare.text(-axis_length, 0, 0, 'V', color='red', fontsize=11)
        self.ax_poincare.text(0, axis_length, 0, '+45°', color='green', fontsize=11)
        self.ax_poincare.text(0, -axis_length, 0, '-45°', color='green', fontsize=11)
        self.ax_poincare.text(0, 0, axis_length, 'L', color='blue', fontsize=11)
        self.ax_poincare.text(0, 0, -axis_length, 'R', color='blue', fontsize=11)

        # Plot current state
        s1, s2, s3 = self.stokes.to_poincare()
        self.ax_poincare.scatter([s1], [s2], [s3], c='#ff4444', s=200,
                                marker='o', edgecolors='white', linewidths=2,
                                label='Current State')

        # Draw line from origin to state (showing DOP)
        self.ax_poincare.plot([0, s1], [0, s2], [0, s3], 'w--', linewidth=2, alpha=0.6)

        # Set view
        self.ax_poincare.set_xlim(-1.5, 1.5)
        self.ax_poincare.set_ylim(-1.5, 1.5)
        self.ax_poincare.set_zlim(-1.5, 1.5)
        self.ax_poincare.set_xlabel('S₁', color='white', fontsize=10)
        self.ax_poincare.set_ylabel('S₂', color='white', fontsize=10)
        self.ax_poincare.set_zlabel('S₃', color='white', fontsize=10)
        self.ax_poincare.tick_params(colors='white', labelsize=8)

        # Dark background
        self.ax_poincare.xaxis.pane.fill = False
        self.ax_poincare.yaxis.pane.fill = False
        self.ax_poincare.zaxis.pane.fill = False
        self.ax_poincare.xaxis.pane.set_edgecolor('white')
        self.ax_poincare.yaxis.pane.set_edgecolor('white')
        self.ax_poincare.zaxis.pane.set_edgecolor('white')
        self.ax_poincare.xaxis.pane.set_alpha(0.1)
        self.ax_poincare.yaxis.pane.set_alpha(0.1)
        self.ax_poincare.zaxis.pane.set_alpha(0.1)

        self.ax_poincare.set_title('Poincaré Sphere / 庞加莱球', color='white', fontsize=12)

    def plot_ellipse(self):
        """2D polarization ellipse"""
        a, b, psi_deg, chi_deg, handedness = self.stokes.ellipse_parameters()

        # Set limits
        self.ax_ellipse.set_xlim(-1.2, 1.2)
        self.ax_ellipse.set_ylim(-1.2, 1.2)
        self.ax_ellipse.set_aspect('equal')
        self.ax_ellipse.grid(True, alpha=0.2, color='white')

        dop = self.stokes.dop()

        if dop < 0.01:
            # Unpolarized - draw circle
            circle = Circle((0, 0), 0.3, edgecolor='gray', facecolor='none',
                          linewidth=2, linestyle='--', alpha=0.5)
            self.ax_ellipse.add_patch(circle)
            self.ax_ellipse.text(0, 0, 'Unpolarized\n非偏振', ha='center', va='center',
                                color='white', fontsize=11)
        elif abs(chi_deg) < 0.1:
            # Linear polarization - draw line
            x_line = [-dop * np.cos(np.radians(psi_deg)),
                      dop * np.cos(np.radians(psi_deg))]
            y_line = [-dop * np.sin(np.radians(psi_deg)),
                      dop * np.sin(np.radians(psi_deg))]
            self.ax_ellipse.plot(x_line, y_line, 'o-', color='#22d3ee',
                                linewidth=3, markersize=8)
        else:
            # Elliptical/circular polarization
            # Scale by DOP
            ellipse = Ellipse((0, 0), 2*a*dop, 2*b*dop, angle=psi_deg,
                            edgecolor='#22d3ee', facecolor='none', linewidth=2.5)
            self.ax_ellipse.add_patch(ellipse)

            # Draw rotation direction arrow
            t = np.linspace(0, 2*np.pi, 100)
            if handedness == 'right':
                t = t[::-1]  # Reverse for right-handed

            x_ell = a * dop * np.cos(t) * np.cos(np.radians(psi_deg)) - \
                    b * dop * np.sin(t) * np.sin(np.radians(psi_deg))
            y_ell = a * dop * np.cos(t) * np.sin(np.radians(psi_deg)) + \
                    b * dop * np.sin(t) * np.cos(np.radians(psi_deg))

            # Arrow
            arrow_idx = 25
            self.ax_ellipse.annotate('', xy=(x_ell[arrow_idx], y_ell[arrow_idx]),
                                    xytext=(x_ell[arrow_idx-5], y_ell[arrow_idx-5]),
                                    arrowprops=dict(arrowstyle='->', color='#f472b6', lw=2))

        # Labels
        self.ax_ellipse.set_xlabel('Ex', color='white', fontsize=10)
        self.ax_ellipse.set_ylabel('Ey', color='white', fontsize=10)
        self.ax_ellipse.tick_params(colors='white', labelsize=9)

        # Info text
        info_text = f'ψ = {psi_deg:.1f}°\nχ = {chi_deg:.1f}°\n{handedness.upper()}'
        self.ax_ellipse.text(0.05, 0.95, info_text, transform=self.ax_ellipse.transAxes,
                            fontsize=10, color='white', va='top',
                            bbox=dict(boxstyle='round', facecolor='#1e293b', alpha=0.8))

        self.ax_ellipse.set_title('Polarization Ellipse / 偏振椭圆', color='white', fontsize=12)

    def plot_intensities(self):
        """6 intensity measurements"""
        S = self.stokes.S

        # Calculate intensities
        I_H = (S[0] + S[1]) / 2
        I_V = (S[0] - S[1]) / 2
        I_45 = (S[0] + S[2]) / 2
        I_m45 = (S[0] - S[2]) / 2
        I_R = (S[0] - S[3]) / 2
        I_L = (S[0] + S[3]) / 2

        intensities = [I_H, I_V, I_45, I_m45, I_R, I_L]
        labels = ['I_H', 'I_V', 'I_+45', 'I_-45', 'I_R', 'I_L']
        colors = ['#22d3ee', '#3b82f6', '#f59e0b', '#eab308', '#a78bfa', '#c084fc']

        # Plot bars
        bars = self.ax_intensity.bar(labels, intensities, color=colors, alpha=0.8,
                                     edgecolor='white')

        # Add value labels
        for bar, val in zip(bars, intensities):
            height = bar.get_height()
            self.ax_intensity.text(bar.get_x() + bar.get_width()/2, height,
                                  f'{val:.3f}', ha='center', va='bottom',
                                  color='white', fontsize=10)

        # Styling
        self.ax_intensity.set_ylabel('Intensity', color='white', fontsize=11)
        self.ax_intensity.set_ylim(0, 1.2)
        self.ax_intensity.grid(True, alpha=0.2, color='white', axis='y')
        self.ax_intensity.tick_params(colors='white', labelsize=10)
        self.ax_intensity.set_title('Intensity Measurements / 强度测量', color='white', fontsize=12)

    def plot_dop_gauge(self):
        """DOP radial gauge"""
        dop = self.stokes.dop()

        # Create gauge
        self.ax_dop.axis('off')
        self.ax_dop.set_xlim(-1.2, 1.2)
        self.ax_dop.set_ylim(-0.5, 1.2)

        # Draw arc (gauge background)
        theta = np.linspace(0, np.pi, 100)
        x_arc = np.cos(theta)
        y_arc = np.sin(theta)
        self.ax_dop.plot(x_arc, y_arc, 'w-', linewidth=3, alpha=0.3)

        # Draw filled arc (DOP value)
        theta_fill = np.linspace(0, dop * np.pi, 100)
        x_fill = np.cos(theta_fill)
        y_fill = np.sin(theta_fill)

        # Color based on DOP
        if dop < 0.33:
            color = '#ef4444'  # Red (low)
        elif dop < 0.67:
            color = '#eab308'  # Yellow (medium)
        else:
            color = '#10b981'  # Green (high)

        self.ax_dop.plot(x_fill, y_fill, '-', color=color, linewidth=8, alpha=0.8)

        # Add DOP value text
        self.ax_dop.text(0, 0.5, f'{dop:.3f}', ha='center', va='center',
                        color='white', fontsize=32, weight='bold')

        self.ax_dop.text(0, -0.2, f'DOP = {dop*100:.1f}%', ha='center',
                        color='white', fontsize=14)

        # Labels
        self.ax_dop.text(-1.1, 0, '0', color='white', fontsize=11, ha='right')
        self.ax_dop.text(1.1, 0, '1', color='white', fontsize=11, ha='left')
        self.ax_dop.text(0, 1.1, 'Fully\nPolarized', color='white',
                        fontsize=10, ha='center')

        self.ax_dop.set_title('Degree of Polarization / 偏振度', color='white', fontsize=12)

    def display_parameters(self):
        """Parameters table"""
        self.ax_params.axis('off')

        S = self.stokes.S
        dop = self.stokes.dop()
        s1, s2, s3 = self.stokes.to_poincare()
        a, b, psi, chi, hand = self.stokes.ellipse_parameters()

        # Decompose into polarized and unpolarized
        S_pol, S_unpol = self.stokes.decompose()

        info_text = f"""
STOKES VECTOR (斯托克斯矢量):
  S = [S₀={S[0]:.4f}, S₁={S[1]:.4f}, S₂={S[2]:.4f}, S₃={S[3]:.4f}]ᵀ

DEGREE OF POLARIZATION (偏振度):
  DOP = √(S₁² + S₂² + S₃²) / S₀ = {dop:.4f} ({dop*100:.2f}%)

POINCARÉ COORDINATES (庞加莱坐标):
  (s₁, s₂, s₃) = ({s1:.4f}, {s2:.4f}, {s3:.4f})
  Radius from origin: r = {dop:.4f}

ELLIPSE PARAMETERS (椭圆参数):
  Semi-major axis a = {a:.4f}
  Semi-minor axis b = {b:.4f}
  Orientation angle ψ = {psi:.2f}°
  Ellipticity angle χ = {chi:.2f}°
  Handedness: {hand.upper()}

DECOMPOSITION (分解):
  Polarized component: S_pol = [{S_pol.S[0]:.4f}, {S_pol.S[1]:.4f}, {S_pol.S[2]:.4f}, {S_pol.S[3]:.4f}]ᵀ
  Unpolarized component: S_unpol = [{S_unpol.S[0]:.4f}, {S_unpol.S[1]:.4f}, {S_unpol.S[2]:.4f}, {S_unpol.S[3]:.4f}]ᵀ
        """

        self.ax_params.text(0.05, 0.95, info_text, transform=self.ax_params.transAxes,
                           fontsize=10, color='white', va='top', family='monospace',
                           bbox=dict(boxstyle='round', facecolor='#1e293b', alpha=0.9))

    def reset(self, event):
        """Reset all parameters to defaults"""
        self.slider_s1.reset()
        self.slider_s2.reset()
        self.slider_s3.reset()
        self.slider_dop.reset()
        self.radio.set_active(0)


def main():
    """Main function to run the demonstration"""
    print("="*70)
    print("Stokes Vector Demonstration / 斯托克斯矢量演示")
    print("="*70)
    print("\nPhysics Principle (物理原理):")
    print("Stokes parameters describe any polarization state:")
    print("  S = [S₀, S₁, S₂, S₃]ᵀ")
    print("  • S₀: Total intensity (总光强)")
    print("  • S₁: H-V difference (水平-垂直差)")
    print("  • S₂: ±45° difference (±45°差)")
    print("  • S₃: R-L difference (右旋-左旋差)")
    print("\nDegree of Polarization (偏振度):")
    print("  DOP = √(S₁² + S₂² + S₃²) / S₀")
    print("  DOP = 1: Fully polarized")
    print("  DOP = 0: Unpolarized")
    print("  0 < DOP < 1: Partially polarized")
    print("\nInteractive Controls (交互控制):")
    print("  1. S₁ slider - Horizontal vs Vertical preference")
    print("  2. S₂ slider - +45° vs -45° preference")
    print("  3. S₃ slider - Right vs Left circular preference")
    print("  4. DOP slider - Degree of polarization")
    print("  5. Preset buttons - Common polarization states")
    print("  6. Reset button - Return to default")
    print("\nVisualizations (可视化):")
    print("  • Stokes parameter bar chart")
    print("  • Poincaré sphere (3D)")
    print("  • Polarization ellipse")
    print("  • Intensity measurements")
    print("  • DOP gauge")
    print("  • Parameters table")
    print("\n" + "="*70)
    print("Author: PolarCraft Team")
    print("Date: 2026-01-14")
    print("="*70 + "\n")

    # Create and show demonstration
    demo = StokesVectorDemo()
    plt.show()


if __name__ == '__main__':
    main()
