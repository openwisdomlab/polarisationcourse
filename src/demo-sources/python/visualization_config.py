"""
PolarCraft 可视化配置模块
==========================

统一的matplotlib样式配置，确保所有演示具有一致的视觉效果。

Usage:
    from visualization_config import setup_polarcraft_style, COLORS, FONTS

    # 在演示开始时调用
    setup_polarcraft_style()

    # 使用统一的颜色
    ax.plot(x, y, color=COLORS['primary'])

Author: PolarCraft Team
Date: 2026-01-14
"""

import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib import rcParams

# ============================================================================
# 统一配色方案 (Unified Color Scheme)
# ============================================================================

COLORS = {
    # 主题色 - Theme Colors
    'background': '#0f172a',      # 深蓝黑色 - Deep blue-black (slate-950)
    'surface': '#1e293b',         # 次级背景 - Secondary surface (slate-800)
    'surface_light': '#334155',   # 浅表面 - Light surface (slate-700)

    # 强调色 - Accent Colors (基于tailwind调色板)
    'primary': '#22d3ee',         # 青色 - Cyan (primary accent)
    'secondary': '#a78bfa',       # 紫色 - Purple (secondary accent)
    'success': '#10b981',         # 绿色 - Green (success/emerald)
    'warning': '#fbbf24',         # 琥珀色 - Amber (warning/sun)
    'danger': '#f43f5e',          # 玫瑰色 - Rose (danger)
    'info': '#60a5fa',            # 蓝色 - Blue (info)

    # 物理专用色 - Physics-specific Colors
    'light_beam': '#fef3c7',      # 光束 - Light beam (warm yellow)
    'polarized_h': '#ef4444',     # 水平偏振 - Horizontal polarization (red)
    'polarized_v': '#3b82f6',     # 垂直偏振 - Vertical polarization (blue)
    'polarized_45': '#f59e0b',    # 45°偏振 - 45-degree (orange)
    'polarized_135': '#8b5cf6',   # 135°偏振 - 135-degree (violet)

    # 文本色 - Text Colors
    'text_primary': '#ffffff',    # 主文本 - Primary text
    'text_secondary': '#cbd5e1',  # 次文本 - Secondary text (slate-300)
    'text_muted': '#94a3b8',      # 弱文本 - Muted text (slate-400)
    'text_disabled': '#64748b',   # 禁用文本 - Disabled text (slate-500)

    # 网格和坐标轴 - Grid and Axes
    'grid': '#475569',            # 网格线 - Grid lines (slate-600)
    'axis': '#94a3b8',            # 坐标轴 - Axis lines (slate-400)
    'tick': '#cbd5e1',            # 刻度 - Tick marks (slate-300)
}

# 科学色图 (Scientific Colormaps) - 推荐使用
COLORMAPS = {
    'sequential': 'viridis',      # 顺序数据（推荐）
    'diverging': 'coolwarm',      # 发散数据（有中心点）
    'cyclic': 'twilight',         # 循环数据（如角度）
    'qualitative': 'tab10',       # 分类数据
    'intensity': 'plasma',        # 光强度可视化
    'temperature': 'inferno',     # 温度可视化
}

# ============================================================================
# 字体配置 (Font Configuration)
# ============================================================================

FONTS = {
    'title': {
        'family': 'sans-serif',
        'size': 16,
        'weight': 'bold',
        'color': COLORS['text_primary'],
    },
    'subtitle': {
        'family': 'sans-serif',
        'size': 14,
        'weight': 'semibold',
        'color': COLORS['text_secondary'],
    },
    'label': {
        'family': 'sans-serif',
        'size': 12,
        'weight': 'normal',
        'color': COLORS['text_primary'],
    },
    'tick': {
        'family': 'sans-serif',
        'size': 10,
        'weight': 'normal',
        'color': COLORS['tick'],
    },
    'legend': {
        'family': 'sans-serif',
        'size': 10,
        'weight': 'normal',
        'color': COLORS['text_secondary'],
    },
    'annotation': {
        'family': 'sans-serif',
        'size': 9,
        'weight': 'normal',
        'color': COLORS['text_muted'],
    },
}

