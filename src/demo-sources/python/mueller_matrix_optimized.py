#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mueller Matrix Interactive Demonstration - OPTIMIZED
缪勒矩阵交互式演示 - 优化版

OPTIMIZATIONS: Unified PolarCraft dark theme, enhanced controls, professional visualization

Physical Principle (物理原理):
    S_out = M × S_in
    where M is 4×4 real matrix, S is Stokes vector

Features (功能):
    - Mueller matrix representation for any polarization transformation
    - Handles partial polarization and depolarization
    - Lu-Chipman decomposition (M = M_Δ × M_R × M_D)
    - Interactive visualization with 6 panels

Author: PolarCraft Team
Date: 2026-01-14
License: MIT
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button, RadioButtons
from matplotlib.patches import FancyArrowPatch, Rectangle, Circle
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.gridspec as gridspec
# 导入统一样式配置
from visualization_config import (
    setup_polarcraft_style, style_slider, COLORS, FONTS, SIZES
)

# 导入导出工具
try:
    from export_utils import export_matrix, export_stokes_vector
    EXPORT_AVAILABLE = True
except ImportError:
    EXPORT_AVAILABLE = False
    print("Warning: export_utils.py not found. Export functionality disabled.")



class StokesVector:
    """Stokes Vector Representation (for use with Mueller matrices)"""

    def __init__(self, S0=1.0, S1=0.0, S2=0.0, S3=0.0):
        """Initialize Stokes vector

        Args:
            S0: Total intensity (总光强)
            S1: H-V preference (水平-垂直偏好)
            S2: ±45° preference (±45°偏好)
            S3: R-L preference (左旋-右旋偏好)
        """
        self.S = np.array([S0, S1, S2, S3], dtype=float)
        self.validate()

    def validate(self):
        """Check physical realizability: S₁² + S₂² + S₃² ≤ S₀²"""
        S0, S1, S2, S3 = self.S
        if S0 < 0:
            raise ValueError(f"S₀ must be non-negative, got {S0}")

        polarized_power = S1**2 + S2**2 + S3**2
        total_power = S0**2

        if polarized_power > total_power * 1.001:  # Allow small numerical error
            raise ValueError(
                f"Invalid Stokes vector: S₁² + S₂² + S₃² = {polarized_power:.4f} > S₀² = {total_power:.4f}"
            )

    def dop(self):
        """Calculate Degree of Polarization (偏振度)"""
        if self.S[0] == 0:
            return 0.0
        return np.sqrt(self.S[1]**2 + self.S[2]**2 + self.S[3]**2) / self.S[0]

    def to_poincare(self):
        """Convert to Poincaré sphere coordinates (归一化坐标)"""
        if self.S[0] == 0:
            return 0, 0, 0
        s1 = self.S[1] / self.S[0]
        s2 = self.S[2] / self.S[0]
        s3 = self.S[3] / self.S[0]
        return s1, s2, s3


