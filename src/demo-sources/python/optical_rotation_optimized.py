#!/usr/bin/env python3
"""
Optical Rotation Demonstration - OPTIMIZED
旋光性演示 - 优化版

Physical Principle: α = [α]_λ^T × l × c
where α: rotation angle, [α]: specific rotation,
l: path length (dm), c: concentration (g/mL)

Substances (589nm, 20°C):
  - Sucrose: +66.5°  - Fructose: -92.4°
  - Glucose: +52.7°  - Lactose: +52.3°

OPTIMIZATIONS: Unified styling, enhanced controls, smooth animations

Dependencies: numpy>=1.24.0, matplotlib>=3.7.0
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, RadioButtons
from matplotlib.patches import FancyArrowPatch, Circle, Rectangle

from visualization_config import (
    setup_polarcraft_style, style_slider, create_info_textbox,
    COLORS, FONTS, SIZES
)

SUBSTANCES = {
    'sucrose': {'name': 'Sucrose 蔗糖', 'specific_rotation': 66.5},
    'fructose': {'name': 'Fructose 果糖', 'specific_rotation': -92.4},
    'glucose': {'name': 'Glucose 葡萄糖', 'specific_rotation': 52.7},
    'lactose': {'name': 'Lactose 乳糖', 'specific_rotation': 52.3},
}

class OpticalRotationDemoOptimized:
    def __init__(self):
        setup_polarcraft_style()
        self.substance = 'sucrose'
        self.concentration = 0.1
        self.length = 2.0
        self.input_angle = 0

        self.fig = plt.figure(figsize=(14, 9), facecolor=COLORS['background'])
        self.fig.suptitle('Optical Rotation | 旋光性演示', fontsize=FONTS['title'],
                         fontweight='bold', color=COLORS['text_primary'], y=0.97)

        gs = self.fig.add_gridspec(3, 2, hspace=0.4, wspace=0.3,
                                    left=0.08, right=0.96, top=0.93, bottom=0.15)
        self.ax_main = self.fig.add_subplot(gs[0:2, :])
        self.ax_curve = self.fig.add_subplot(gs[2, 0])
        self.ax_info = self.fig.add_subplot(gs[2, 1])

        for ax in [self.ax_main, self.ax_curve, self.ax_info]:
            ax.set_facecolor(COLORS['surface'])

        self._create_controls()
        self._update_plot()

    def _create_controls(self):
        ax_conc = self.fig.add_axes([0.15, 0.08, 0.3, 0.025])
        self.slider_conc = Slider(ax_conc, 'Concentration (g/mL)\n浓度',
                                  0.01, 0.5, valinit=self.concentration,
                                  color=COLORS['primary'])
        style_slider(self.slider_conc, COLORS['primary'])
        self.slider_conc.on_changed(lambda v: self._update_plot())

        ax_len = self.fig.add_axes([0.15, 0.04, 0.3, 0.025])
        self.slider_len = Slider(ax_len, 'Path Length (dm)\n长度',
                                0.5, 5.0, valinit=self.length,
                                color=COLORS['secondary'])
        style_slider(self.slider_len, COLORS['secondary'])
        self.slider_len.on_changed(lambda v: self._update_plot())

        ax_radio = self.fig.add_axes([0.60, 0.04, 0.35, 0.08],
                                      facecolor=COLORS['surface'])
        labels = [v['name'] for v in SUBSTANCES.values()]
        self.radio = RadioButtons(ax_radio, labels, active=0)
        for label in self.radio.labels:
            label.set_color(COLORS['text_primary'])
            label.set_fontsize(FONTS['small'])
        self.radio.on_clicked(self._on_substance_changed)

    def _calculate_rotation(self):
        spec_rot = SUBSTANCES[self.substance]['specific_rotation']
        return spec_rot * self.length * self.slider_conc.val

    def _update_plot(self):
        rotation = self._calculate_rotation()
        output_angle = (self.input_angle + rotation) % 180

        # Main optical path
        self.ax_main.clear()
        self.ax_main.set_xlim(-1, 11)
        self.ax_main.set_ylim(-2, 3)
        self.ax_main.axis('off')
        self.ax_main.set_facecolor(COLORS['surface'])

        # Light source
        Circle((0.5, 0.5), 0.3, color=COLORS['warning'], alpha=0.8)
        self.ax_main.add_patch(Circle((0.5, 0.5), 0.3, color=COLORS['warning']))

        # Sample tube
        tube = Rectangle((4, -0.5), 4, 2, facecolor=SUBSTANCES[self.substance].get('color', COLORS['primary']),
                        alpha=0.2, edgecolor=COLORS['primary'], linewidth=2)
        self.ax_main.add_patch(tube)
        self.ax_main.text(6, 2, f'Sugar Solution\n{self.substance.title()}',
                         ha='center', color=COLORS['primary'], fontsize=FONTS['small'])

        # Input polarization
        self.ax_main.arrow(2, 0.5, 0, 0.8, head_width=0.15, head_length=0.1,
                          fc=COLORS['warning'], ec=COLORS['warning'], linewidth=2)
        self.ax_main.text(2, 2, f'{self.input_angle}°', ha='center',
                         color=COLORS['warning'], fontsize=FONTS['small'])

        # Output polarization
        angle_rad = np.radians(output_angle)
        dx, dy = 0.6*np.cos(angle_rad), 0.6*np.sin(angle_rad)
        arrow = FancyArrowPatch((9-dx, 0.5-dy), (9+dx, 0.5+dy),
                               arrowstyle='<->', mutation_scale=15,
                               linewidth=3, color=COLORS['success'])
        self.ax_main.add_patch(arrow)
        self.ax_main.text(9, 2, f'Output: {output_angle:.1f}°\nRotation: {rotation:+.1f}°',
                         ha='center', color=COLORS['success'], fontsize=FONTS['small'],
                         bbox=dict(boxstyle='round', fc=COLORS['background'],
                                  ec=COLORS['success'], alpha=0.8))

        # Rotation curve
        self.ax_curve.clear()
        self.ax_curve.set_facecolor(COLORS['surface'])
        concentrations = np.linspace(0.01, 0.5, 100)
        spec_rot = SUBSTANCES[self.substance]['specific_rotation']
        rotations = [spec_rot * self.slider_len.val * c for c in concentrations]
        self.ax_curve.plot(concentrations, rotations, linewidth=2.5,
                          color=COLORS['primary'], label=f'{self.substance.title()}')
        self.ax_curve.plot(self.slider_conc.val, rotation, 'o', markersize=10,
                          color=COLORS['success'], markeredgecolor=COLORS['text_primary'],
                          markeredgewidth=2)
        self.ax_curve.set_xlabel('Concentration (g/mL)', color=COLORS['text_primary'],
                                fontsize=FONTS['small'])
        self.ax_curve.set_ylabel('Rotation Angle (°)', color=COLORS['text_primary'],
                                fontsize=FONTS['small'])
        self.ax_curve.grid(True, alpha=0.2, color=COLORS['grid'])
        self.ax_curve.tick_params(colors=COLORS['text_primary'], labelsize=FONTS['small'])
        self.ax_curve.legend(fontsize=FONTS['small'], framealpha=0.9,
                            facecolor=COLORS['surface'], edgecolor=COLORS['grid'])

        # Info panel
        self.ax_info.clear()
        self.ax_info.axis('off')
        info_text = (
            f"📖 Optical Rotation Formula\n{'─'*30}\n"
            f"α = [α]_λ^T × l × c\n\n"
            f"Substance: {self.substance.title()}\n"
            f"[α] = {spec_rot:+.1f}°\n"
            f"c = {self.slider_conc.val:.3f} g/mL\n"
            f"l = {self.slider_len.val:.1f} dm\n\n"
            f"Rotation: α = {rotation:+.1f}°"
        )
        create_info_textbox(self.ax_info, info_text, (0.05, 0.95),
                           fontsize=FONTS['tiny'])

        self.fig.canvas.draw_idle()

    def _on_substance_changed(self, label):
        for key, val in SUBSTANCES.items():
            if val['name'] == label:
                self.substance = key
                break
        self._update_plot()

    def show(self):
        plt.show()

if __name__ == '__main__':
    print("Optical Rotation Demonstration - OPTIMIZED")
    demo = OpticalRotationDemoOptimized()
    demo.show()