# ============================================================================
# 尺寸配置 (Size Configuration)
# ============================================================================

SIZES = {
    # 图形尺寸 - Figure sizes (inches)
    'single_plot': (10, 6),
    'two_column': (14, 8),
    'three_column': (16, 9),
    'square': (8, 8),

    # DPI设置 - DPI settings
    'screen': 100,      # 屏幕显示
    'web': 150,         # 网页使用
    'print': 300,       # 打印/出版

    # 线宽 - Line widths
    'line_thin': 1.0,
    'line_normal': 2.0,
    'line_thick': 3.0,
    'line_axes': 1.5,

    # 标记大小 - Marker sizes
    'marker_small': 4,
    'marker_normal': 6,
    'marker_large': 8,
}

# ============================================================================
# 样式应用函数 (Style Application Functions)
# ============================================================================

def setup_polarcraft_style():
    """
    应用PolarCraft统一样式到matplotlib。

    这个函数应该在每个演示脚本的开头调用一次，以确保视觉一致性。

    Example:
        >>> from visualization_config import setup_polarcraft_style
        >>> setup_polarcraft_style()
        >>> fig, ax = plt.subplots()
        >>> # 现在所有图形都使用统一样式
    """
    # 设置rcParams - 全局matplotlib配置
    rcParams.update({
        # 图形背景
        'figure.facecolor': COLORS['background'],
        'figure.edgecolor': COLORS['background'],

        # 坐标轴背景
        'axes.facecolor': COLORS['surface'],
        'axes.edgecolor': COLORS['axis'],
        'axes.linewidth': SIZES['line_axes'],

        # 坐标轴标签
        'axes.labelcolor': COLORS['text_primary'],
        'axes.labelsize': FONTS['label']['size'],
        'axes.labelweight': FONTS['label']['weight'],

        # 标题
        'axes.titlesize': FONTS['title']['size'],
        'axes.titleweight': FONTS['title']['weight'],
        'axes.titlecolor': COLORS['text_primary'],
        'axes.titlelocation': 'center',
        'axes.titlepad': 12,

        # 刻度
        'xtick.color': COLORS['tick'],
        'ytick.color': COLORS['tick'],
        'xtick.labelsize': FONTS['tick']['size'],
        'ytick.labelsize': FONTS['tick']['size'],
        'xtick.major.size': 6,
        'ytick.major.size': 6,
        'xtick.major.width': 1.0,
        'ytick.major.width': 1.0,

        # 网格
        'grid.color': COLORS['grid'],
        'grid.linestyle': '--',
        'grid.linewidth': 0.5,
        'grid.alpha': 0.3,

        # 图例
        'legend.facecolor': COLORS['surface'],
        'legend.edgecolor': COLORS['axis'],
        'legend.fontsize': FONTS['legend']['size'],
        'legend.framealpha': 0.9,
        'legend.borderpad': 0.5,
        'legend.labelspacing': 0.5,

        # 线条
        'lines.linewidth': SIZES['line_normal'],
        'lines.markersize': SIZES['marker_normal'],

        # 保存设置
        'savefig.facecolor': COLORS['background'],
        'savefig.edgecolor': COLORS['background'],
        'savefig.dpi': SIZES['print'],
        'savefig.bbox': 'tight',
        'savefig.pad_inches': 0.1,

        # 字体设置
        'font.family': 'sans-serif',
        'font.size': 11,

        # 其他
        'figure.autolayout': False,  # 使用constrained_layout代替
        'figure.constrained_layout.use': True,
        'figure.constrained_layout.h_pad': 0.05,
        'figure.constrained_layout.w_pad': 0.05,
    })

    print("✓ PolarCraft可视化样式已应用")
    print(f"  - 深色主题: {COLORS['background']}")
    print(f"  - 主强调色: {COLORS['primary']}")
    print(f"  - DPI设置: {SIZES['screen']} (屏幕)")