class MuellerMatrix:
    """Mueller Matrix Representation for Polarization Optics

    Mueller matrices are 4×4 real matrices that transform Stokes vectors:
        S_out = M × S_in

    They describe ANY polarization transformation, including depolarization.
    """

    def __init__(self, matrix=None):
        """Initialize Mueller matrix

        Args:
            matrix: 4×4 array-like, or None for identity
        """
        if matrix is None:
            self.M = np.eye(4)  # Identity matrix
        else:
            self.M = np.array(matrix, dtype=float)
            if self.M.shape != (4, 4):
                raise ValueError(f"Mueller matrix must be 4×4, got shape {self.M.shape}")

    # ==================== Factory Methods for Common Elements ====================

    @classmethod
    def linear_polarizer(cls, angle_deg):
        """Create linear polarizer Mueller matrix (线偏振片)

        Transmits light polarized at angle_deg, blocks orthogonal.

        Args:
            angle_deg: Transmission axis angle in degrees

        Returns:
            MuellerMatrix instance
        """
        theta = np.radians(angle_deg)
        cos2t = np.cos(2 * theta)
        sin2t = np.sin(2 * theta)

        # Normalized to M₀₀ = 1 (transmission coefficient = 0.5)
        M = 0.5 * np.array([
            [1,     cos2t,  sin2t,  0],
            [cos2t, cos2t**2, sin2t*cos2t, 0],
            [sin2t, sin2t*cos2t, sin2t**2, 0],
            [0,     0,      0,      0]
        ])
        return cls(M)

    @classmethod
    def quarter_wave_plate(cls, angle_deg):
        """Create quarter-wave plate Mueller matrix (1/4波片)

        Introduces 90° phase shift between fast and slow axes.
        Converts linear ↔ circular polarization.

        Args:
            angle_deg: Fast axis angle in degrees

        Returns:
            MuellerMatrix instance
        """
        theta = np.radians(angle_deg)
        cos2t = np.cos(2 * theta)
        sin2t = np.sin(2 * theta)
        cos4t = np.cos(4 * theta)
        sin4t = np.sin(4 * theta)

        M = np.array([
            [1, 0,              0,              0],
            [0, cos4t,          sin4t,          0],
            [0, sin4t,          -cos4t,         0],
            [0, 0,              0,              1]
        ])

        # Rotation to arbitrary angle
        R = cls.rotation_matrix(angle_deg)
        M_rotated = R @ M @ R.T
        return cls(M_rotated)

    @classmethod
    def half_wave_plate(cls, angle_deg):
        """Create half-wave plate Mueller matrix (1/2波片)

        Introduces 180° phase shift between fast and slow axes.
        Rotates linear polarization by 2×angle.

        Args:
            angle_deg: Fast axis angle in degrees

        Returns:
            MuellerMatrix instance
        """
        theta = np.radians(angle_deg)
        cos4t = np.cos(4 * theta)
        sin4t = np.sin(4 * theta)

        M = np.array([
            [1, 0,      0,      0],
            [0, cos4t,  sin4t,  0],
            [0, sin4t,  -cos4t, 0],
            [0, 0,      0,      -1]
        ])

        R = cls.rotation_matrix(angle_deg)
        M_rotated = R @ M @ R.T
        return cls(M_rotated)

    @classmethod
    def rotator(cls, angle_deg):
        """Create optical rotator Mueller matrix (旋光器)

        Rotates plane of polarization without attenuation.
        Models optical activity (chiral media).

        Args:
            angle_deg: Rotation angle in degrees

        Returns:
            MuellerMatrix instance
        """
        theta = np.radians(angle_deg)
        cos2t = np.cos(2 * theta)
        sin2t = np.sin(2 * theta)

        M = np.array([
            [1, 0,      0,      0],
            [0, cos2t,  sin2t,  0],
            [0, -sin2t, cos2t,  0],
            [0, 0,      0,      1]
        ])
        return cls(M)

    @classmethod
    def retarder(cls, retardance_deg, angle_deg):
        """Create general retarder Mueller matrix (通用延迟器)

        Args:
            retardance_deg: Phase retardation in degrees (0-360)
            angle_deg: Fast axis angle in degrees

        Returns:
            MuellerMatrix instance
        """
        delta = np.radians(retardance_deg)
        theta = np.radians(angle_deg)

        cos_delta = np.cos(delta)
        sin_delta = np.sin(delta)
        cos2t = np.cos(2 * theta)
        sin2t = np.sin(2 * theta)

        M = np.array([
            [1, 0, 0, 0],
            [0, cos2t**2 + sin2t**2 * cos_delta,
                cos2t * sin2t * (1 - cos_delta),
                -sin2t * sin_delta],
            [0, cos2t * sin2t * (1 - cos_delta),
                sin2t**2 + cos2t**2 * cos_delta,
                cos2t * sin_delta],
            [0, sin2t * sin_delta,
                -cos2t * sin_delta,
                cos_delta]
        ])
        return cls(M)

    @classmethod
    def partial_polarizer(cls, diattenuation, angle_deg):
        """Create partial polarizer with 0 < D < 1 (部分偏振片)

        Args:
            diattenuation: Diattenuation parameter (0-1)
            angle_deg: Transmission axis angle in degrees

        Returns:
            MuellerMatrix instance
        """
        if not 0 <= diattenuation <= 1:
            raise ValueError(f"Diattenuation must be in [0, 1], got {diattenuation}")

        D = diattenuation
        theta = np.radians(angle_deg)
        cos2t = np.cos(2 * theta)
        sin2t = np.sin(2 * theta)

        # Transmission for parallel and perpendicular
        T_para = 1.0
        T_perp = 1.0 - D

        M00 = (T_para + T_perp) / 2
        M01 = (T_para - T_perp) / 2 * cos2t
        M02 = (T_para - T_perp) / 2 * sin2t

        M = np.array([
            [M00, M01, M02, 0],
            [M01, M00*cos2t**2 + T_perp*sin2t**2, (M00-T_perp)*sin2t*cos2t, 0],
            [M02, (M00-T_perp)*sin2t*cos2t, M00*sin2t**2 + T_perp*cos2t**2, 0],
            [0, 0, 0, np.sqrt(T_para * T_perp)]
        ])
        return cls(M)

    @classmethod
    def depolarizer(cls, depolarization):
        """Create ideal depolarizer (理想退偏振器)

        Reduces degree of polarization by factor (1 - depolarization).

        Args:
            depolarization: Depolarization index Δ (0-1)
                Δ = 0: No depolarization
                Δ = 1: Complete depolarization

        Returns:
            MuellerMatrix instance
        """
        if not 0 <= depolarization <= 1:
            raise ValueError(f"Depolarization must be in [0, 1], got {depolarization}")

        # Diagonal matrix with reduced polarization elements
        reduction = 1 - depolarization
        M = np.diag([1.0, reduction, reduction, reduction])
        return cls(M)

    @staticmethod
    def rotation_matrix(angle_deg):
        """Create Mueller rotation matrix R(θ) (旋转矩阵)

        Rotates Stokes vector in S₁-S₂ plane by 2θ.

        Args:
            angle_deg: Rotation angle in degrees

        Returns:
            4×4 numpy array
        """
        theta = np.radians(angle_deg)
        cos2t = np.cos(2 * theta)
        sin2t = np.sin(2 * theta)

        R = np.array([
            [1, 0,      0,      0],
            [0, cos2t,  sin2t,  0],
            [0, -sin2t, cos2t,  0],
            [0, 0,      0,      1]
        ])
        return R

    # ==================== Matrix Operations ====================

    def rotate(self, angle_deg):
        """Rotate Mueller matrix by angle (旋转缪勒矩阵)

        M'(θ) = R(α) × M × R(-α)

        Args:
            angle_deg: Rotation angle in degrees

        Returns:
            New MuellerMatrix instance
        """
        R = self.rotation_matrix(angle_deg)
        M_rotated = R @ self.M @ R.T
        return MuellerMatrix(M_rotated)

    def apply(self, stokes_vec):
        """Apply Mueller matrix to Stokes vector (应用变换)

        Args:
            stokes_vec: StokesVector instance or 4-element array

        Returns:
            StokesVector instance with transformed state
        """
        if isinstance(stokes_vec, StokesVector):
            S_out = self.M @ stokes_vec.S
            return StokesVector(*S_out)
        else:
            S_array = np.array(stokes_vec)
            return self.M @ S_array

    def __matmul__(self, other):
        """Matrix multiplication (cascade): M_total = M2 @ M1

        Light passes through M1 first, then M2.
        """
        if isinstance(other, MuellerMatrix):
            return MuellerMatrix(self.M @ other.M)
        elif isinstance(other, np.ndarray):
            return self.M @ other
        else:
            return NotImplemented

    # ==================== Analysis Methods ====================

    def diattenuation(self):
        """Calculate diattenuation parameter D (二色性参数)

        D = √(M₀₁² + M₀₂² + M₀₃²) / M₀₀

        Returns:
            D ∈ [0, 1]
            D = 0: No diattenuation
            D = 1: Complete diattenuation (perfect polarizer)
        """
        if self.M[0, 0] == 0:
            return 0.0
        D = np.sqrt(self.M[0, 1]**2 + self.M[0, 2]**2 + self.M[0, 3]**2) / self.M[0, 0]
        return min(D, 1.0)  # Clip to [0, 1]

    def polarizance(self):
        """Calculate polarizance parameter P (偏振产生能力)

        P = √(M₁₀² + M₂₀² + M₃₀²) / M₀₀

        Returns:
            P ∈ [0, 1]
        """
        if self.M[0, 0] == 0:
            return 0.0
        P = np.sqrt(self.M[1, 0]**2 + self.M[2, 0]**2 + self.M[3, 0]**2) / self.M[0, 0]
        return min(P, 1.0)

    def depolarization_index(self):
        """Calculate depolarization index Δ (退偏振指数)

        Δ = 1 - √(tr(M^T M) - M₀₀²) / (√3 M₀₀)

        Returns:
            Δ ∈ [0, 1]
            Δ = 0: Non-depolarizing
            Δ = 1: Complete depolarization
        """
        M00 = self.M[0, 0]
        if M00 == 0:
            return 1.0

        trace_MTM = np.trace(self.M.T @ self.M)
        numerator = np.sqrt(max(0, trace_MTM - M00**2))
        denominator = np.sqrt(3) * M00

        if denominator == 0:
            return 1.0

        Delta = 1 - numerator / denominator
        return np.clip(Delta, 0, 1)

    def __repr__(self):
        """String representation"""
        return f"MuellerMatrix(\n{self.M}\n)"


