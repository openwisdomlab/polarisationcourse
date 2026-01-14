"""
Malus's Law Interactive Demonstration - OPTIMIZED VERSION
马吕斯定律交互演示 - 优化版本

This is an enhanced version with improved visualization using unified styling,
better interactivity, and smoother animations.

本版本使用统一样式、更好的交互性和更流畅的动画进行了增强。

Improvements 改进点:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Unified dark theme color scheme (统一深色主题配色)
✓ Enhanced slider responsiveness with visual feedback (增强滑块响应性和视觉反馈)
✓ Smooth animations with optimized rendering (流畅动画和优化渲染)
✓ Publication-quality scientific plots (出版级科学图表)
✓ Better text contrast and readability (更好的文本对比度和可读性)
✓ Accessibility improvements (无障碍性改进)

Author: PolarCraft Team
Date: 2026-01-14
License: MIT
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button
from matplotlib.patches import FancyBboxPatch, FancyArrow, Circle, Wedge
from matplotlib.animation import FuncAnimation

# 导入统一样式配置
from visualization_config import (
    setup_polarcraft_style,
    COLORS, FONTS, SIZES,
    create_multiplot_figure,
    style_slider,
    create_info_textbox
)

# ============================================================================
# CONSTANTS AND CONFIGURATION
# 常量与配置
# ============================================================================

# Physical constants
I0 = 100.0  # Initial intensity (arbitrary units)
WAVELENGTH = 550  # Light wavelength in nm (green light)

# Animation settings
ANIMATION_INTERVAL = 50  # milliseconds
ANIMATION_ENABLED = True

# ============================================================================
# PHYSICS FUNCTIONS
# 物理函数
# ============================================================================

def malus_law(theta_degrees, I_initial=I0):
    """
    Calculate transmitted intensity using Malus's Law.
    使用马吕斯定律计算透射光强。

    Formula: I = I₀ × cos²(θ)

    Parameters:
    -----------
    theta_degrees : float or ndarray
        Angle in degrees between incident polarization and analyzer axis
    I_initial : float
        Initial light intensity

    Returns:
    --------
    intensity : float or ndarray
        Transmitted light intensity
    """
    theta_radians = np.radians(theta_degrees)
    intensity = I_initial * np.cos(theta_radians)**2
    return intensity


def calculate_polarization_efficiency(theta_degrees):
    """
    Calculate the polarization efficiency (transmission percentage).
    计算偏振效率（透射百分比）。

    Returns:
    --------
    efficiency : float
        Transmission efficiency as percentage (0-100%)
    """
    return (malus_law(theta_degrees) / I0) * 100


# ============================================================================
# VISUALIZATION CLASS
# 可视化类
# ============================================================================

class MalusLawDemoOptimized:
    """
    Optimized interactive demonstration of Malus's Law.
    优化的马吕斯定律交互演示。
    """

    def __init__(self):
        """Initialize the demonstration with optimized styling."""
        # 应用统一样式
        setup_polarcraft_style()

        # 创建图形布局
        self.fig, self.axes = create_multiplot_figure(
            2, 2,
            title='Malus\'s Law - Optimized Interactive Demo (马吕斯定律 - 优化交互演示)',
            size='two_column',
            dpi=SIZES['screen']
        )

        # 展平axes数组以便访问
        self.ax_main = self.axes.flatten()[0]      # 光路图
        self.ax_curve = self.axes.flatten()[1]     # 强度曲线
        self.ax_polar = self.axes.flatten()[2]     # 极坐标图
        self.ax_info = self.axes.flatten()[3]      # 信息面板

        # 初始化参数
        self.angle = 45.0  # Initial angle in degrees
        self.is_playing = False  # Animation state

        # 创建控件
        self.create_controls()

        # 绘制初始图形
        self.update_plot()

        # 显示
        plt.show()

    def create_controls(self):
        """创建交互式控件（优化版）"""
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 1. 角度滑块 (Angle Slider) - 主控件
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ax_angle = plt.axes([0.15, 0.06, 0.5, 0.03])
        ax_angle.set_facecolor(COLORS['surface'])

        self.slider_angle = Slider(
            ax_angle,
            'Analyzer Angle (θ)',  # 标签
            0, 180,                 # 范围
            valinit=self.angle,    # 初始值
            valstep=1,             # 步长
            color=COLORS['primary'],
            track_color=COLORS['surface_light']
        )

        # 应用统一样式
        style_slider(self.slider_angle, COLORS['primary'])

        # 绑定回调
        self.slider_angle.on_changed(self.on_angle_changed)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 2. 重置按钮 (Reset Button)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ax_reset = plt.axes([0.70, 0.06, 0.08, 0.03])
        self.btn_reset = Button(
            ax_reset,
            'Reset',
            color=COLORS['surface'],
            hovercolor=COLORS['surface_light']
        )
        self.btn_reset.on_clicked(self.on_reset)

        # 设置按钮文字颜色
        self.btn_reset.label.set_color(COLORS['text_primary'])

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 3. 动画按钮 (Animate Button)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ax_animate = plt.axes([0.80, 0.06, 0.08, 0.03])
        self.btn_animate = Button(
            ax_animate,
            'Animate',
            color=COLORS['surface'],
            hovercolor=COLORS['surface_light']
        )
        self.btn_animate.on_clicked(self.toggle_animation)

        # 设置按钮文字颜色
        self.btn_animate.label.set_color(COLORS['text_primary'])

    def on_angle_changed(self, val):
        """角度滑块回调函数"""
        self.angle = val
        self.update_plot()

    def on_reset(self, event):
        """重置按钮回调函数"""
        self.slider_angle.set_val(45.0)
        self.is_playing = False
        self.btn_animate.label.set_text('Animate')

    def toggle_animation(self, event):
        """切换动画状态"""
        self.is_playing = not self.is_playing

        if self.is_playing:
            self.btn_animate.label.set_text('Stop')
            self.start_animation()
        else:
            self.btn_animate.label.set_text('Animate')

    def start_animation(self):
        """启动动画"""
        def animate(frame):
            if not self.is_playing:
                return

            # 更新角度（0-180度循环）
            new_angle = (self.angle + 2) % 180
            self.slider_angle.set_val(new_angle)

        # 创建动画
        self.anim = FuncAnimation(
            self.fig,
            animate,
            interval=ANIMATION_INTERVAL,
            blit=False,
            repeat=True
        )

    def update_plot(self):
        """更新所有子图（优化版）"""
        # 清除所有子图
        self.ax_main.clear()
        self.ax_curve.clear()
        self.ax_polar.clear()
        self.ax_info.clear()

        # 重新应用背景色
        for ax in [self.ax_main, self.ax_curve, self.ax_polar, self.ax_info]:
            ax.set_facecolor(COLORS['surface'])

        # 绘制各个部分
        self.draw_optical_path()
        self.draw_intensity_curve()
        self.draw_polar_plot()
        self.draw_info_panel()

        # 刷新画布
        self.fig.canvas.draw_idle()

    def draw_optical_path(self):
        """绘制光路图（增强版）"""
        ax = self.ax_main

        ax.set_xlim(-1, 11)
        ax.set_ylim(-2, 3)
        ax.axis('off')
        ax.set_title('Optical Path Visualization (光路可视化)',
                    fontsize=FONTS['subtitle']['size'],
                    color=COLORS['text_primary'],
                    pad=10)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 1. 光源 (Light Source)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        source = Circle((0.5, 0.5), 0.4, color=COLORS['light_beam'],
                       alpha=0.9, zorder=10)
        ax.add_patch(source)

        # 光源发光效果
        for r in [0.5, 0.6, 0.7]:
            glow = Circle((0.5, 0.5), r, color=COLORS['warning'],
                         alpha=0.1, zorder=5)
            ax.add_patch(glow)

        ax.text(0.5, -0.5, 'Light Source\n(光源)',
               ha='center', va='top',
               fontsize=FONTS['annotation']['size'],
               color=COLORS['text_muted'])

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 2. 第一偏振片 (Polarizer) - 产生线偏振光
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        pol1_x = 2.5
        polarizer1 = FancyBboxPatch(
            (pol1_x - 0.2, -1), 0.4, 3,
            boxstyle="round,pad=0.1",
            edgecolor=COLORS['primary'],
            facecolor=COLORS['surface_light'],
            linewidth=3,
            alpha=0.8,
            zorder=10
        )
        ax.add_patch(polarizer1)

        ax.text(pol1_x, -1.4, 'Polarizer\n(偏振片)\nθ = 0°',
               ha='center', va='top',
               fontsize=FONTS['annotation']['size'],
               color=COLORS['primary'],
               weight='bold')

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 3. 入射光束 (Incident Beam)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        arrow1 = FancyArrow(
            1.0, 0.5, 1.2, 0,
            width=0.3,
            head_width=0.6,
            head_length=0.2,
            color=COLORS['light_beam'],
            edgecolor=COLORS['warning'],
            linewidth=2,
            alpha=0.8,
            zorder=8
        )
        ax.add_patch(arrow1)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 4. 分析器 (Analyzer) - 可旋转
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        anal_x = 6.5

        # 旋转角度指示器
        angle_rad = np.radians(self.angle)
        analyzer = FancyBboxPatch(
            (anal_x - 0.2, -1), 0.4, 3,
            boxstyle="round,pad=0.1",
            edgecolor=COLORS['secondary'],
            facecolor=COLORS['surface_light'],
            linewidth=3,
            alpha=0.8,
            zorder=10
        )
        ax.add_patch(analyzer)

        # 角度标注（带颜色编码）
        angle_color = COLORS['success'] if abs(self.angle - 0) < 5 or abs(self.angle - 180) < 5 else \
                     COLORS['danger'] if abs(self.angle - 90) < 5 else \
                     COLORS['warning']

        ax.text(anal_x, -1.4, f'Analyzer\n(检偏器)\nθ = {self.angle:.0f}°',
               ha='center', va='top',
               fontsize=FONTS['annotation']['size'],
               color=angle_color,
               weight='bold')

        # 绘制旋转方向箭头
        arc = Wedge((anal_x, 0.5), 0.8, 0, self.angle,
                   width=0.15, color=angle_color, alpha=0.3)
        ax.add_patch(arc)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 5. 传播光束 (Propagating Beam)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        arrow2 = FancyArrow(
            3.0, 0.5, 3.2, 0,
            width=0.3,
            head_width=0.6,
            head_length=0.2,
            color=COLORS['polarized_h'],
            edgecolor=COLORS['danger'],
            linewidth=2,
            alpha=0.8,
            zorder=8
        )
        ax.add_patch(arrow2)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # 6. 输出光束 (Output Beam) - 强度依赖于角度
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        output_intensity = malus_law(self.angle, I0)
        output_alpha = output_intensity / I0  # 归一化为0-1

        arrow3 = FancyArrow(
            7.0, 0.5, 2.5, 0,
            width=0.3 * output_alpha,  # 宽度反映强度
            head_width=0.6 * output_alpha,
            head_length=0.2,
            color=COLORS['polarized_h'],
            edgecolor=COLORS['danger'],
            linewidth=2,
            alpha=max(0.2, output_alpha),  # 确保可见
            zorder=8
        )
        ax.add_patch(arrow3)

        # 输出强度标注
        ax.text(9.5, 1.5, f'Output: {output_intensity:.1f}%',
               ha='center', va='bottom',
               fontsize=FONTS['label']['size'],
               color=COLORS['text_primary'],
               weight='bold',
               bbox=dict(boxstyle='round,pad=0.5',
                        facecolor=COLORS['surface'],
                        edgecolor=angle_color,
                        linewidth=2))

    def draw_intensity_curve(self):
        """绘制强度曲线（cos²关系）"""
        ax = self.ax_curve

        ax.set_title('Intensity vs Angle (强度-角度关系)',
                    fontsize=FONTS['subtitle']['size'],
                    color=COLORS['text_primary'])

        # 生成数据
        angles = np.linspace(0, 180, 200)
        intensities = malus_law(angles, I0)

        # 绘制cos²曲线
        ax.plot(angles, intensities,
               color=COLORS['primary'],
               linewidth=SIZES['line_thick'],
               label='I = I₀ × cos²(θ)',
               zorder=10)

        # 标记当前点
        current_intensity = malus_law(self.angle, I0)
        ax.plot(self.angle, current_intensity,
               'o',
               color=COLORS['warning'],
               markersize=12,
               markeredgecolor=COLORS['text_primary'],
               markeredgewidth=2,
               zorder=20,
               label=f'Current: θ={self.angle:.0f}°')

        # 关键点标注
        key_points = [(0, 100), (45, 50), (90, 0), (135, 50), (180, 100)]
        for angle, intensity in key_points:
            ax.plot(angle, intensity, 's',
                   color=COLORS['success'],
                   markersize=6,
                   alpha=0.6)
            ax.annotate(f'{intensity:.0f}%',
                       xy=(angle, intensity),
                       xytext=(0, 10),
                       textcoords='offset points',
                       ha='center',
                       fontsize=8,
                       color=COLORS['text_muted'],
                       alpha=0.8)

        # 坐标轴设置
        ax.set_xlabel('Analyzer Angle θ (degrees)',
                     fontsize=FONTS['label']['size'],
                     color=COLORS['text_primary'])
        ax.set_ylabel('Transmitted Intensity (%)',
                     fontsize=FONTS['label']['size'],
                     color=COLORS['text_primary'])

        ax.set_xlim(0, 180)
        ax.set_ylim(-5, 105)

        # 网格
        ax.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)

        # 图例
        ax.legend(loc='upper right',
                 fontsize=FONTS['legend']['size'],
                 framealpha=0.9,
                 edgecolor=COLORS['axis'])

        # 刻度颜色
        ax.tick_params(colors=COLORS['tick'])

    def draw_polar_plot(self):
        """绘制极坐标图（直观显示cos²关系）"""
        ax = self.ax_polar

        ax.set_title('Polar Representation (极坐标表示)',
                    fontsize=FONTS['subtitle']['size'],
                    color=COLORS['text_primary'],
                    pad=20)

        # 生成数据
        theta = np.linspace(0, 2*np.pi, 200)
        r = np.cos(theta)**2

        # 绘制极坐标曲线
        ax.plot(theta, r,
               color=COLORS['secondary'],
               linewidth=SIZES['line_thick'],
               label='cos²(θ)')

        # 标记当前角度
        current_theta = np.radians(self.angle)
        current_r = np.cos(current_theta)**2

        ax.plot(current_theta, current_r,
               'o',
               color=COLORS['warning'],
               markersize=12,
               markeredgecolor=COLORS['text_primary'],
               markeredgewidth=2,
               zorder=20)

        # 极坐标设置
        ax.set_theta_zero_location('N')  # 0度在上方
        ax.set_theta_direction(-1)       # 顺时针
        ax.set_ylim(0, 1.1)

        # 网格和刻度
        ax.grid(True, alpha=0.3)
        ax.set_axisbelow(True)

    def draw_info_panel(self):
        """绘制信息面板"""
        # 计算相关物理量
        intensity = malus_law(self.angle, I0)
        efficiency = calculate_polarization_efficiency(self.angle)

        # 创建信息内容
        content = [
            "Physical Formula 物理公式:",
            "━━━━━━━━━━━━━━━━━━━━━━",
            "I = I₀ × cos²(θ)",
            "",
            f"Current Values 当前值:",
            "━━━━━━━━━━━━━━━━━━━━━━",
            f"Angle θ = {self.angle:.1f}°",
            f"Intensity = {intensity:.1f}%",
            f"Efficiency = {efficiency:.1f}%",
            "",
            "Special Cases 特殊情况:",
            "━━━━━━━━━━━━━━━━━━━━━━",
            "θ = 0°   → 100% (parallel)",
            "θ = 45° → 50% (diagonal)",
            "θ = 90° → 0% (crossed)",
        ]

        # 使用统一的信息框样式
        create_info_textbox(
            self.ax_info,
            'Malus\'s Law',
            content,
            color=COLORS['primary']
        )


# ============================================================================
# MAIN EXECUTION
# 主程序执行
# ============================================================================

def main():
    """
    Main function to run the optimized Malus's Law demonstration.
    主函数：运行优化版马吕斯定律演示。
    """
    print("=" * 70)
    print("Malus's Law - Optimized Interactive Demonstration")
    print("马吕斯定律 - 优化交互演示")
    print("=" * 70)
    print("\nImprovements 改进:")
    print("  ✓ Unified dark theme styling")
    print("  ✓ Enhanced interactive controls")
    print("  ✓ Smooth animations")
    print("  ✓ Publication-quality plots")
    print("\nControls 控制:")
    print("  • Slider: Adjust analyzer angle (调整检偏器角度)")
    print("  • Reset: Return to 45° (重置到45°)")
    print("  • Animate: Auto-rotate analyzer (自动旋转检偏器)")
    print("\nPhysics 物理:")
    print("  I = I₀ × cos²(θ)")
    print("  - θ = 0°/180°: Maximum transmission (最大透射)")
    print("  - θ = 90°: Zero transmission (零透射)")
    print("=" * 70)
    print()

    # 运行演示
    demo = MalusLawDemoOptimized()


if __name__ == '__main__':
    main()