def create_styled_figure(title='', size='two_column', dpi=None):
    """
    创建一个预配置的PolarCraft样式图形。

    Parameters:
    -----------
    title : str
        图形标题
    size : str or tuple
        预定义尺寸名称或(width, height)元组
    dpi : int, optional
        DPI设置，默认使用SIZES['screen']

    Returns:
    --------
    fig, ax : matplotlib figure and axes objects

    Example:
        >>> fig, ax = create_styled_figure('Malus's Law', size='single_plot')
        >>> ax.plot(x, y, color=COLORS['primary'])
    """
    # 确定尺寸
    if isinstance(size, str):
        figsize = SIZES.get(size, SIZES['two_column'])
    else:
        figsize = size

    # 确定DPI
    if dpi is None:
        dpi = SIZES['screen']

    # 创建图形
    fig, ax = plt.subplots(figsize=figsize, dpi=dpi)

    # 应用样式
    fig.patch.set_facecolor(COLORS['background'])
    ax.set_facecolor(COLORS['surface'])

    # 设置标题
    if title:
        fig.suptitle(title, **FONTS['title'])

    return fig, ax

def create_multiplot_figure(nrows=1, ncols=1, title='', size='two_column', dpi=None):
    """
    创建多子图布局的PolarCraft样式图形。

    Parameters:
    -----------
    nrows, ncols : int
        子图行数和列数
    title : str
        图形标题
    size : str or tuple
        预定义尺寸名称或(width, height)元组
    dpi : int, optional
        DPI设置

    Returns:
    --------
    fig, axes : matplotlib figure and axes array

    Example:
        >>> fig, axes = create_multiplot_figure(2, 2, 'Four Plots')
        >>> axes[0, 0].plot(x, y1, color=COLORS['primary'])
        >>> axes[0, 1].plot(x, y2, color=COLORS['secondary'])
    """
    # 确定尺寸和DPI
    if isinstance(size, str):
        figsize = SIZES.get(size, SIZES['two_column'])
    else:
        figsize = size

    if dpi is None:
        dpi = SIZES['screen']

    # 创建图形
    fig, axes = plt.subplots(nrows, ncols, figsize=figsize, dpi=dpi)

    # 应用样式
    fig.patch.set_facecolor(COLORS['background'])

    # 处理axes数组
    if nrows == 1 and ncols == 1:
        axes = [axes]  # 转换为列表便于统一处理
    elif nrows == 1 or ncols == 1:
        axes = axes.flatten()  # 1D数组
    else:
        # 2D数组保持不变
        pass

    # 为每个子图应用样式
    try:
        for ax in axes.flat:
            ax.set_facecolor(COLORS['surface'])
    except AttributeError:
        # 单个axes对象
        axes.set_facecolor(COLORS['surface'])

    # 设置标题
    if title:
        fig.suptitle(title, **FONTS['title'])

    return fig, axes

# ============================================================================
# 交互式控件样式 (Interactive Widget Styling)
# ============================================================================

def style_slider(slider, color=None):
    """
    为matplotlib Slider控件应用PolarCraft样式。

    Parameters:
    -----------
    slider : matplotlib.widgets.Slider
        要样式化的滑块
    color : str, optional
        滑块颜色，默认使用primary

    Example:
        >>> from matplotlib.widgets import Slider
        >>> ax_slider = plt.axes([0.15, 0.05, 0.7, 0.03])
        >>> slider = Slider(ax_slider, 'Angle', 0, 180, valinit=45)
        >>> style_slider(slider, COLORS['primary'])
    """
    if color is None:
        color = COLORS['primary']

    # 设置滑块颜色
    slider.poly.set_facecolor(color)
    slider.vline.set_color(COLORS['text_primary'])
    slider.vline.set_linewidth(2)

    # 设置背景
    slider.ax.set_facecolor(COLORS['surface'])

    # 设置标签颜色
    slider.label.set_color(COLORS['text_primary'])
    slider.valtext.set_color(COLORS['text_primary'])