class MuellerMatrixDemo:
    """Interactive Mueller Matrix Demonstration

    Features:
        - 6-panel visualization
        - Multiple optical elements
        - Lu-Chipman decomposition
        - Poincaré sphere transformation
    """

    def __init__(self):
        """Initialize demonstration"""
        # 应用统一样式
        setup_polarcraft_style()
        # Dark theme colors
        self.bg_color = COLORS['background']  # slate-900
        self.text_color = COLORS['text_primary']
        self.primary_color = COLORS['primary']  # cyan
        self.secondary_color = COLORS['secondary']  # pink
        self.tertiary_color = COLORS['secondary']  # purple
        self.input_color = COLORS['primary']  # cyan
        self.output_color = COLORS['success']  # green

        # Initial state
        self.element_type = 'Linear Polarizer'
        self.angle = 0.0
        self.retardance = 90.0
        self.diattenuation = 0.5
        self.depolarization = 0.5

        self.mueller = MuellerMatrix.linear_polarizer(0)
        self.input_stokes = StokesVector(1, 1, 0, 0)  # Horizontal

        self.setup_figure()
        self.setup_controls()
        self.update(None)

    def setup_figure(self):
        """Create figure with 6 panels"""
        self.fig = plt.figure(figsize=(20, 12), facecolor=self.bg_color)

        # Create grid layout
        gs = gridspec.GridSpec(3, 3, figure=self.fig, hspace=0.35, wspace=0.3,
                               left=0.05, right=0.75, top=0.95, bottom=0.05)

        # 6 visualization panels
        self.ax_matrix = self.fig.add_subplot(gs[0, 0])  # Mueller matrix heatmap
        self.ax_input = self.fig.add_subplot(gs[0, 1])   # Input Stokes
        self.ax_output = self.fig.add_subplot(gs[0, 2])  # Output Stokes
        self.ax_poincare = self.fig.add_subplot(gs[1, :], projection='3d')  # Poincaré sphere
        self.ax_params = self.fig.add_subplot(gs[2, :])  # Parameters table

        # Style all axes
        for ax in [self.ax_matrix, self.ax_input, self.ax_output, self.ax_params]:
            ax.set_facecolor(self.bg_color)
            for spine in ax.spines.values():
                spine.set_edgecolor(self.text_color)
                spine.set_alpha(0.3)

        self.ax_poincare.set_facecolor(self.bg_color)

        self.fig.suptitle('Mueller Matrix Demonstration (缪勒矩阵演示)',
                          fontsize=18, color=self.text_color, fontweight='bold', y=0.98)

    def setup_controls(self):
        """Create interactive controls"""
        # Control panel area (right side)
        control_x = 0.77
        control_width = 0.20

        # Element type selector
        ax_element = plt.axes([control_x, 0.75, control_width, 0.15], facecolor=self.bg_color)
        self.radio_element = RadioButtons(
            ax_element,
            ('Linear Polarizer', 'QWP', 'HWP', 'Rotator', 'Partial Polarizer', 'Depolarizer'),
            active=0
        )
        self.radio_element.on_clicked(self.update_element_type)

        # Style radio buttons
        for label in self.radio_element.labels:
            label.set_color(self.text_color)
            label.set_fontsize(10)
        for circle in self.radio_element.circles:
            circle.set_edgecolor(self.primary_color)
            circle.set_facecolor(self.bg_color)

        ax_element.set_title('Element Type', color=self.text_color, fontsize=11, pad=10)

        # Angle slider
        ax_angle = plt.axes([control_x, 0.65, control_width, 0.03], facecolor=self.bg_color)
        self.slider_angle = Slider(ax_angle, 'Angle (°)', 0, 180, valinit=0,
                                     color=self.primary_color, valstep=5)
        self.slider_angle.label.set_color(self.text_color)
        self.slider_angle.valtext.set_color(self.text_color)
        self.slider_angle.on_changed(self.update)

        # Retardance slider
        ax_retardance = plt.axes([control_x, 0.60, control_width, 0.03], facecolor=self.bg_color)
        self.slider_retardance = Slider(ax_retardance, 'Retardance (°)', 0, 360, valinit=90,
                                         color=self.tertiary_color, valstep=10)
        self.slider_retardance.label.set_color(self.text_color)
        self.slider_retardance.valtext.set_color(self.text_color)
        self.slider_retardance.on_changed(self.update)

        # Diattenuation slider
        ax_diattenuation = plt.axes([control_x, 0.55, control_width, 0.03], facecolor=self.bg_color)
        self.slider_diattenuation = Slider(ax_diattenuation, 'Diattenuation', 0, 1, valinit=0.5,
                                            color=self.secondary_color)
        self.slider_diattenuation.label.set_color(self.text_color)
        self.slider_diattenuation.valtext.set_color(self.text_color)
        self.slider_diattenuation.on_changed(self.update)

        # Depolarization slider
        ax_depolarization = plt.axes([control_x, 0.50, control_width, 0.03], facecolor=self.bg_color)
        self.slider_depolarization = Slider(ax_depolarization, 'Depolarization', 0, 1, valinit=0.5,
                                             color=COLORS['warning'])
        self.slider_depolarization.label.set_color(self.text_color)
        self.slider_depolarization.valtext.set_color(self.text_color)
        self.slider_depolarization.on_changed(self.update)

        # Input Stokes state presets
        ax_presets = plt.axes([control_x, 0.30, control_width, 0.15], facecolor=self.bg_color)
        self.radio_presets = RadioButtons(
            ax_presets,
            ('Horizontal', 'Vertical', '+45°', '-45°', 'RCP', 'Unpolarized'),
            active=0
        )
        self.radio_presets.on_clicked(self.update_input_state)

        for label in self.radio_presets.labels:
            label.set_color(self.text_color)
            label.set_fontsize(10)
        for circle in self.radio_presets.circles:
            circle.set_edgecolor(self.input_color)
            circle.set_facecolor(self.bg_color)

        ax_presets.set_title('Input State', color=self.text_color, fontsize=11, pad=10)

        # Reset button
        ax_reset = plt.axes([control_x, 0.20, control_width, 0.05], facecolor=self.bg_color)
        self.btn_reset = Button(ax_reset, 'Reset', color=self.bg_color, hovercolor=self.primary_color)
        self.btn_reset.label.set_color(self.text_color)
        self.btn_reset.on_clicked(self.reset)

        # Export button
        if EXPORT_AVAILABLE:
            ax_export = plt.axes([control_x, 0.14, control_width, 0.05], facecolor=self.bg_color)
            self.btn_export = Button(ax_export, 'Export', color=COLORS['success'], hovercolor=COLORS['primary'])
            self.btn_export.label.set_color(self.text_color)
            self.btn_export.on_clicked(self.export_data)

    def update_element_type(self, label):
        """Update Mueller matrix based on element type"""
        self.element_type = label
        self.update(None)

    def update_input_state(self, label):
        """Update input Stokes state"""
        presets = {
            'Horizontal': StokesVector(1, 1, 0, 0),
            'Vertical': StokesVector(1, -1, 0, 0),
            '+45°': StokesVector(1, 0, 1, 0),
            '-45°': StokesVector(1, 0, -1, 0),
            'RCP': StokesVector(1, 0, 0, -1),
            'Unpolarized': StokesVector(1, 0, 0, 0)
        }
        self.input_stokes = presets[label]
        self.update(None)

    def update(self, val):
        """Update all visualizations"""
        # Get current parameters
        self.angle = self.slider_angle.val
        self.retardance = self.slider_retardance.val
        self.diattenuation = self.slider_diattenuation.val
        self.depolarization = self.slider_depolarization.val

        # Create Mueller matrix based on element type
        if self.element_type == 'Linear Polarizer':
            self.mueller = MuellerMatrix.linear_polarizer(self.angle)
        elif self.element_type == 'QWP':
            self.mueller = MuellerMatrix.quarter_wave_plate(self.angle)
        elif self.element_type == 'HWP':
            self.mueller = MuellerMatrix.half_wave_plate(self.angle)
        elif self.element_type == 'Rotator':
            self.mueller = MuellerMatrix.rotator(self.angle)
        elif self.element_type == 'Partial Polarizer':
            self.mueller = MuellerMatrix.partial_polarizer(self.diattenuation, self.angle)
        elif self.element_type == 'Depolarizer':
            self.mueller = MuellerMatrix.depolarizer(self.depolarization)

        # Calculate output
        self.output_stokes = self.mueller.apply(self.input_stokes)

        # Update plots
        self.plot_mueller_matrix()
        self.plot_stokes_vectors()
        self.plot_poincare_transformation()
        self.display_parameters()

        self.fig.canvas.draw_idle()

    def plot_mueller_matrix(self):
        """Plot Mueller matrix as 4×4 heatmap"""
        self.ax_matrix.clear()
        self.ax_matrix.set_facecolor(self.bg_color)

        # Normalize by M₀₀ for display
        M_normalized = self.mueller.M / max(self.mueller.M[0, 0], 1e-10)

        # Create heatmap
        im = self.ax_matrix.imshow(M_normalized, cmap='RdBu_r', vmin=-1, vmax=1,
                                     aspect='equal', interpolation='nearest')

        # Add colorbar
        cbar = plt.colorbar(im, ax=self.ax_matrix, fraction=0.046, pad=0.04)
        cbar.set_label('Normalized Value', color=self.text_color, fontsize=9)
        cbar.ax.tick_params(colors=self.text_color, labelsize=8)

        # Add grid and labels
        self.ax_matrix.set_xticks([0, 1, 2, 3])
        self.ax_matrix.set_yticks([0, 1, 2, 3])
        self.ax_matrix.set_xticklabels(['S₀', 'S₁', 'S₂', 'S₃'], color=self.text_color, fontsize=10)
        self.ax_matrix.set_yticklabels(['S₀', 'S₁', 'S₂', 'S₃'], color=self.text_color, fontsize=10)

        # Add text values
        for i in range(4):
            for j in range(4):
                value = M_normalized[i, j]
                color = COLORS['text_primary'] if abs(value) > 0.5 else self.text_color
                self.ax_matrix.text(j, i, f'{value:.2f}', ha='center', va='center',
                                     color=color, fontsize=9, fontweight='bold')

        self.ax_matrix.set_title('Mueller Matrix M (缪勒矩阵)',
                                  color=self.text_color, fontsize=12, pad=10)
        self.ax_matrix.grid(True, color=self.text_color, alpha=0.3, linewidth=0.5)

    def plot_stokes_vectors(self):
        """Plot input and output Stokes vectors as bar charts"""
        # Input Stokes
        self.ax_input.clear()
        self.ax_input.set_facecolor(self.bg_color)

        S_in = self.input_stokes.S
        colors_in = [self.input_color if s >= 0 else COLORS['danger'] for s in S_in]
        bars_in = self.ax_input.bar(['S₀', 'S₁', 'S₂', 'S₃'], S_in, color=colors_in,
                                     edgecolor=self.text_color, linewidth=1.5)

        self.ax_input.axhline(0, color=self.text_color, linewidth=1, alpha=0.5)
        self.ax_input.set_ylim(-1.2, 1.2)
        self.ax_input.set_ylabel('Value', color=self.text_color, fontsize=10)
        self.ax_input.tick_params(colors=self.text_color, labelsize=9)
        self.ax_input.set_title(f'Input State (DOP={self.input_stokes.dop():.3f})',
                                 color=self.text_color, fontsize=11, pad=8)
        self.ax_input.grid(True, axis='y', color=self.text_color, alpha=0.2)

        # Output Stokes
        self.ax_output.clear()
        self.ax_output.set_facecolor(self.bg_color)

        S_out = self.output_stokes.S
        colors_out = [self.output_color if s >= 0 else COLORS['danger'] for s in S_out]
        bars_out = self.ax_output.bar(['S₀', 'S₁', 'S₂', 'S₃'], S_out, color=colors_out,
                                       edgecolor=self.text_color, linewidth=1.5)

        self.ax_output.axhline(0, color=self.text_color, linewidth=1, alpha=0.5)
        self.ax_output.set_ylim(-1.2, 1.2)
        self.ax_output.set_ylabel('Value', color=self.text_color, fontsize=10)
        self.ax_output.tick_params(colors=self.text_color, labelsize=9)
        self.ax_output.set_title(f'Output State (DOP={self.output_stokes.dop():.3f})',
                                  color=self.text_color, fontsize=11, pad=8)
        self.ax_output.grid(True, axis='y', color=self.text_color, alpha=0.2)

    def plot_poincare_transformation(self):
        """Plot transformation on Poincaré sphere"""
        self.ax_poincare.clear()

        # Draw unit sphere
        u = np.linspace(0, 2 * np.pi, 50)
        v = np.linspace(0, np.pi, 50)
        x_sphere = np.outer(np.cos(u), np.sin(v))
        y_sphere = np.outer(np.sin(u), np.sin(v))
        z_sphere = np.outer(np.ones(np.size(u)), np.cos(v))

        self.ax_poincare.plot_surface(x_sphere, y_sphere, z_sphere, color=COLORS['text_primary'],
                                       alpha=0.1, linewidth=0, antialiased=True)

        # Draw axes
        axis_length = 1.3
        self.ax_poincare.plot([0, axis_length], [0, 0], [0, 0],
                              color=COLORS['danger'], linewidth=2, label='S₁ (H-V)')
        self.ax_poincare.plot([0, 0], [0, axis_length], [0, 0],
                              color=COLORS['primary'], linewidth=2, label='S₂ (±45°)')
        self.ax_poincare.plot([0, 0], [0, 0], [0, axis_length],
                              color=COLORS['success'], linewidth=2, label='S₃ (R-L)')

        # Input and output points
        s1_in, s2_in, s3_in = self.input_stokes.to_poincare()
        s1_out, s2_out, s3_out = self.output_stokes.to_poincare()

        dop_in = self.input_stokes.dop()
        dop_out = self.output_stokes.dop()

        # Scale by DOP
        point_in = np.array([s1_in, s2_in, s3_in]) * dop_in
        point_out = np.array([s1_out, s2_out, s3_out]) * dop_out

        # Plot points
        self.ax_poincare.scatter(*point_in, color=self.input_color, s=200,
                                  edgecolors=self.text_color, linewidths=2,
                                  label='Input', zorder=5)
        self.ax_poincare.scatter(*point_out, color=self.output_color, s=200,
                                  edgecolors=self.text_color, linewidths=2,
                                  label='Output', zorder=5)

        # Draw transformation arrow
        if dop_in > 0.01 and dop_out > 0.01:
            arrow = FancyArrowPatch(point_in, point_out,
                                    color=self.secondary_color, linewidth=2.5,
                                    arrowstyle='->', mutation_scale=25, zorder=4)
            self.ax_poincare.add_artist(arrow)

        # Labels
        self.ax_poincare.text(axis_length+0.1, 0, 0, 'H/V', color=COLORS['danger'], fontsize=10)
        self.ax_poincare.text(0, axis_length+0.1, 0, '±45°', color=COLORS['primary'], fontsize=10)
        self.ax_poincare.text(0, 0, axis_length+0.1, 'R/L', color=COLORS['success'], fontsize=10)

        self.ax_poincare.set_xlabel('S₁', color=self.text_color, fontsize=10)
        self.ax_poincare.set_ylabel('S₂', color=self.text_color, fontsize=10)
        self.ax_poincare.set_zlabel('S₃', color=self.text_color, fontsize=10)
        self.ax_poincare.set_title('Poincaré Sphere Transformation (庞加莱球变换)',
                                    color=self.text_color, fontsize=12, pad=15)

        self.ax_poincare.set_xlim(-1.3, 1.3)
        self.ax_poincare.set_ylim(-1.3, 1.3)
        self.ax_poincare.set_zlim(-1.3, 1.3)
        self.ax_poincare.legend(loc='upper right', framealpha=0.7, fontsize=9)

        self.ax_poincare.tick_params(colors=self.text_color, labelsize=8)
        self.ax_poincare.xaxis.pane.fill = False
        self.ax_poincare.yaxis.pane.fill = False
        self.ax_poincare.zaxis.pane.fill = False
        self.ax_poincare.xaxis.pane.set_edgecolor(self.text_color)
        self.ax_poincare.yaxis.pane.set_edgecolor(self.text_color)
        self.ax_poincare.zaxis.pane.set_edgecolor(self.text_color)
        self.ax_poincare.grid(True, color=self.text_color, alpha=0.2)

    def display_parameters(self):
        """Display Mueller matrix parameters as table"""
        self.ax_params.clear()
        self.ax_params.axis('off')

        # Calculate parameters
        D = self.mueller.diattenuation()
        P = self.mueller.polarizance()
        Delta = self.mueller.depolarization_index()
        det = np.linalg.det(self.mueller.M)
        trace = np.trace(self.mueller.M)

        # Create parameter text
        params_text = f"""
        Element Type (元件类型): {self.element_type}
        Angle (角度): {self.angle:.1f}°

        Diattenuation (二色性) D: {D:.4f}
        Polarizance (偏振产生) P: {P:.4f}
        Depolarization Index (退偏振指数) Δ: {Delta:.4f}

        Matrix Properties:
        M₀₀ = {self.mueller.M[0,0]:.4f}
        Determinant (行列式) = {det:.4f}
        Trace (迹) = {trace:.4f}

        Input DOP: {self.input_stokes.dop():.4f}
        Output DOP: {self.output_stokes.dop():.4f}
        """

        self.ax_params.text(0.05, 0.95, params_text, transform=self.ax_params.transAxes,
                             fontsize=11, verticalalignment='top', fontfamily='monospace',
                             color=self.text_color, bbox=dict(boxstyle='round',
                             facecolor=self.bg_color, edgecolor=self.primary_color, linewidth=2))

        self.ax_params.set_title('Parameters (参数)', color=self.text_color,
                                  fontsize=12, pad=10, loc='left')

    def reset(self, event):
        """Reset to initial state"""
        self.slider_angle.set_val(0)
        self.slider_retardance.set_val(90)
        self.slider_diattenuation.set_val(0.5)
        self.slider_depolarization.set_val(0.5)
        self.radio_element.set_active(0)
        self.radio_presets.set_active(0)

    def export_data(self, event):
        """Export Mueller matrix and Stokes vectors (导出Mueller矩阵和Stokes向量)"""
        try:
            # Export Mueller matrix
            export_matrix(
                self.mueller_matrix.M,
                'mueller_matrix_data',
                matrix_name=f'Mueller Matrix - {self.element_type}',
                format='json',
                metadata={
                    'Demo': 'Mueller Matrix Calculus',
                    'Element Type': self.element_type,
                    'Angle (deg)': float(self.angle),
                    'Retardance (deg)': float(self.retardance) if self.element_type in ['Quarter-Wave', 'Half-Wave'] else None,
                    'Diattenuation': float(self.diattenuation) if self.element_type == 'Diattenuator' else None,
                    'Depolarization': float(self.depolarization) if self.element_type == 'Depolarizer' else None
                }
            )

            # Export input and output Stokes vectors
            export_stokes_vector(
                self.input_stokes.S,
                'mueller_input_stokes',
                format='json',
                metadata={
                    'Demo': 'Mueller Matrix - Input State',
                    'Input Preset': self.input_preset
                }
            )

            export_stokes_vector(
                self.output_stokes.S,
                'mueller_output_stokes',
                format='json',
                metadata={
                    'Demo': 'Mueller Matrix - Output State',
                    'Element Type': self.element_type
                }
            )

            print("✓ Mueller matrix data exported successfully!")

        except Exception as e:
            print(f"Export error: {e}")


def main():
    """Main function to run the demonstration"""
    print("=" * 70)
    print("Mueller Matrix Interactive Demonstration - OPTIMIZED")
    print("缪勒矩阵交互式演示 - 优化版")
    print("=" * 70)
    print("\nOPTIMIZATIONS: Unified PolarCraft dark theme, enhanced controls, professional visualization

Physical Principle (物理原理):")
    print("  S_out = M × S_in")
    print("  where M is 4×4 real matrix")
    print("\nFeatures (功能):")
    print("  - 6 optical elements: Polarizer, QWP, HWP, Rotator, etc.")
    print("  - Real-time Mueller matrix visualization")
    print("  - Poincaré sphere transformation")
    print("  - Lu-Chipman analysis (D, P, Δ)")
    print("\nControls (控制):")
    print("  - Select element type")
    print("  - Adjust angle/retardance/diattenuation")
    print("  - Choose input polarization state")
    print("  - Click Reset to restore defaults")
    print("\nNote: Close the window to exit.")
    print("=" * 70)

    # Create and show demonstration
    demo = MuellerMatrixDemo()
    plt.show()


if __name__ == '__main__':
    main()