def create_info_textbox(ax, title, content, color=None):
    """
    创建带边框的信息文本框。

    Parameters:
    -----------
    ax : matplotlib axes
        要绘制文本框的坐标轴
    title : str
        标题文本
    content : str or list
        内容文本（可以是多行列表）
    color : str, optional
        强调色

    Example:
        >>> ax_info = plt.subplot(1, 3, 3)
        >>> create_info_textbox(ax_info, 'Physics', ['I = I₀cos²θ', 'θ = 45°'])
    """
    if color is None:
        color = COLORS['primary']

    ax.axis('off')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    # 绘制边框
    from matplotlib.patches import FancyBboxPatch
    box = FancyBboxPatch((0.05, 0.05), 0.9, 0.9,
                         boxstyle="round,pad=0.02",
                         edgecolor=color,
                         facecolor=COLORS['surface'],
                         linewidth=2,
                         alpha=0.8)
    ax.add_patch(box)

    # 标题
    ax.text(0.5, 0.85, title,
           ha='center', va='top',
           fontsize=FONTS['subtitle']['size'],
           fontweight='bold',
           color=color)

    # 内容
    if isinstance(content, str):
        content = [content]

    y_start = 0.70
    y_step = 0.12
    for i, line in enumerate(content):
        ax.text(0.5, y_start - i * y_step, line,
               ha='center', va='top',
               fontsize=FONTS['label']['size'],
               color=COLORS['text_secondary'],
               family='monospace')

# ============================================================================
# 性能优化工具 (Performance Optimization Tools)
# ============================================================================

def setup_fast_rendering(ax):
    """
    为动画设置快速渲染选项（使用blitting）。

    Parameters:
    -----------
    ax : matplotlib axes
        要优化的坐标轴

    Note:
        这个函数应该在创建动画前调用。
    """
    ax.set_animated(True)
    return ax

def save_publication_figure(fig, filename, dpi=300, formats=['png', 'pdf']):
    """
    以多种格式保存出版级图形。

    Parameters:
    -----------
    fig : matplotlib figure
        要保存的图形
    filename : str
        文件名（不含扩展名）
    dpi : int
        分辨率（仅对PNG有效）
    formats : list
        要保存的格式列表

    Example:
        >>> fig, ax = create_styled_figure('My Plot')
        >>> ax.plot(x, y)
        >>> save_publication_figure(fig, 'malus_law', dpi=300)
    """
    for fmt in formats:
        full_filename = f"{filename}.{fmt}"
        fig.savefig(full_filename,
                   dpi=dpi if fmt == 'png' else None,
                   bbox_inches='tight',
                   facecolor=COLORS['background'],
                   edgecolor='none',
                   transparent=False)
        print(f"✓ 已保存: {full_filename}")

# ============================================================================
# 使用示例 (Usage Examples)
# ============================================================================

if __name__ == '__main__':
    # 测试样式配置
    setup_polarcraft_style()

    # 创建测试图形
    import numpy as np

    fig, axes = create_multiplot_figure(2, 2, 'PolarCraft Style Test', size='two_column')

    x = np.linspace(0, 2*np.pi, 100)

    # 测试不同颜色
    if isinstance(axes, np.ndarray):
        axes_flat = axes.flatten()
    else:
        axes_flat = [axes]

    axes_flat[0].plot(x, np.sin(x), color=COLORS['primary'], linewidth=SIZES['line_thick'])
    axes_flat[0].set_title('Primary Color')
    axes_flat[0].grid(True)

    axes_flat[1].plot(x, np.cos(x), color=COLORS['secondary'], linewidth=SIZES['line_thick'])
    axes_flat[1].set_title('Secondary Color')
    axes_flat[1].grid(True)

    axes_flat[2].scatter(x[::5], np.sin(x[::5]), color=COLORS['success'], s=50)
    axes_flat[2].set_title('Success Color')
    axes_flat[2].grid(True)

    axes_flat[3].bar(range(5), [1, 2, 3, 2, 1], color=COLORS['warning'])
    axes_flat[3].set_title('Warning Color')
    axes_flat[3].grid(True)

    plt.show()

    print("\n✓ 样式测试完成!")
    print("  所有颜色和字体已正确应用")
