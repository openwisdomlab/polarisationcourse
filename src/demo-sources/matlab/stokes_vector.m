function stokes_vector()
% STOKES_VECTOR Stokes Vector Demonstration
% 斯托克斯矢量演示
%
% Physical Principle (物理原理):
% Stokes parameters provide a complete description of any polarization state,
% including partial polarization. Unlike Jones calculus (complex vectors),
% Stokes parameters use real numbers and are directly measurable.
%
% Stokes Vector: S = [S₀, S₁, S₂, S₃]ᵀ
% - S₀: Total intensity (总光强)
% - S₁: H-V preference (水平-垂直偏好)
% - S₂: ±45° preference (±45°偏好)
% - S₃: R-L preference (右旋-左旋偏好)
%
% Degree of Polarization: DOP = √(S₁² + S₂² + S₃²) / S₀
% - DOP = 1: Fully polarized (完全偏振)
% - DOP = 0: Unpolarized (非偏振)
% - 0 < DOP < 1: Partially polarized (部分偏振)
%
% Applications (应用场景):
% - Atmospheric polarimetry (大气偏振测量)
% - Remote sensing (遥感)
% - Astronomy (polarized starlight) (天文偏振)
% - Biomedical imaging (生物医学成像)
%
% Author: PolarCraft Team
% Date: 2026-01-14
% MATLAB Version: R2016b+
% Octave Compatible: Yes (4.0+)

    % Print header
    fprintf('======================================================================\n');
    fprintf('Stokes Vector Demonstration / 斯托克斯矢量演示\n');
    fprintf('======================================================================\n\n');
    fprintf('Physics Principle (物理原理):\n');
    fprintf('  S = [S₀, S₁, S₂, S₃]ᵀ\n');
    fprintf('  • S₀: Total intensity (总光强)\n');
    fprintf('  • S₁: H-V difference (水平-垂直差)\n');
    fprintf('  • S₂: ±45° difference (±45°差)\n');
    fprintf('  • S₃: R-L difference (右旋-左旋差)\n\n');
    fprintf('  DOP = √(S₁² + S₂² + S₃²) / S₀\n\n');
    fprintf('Interactive Controls (交互控制):\n');
    fprintf('  • Sliders: S₁, S₂, S₃, DOP\n');
    fprintf('  • Buttons: Preset states, Reset\n\n');
    fprintf('======================================================================\n\n');

    % Initialize figure
    fig = figure('Name', 'Stokes Vector Demo', ...
                 'NumberTitle', 'off', ...
                 'Position', [100, 100, 1400, 800], ...
                 'Color', [0.059 0.09 0.157], ...
                 'MenuBar', 'none', ...
                 'ToolBar', 'figure');

    % Initial Stokes vector: Horizontal linear polarization
    S = [1; 1; 0; 0];

    % Create UI controls
    controls = create_controls(fig);

    % Create axes for visualizations
    axes_handles = create_axes(fig);

    % Store data
    data = struct();
    data.S = S;
    data.controls = controls;
    data.axes = axes_handles;
    guidata(fig, data);

    % Set callbacks
    set(controls.slider_s1, 'Callback', {@update_plot, fig});
    set(controls.slider_s2, 'Callback', {@update_plot, fig});
    set(controls.slider_s3, 'Callback', {@update_plot, fig});
    set(controls.slider_dop, 'Callback', {@update_plot, fig});
    set(controls.btn_reset, 'Callback', {@reset_callback, fig});
    set(controls.btn_h, 'Callback', {@preset_callback, fig, 'H'});
    set(controls.btn_v, 'Callback', {@preset_callback, fig, 'V'});
    set(controls.btn_45, 'Callback', {@preset_callback, fig, '45'});
    set(controls.btn_r, 'Callback', {@preset_callback, fig, 'R'});
    set(controls.btn_unpol, 'Callback', {@preset_callback, fig, 'U'});

    % Initial plot
    update_plot([], [], fig);
end


function controls = create_controls(fig)
% Create UI control elements
% 创建UI控制元件

    % Slider: S₁ (H-V)
    uicontrol('Style', 'text', 'String', 'S₁ (H-V):', ...
              'Position', [50, 120, 100, 20], ...
              'BackgroundColor', [0.059 0.09 0.157], ...
              'ForegroundColor', 'white', ...
              'FontSize', 10, ...
              'HorizontalAlignment', 'left');

    controls.slider_s1 = uicontrol('Style', 'slider', ...
                                   'Min', -1, 'Max', 1, 'Value', 1, ...
                                   'Position', [150, 120, 200, 20], ...
                                   'BackgroundColor', [0.118 0.161 0.275]);

    controls.text_s1 = uicontrol('Style', 'text', 'String', '1.000', ...
                                 'Position', [360, 120, 50, 20], ...
                                 'BackgroundColor', [0.059 0.09 0.157], ...
                                 'ForegroundColor', '#22d3ee', ...
                                 'FontSize', 10);

    % Slider: S₂ (±45°)
    uicontrol('Style', 'text', 'String', 'S₂ (±45°):', ...
              'Position', [50, 85, 100, 20], ...
              'BackgroundColor', [0.059 0.09 0.157], ...
              'ForegroundColor', 'white', ...
              'FontSize', 10, ...
              'HorizontalAlignment', 'left');

    controls.slider_s2 = uicontrol('Style', 'slider', ...
                                   'Min', -1, 'Max', 1, 'Value', 0, ...
                                   'Position', [150, 85, 200, 20], ...
                                   'BackgroundColor', [0.118 0.161 0.275]);

    controls.text_s2 = uicontrol('Style', 'text', 'String', '0.000', ...
                                 'Position', [360, 85, 50, 20], ...
                                 'BackgroundColor', [0.059 0.09 0.157], ...
                                 'ForegroundColor', '#f472b6', ...
                                 'FontSize', 10);

    % Slider: S₃ (R-L)
    uicontrol('Style', 'text', 'String', 'S₃ (R-L):', ...
              'Position', [50, 50, 100, 20], ...
              'BackgroundColor', [0.059 0.09 0.157], ...
              'ForegroundColor', 'white', ...
              'FontSize', 10, ...
              'HorizontalAlignment', 'left');

    controls.slider_s3 = uicontrol('Style', 'slider', ...
                                   'Min', -1, 'Max', 1, 'Value', 0, ...
                                   'Position', [150, 50, 200, 20], ...
                                   'BackgroundColor', [0.118 0.161 0.275]);

    controls.text_s3 = uicontrol('Style', 'text', 'String', '0.000', ...
                                 'Position', [360, 50, 50, 20], ...
                                 'BackgroundColor', [0.059 0.09 0.157], ...
                                 'ForegroundColor', '#a78bfa', ...
                                 'FontSize', 10);

    % Slider: DOP
    uicontrol('Style', 'text', 'String', 'DOP:', ...
              'Position', [50, 15, 100, 20], ...
              'BackgroundColor', [0.059 0.09 0.157], ...
              'ForegroundColor', 'white', ...
              'FontSize', 10, ...
              'HorizontalAlignment', 'left');

    controls.slider_dop = uicontrol('Style', 'slider', ...
                                    'Min', 0, 'Max', 1, 'Value', 1, ...
                                    'Position', [150, 15, 200, 20], ...
                                    'BackgroundColor', [0.118 0.161 0.275]);

    controls.text_dop = uicontrol('Style', 'text', 'String', '1.000', ...
                                  'Position', [360, 15, 50, 20], ...
                                  'BackgroundColor', [0.059 0.09 0.157], ...
                                  'ForegroundColor', '#10b981', ...
                                  'FontSize', 10);

    % Preset buttons
    btn_width = 80;
    btn_height = 30;
    btn_x_start = 500;
    btn_y = 80;
    btn_spacing = 90;

    controls.btn_h = uicontrol('Style', 'pushbutton', 'String', 'H', ...
                               'Position', [btn_x_start, btn_y, btn_width, btn_height], ...
                               'BackgroundColor', [0.118 0.161 0.275], ...
                               'ForegroundColor', 'white', ...
                               'FontSize', 10);

    controls.btn_v = uicontrol('Style', 'pushbutton', 'String', 'V', ...
                               'Position', [btn_x_start + btn_spacing, btn_y, btn_width, btn_height], ...
                               'BackgroundColor', [0.118 0.161 0.275], ...
                               'ForegroundColor', 'white', ...
                               'FontSize', 10);

    controls.btn_45 = uicontrol('Style', 'pushbutton', 'String', '+45°', ...
                                'Position', [btn_x_start + 2*btn_spacing, btn_y, btn_width, btn_height], ...
                                'BackgroundColor', [0.118 0.161 0.275], ...
                                'ForegroundColor', 'white', ...
                                'FontSize', 10);

    controls.btn_r = uicontrol('Style', 'pushbutton', 'String', 'Right Circ', ...
                               'Position', [btn_x_start + 3*btn_spacing, btn_y, btn_width, btn_height], ...
                               'BackgroundColor', [0.118 0.161 0.275], ...
                               'ForegroundColor', 'white', ...
                               'FontSize', 10);

    controls.btn_unpol = uicontrol('Style', 'pushbutton', 'String', 'Unpolarized', ...
                                   'Position', [btn_x_start + 4*btn_spacing, btn_y, btn_width, btn_height], ...
                                   'BackgroundColor', [0.118 0.161 0.275], ...
                                   'ForegroundColor', 'white', ...
                                   'FontSize', 10);

    % Reset button
    controls.btn_reset = uicontrol('Style', 'pushbutton', 'String', 'Reset', ...
                                   'Position', [btn_x_start + 5*btn_spacing, btn_y, btn_width, btn_height], ...
                                   'BackgroundColor', [0.118 0.161 0.275], ...
                                   'ForegroundColor', 'white', ...
                                   'FontSize', 10);
end


function axes_handles = create_axes(fig)
% Create axes for 6 visualizations
% 创建6个可视化轴

    % 1. Stokes parameter bars (top left)
    axes_handles.ax_bars = axes('Parent', fig, ...
                                'Position', [0.08, 0.68, 0.35, 0.25], ...
                                'Color', [0.059 0.09 0.157], ...
                                'XColor', 'white', 'YColor', 'white');
    title('Stokes Parameters / 斯托克斯参数', 'Color', 'white', 'FontSize', 12);

    % 2. Poincaré sphere (top middle)
    axes_handles.ax_poincare = axes('Parent', fig, ...
                                    'Position', [0.50, 0.68, 0.20, 0.25], ...
                                    'Color', [0.059 0.09 0.157], ...
                                    'XColor', 'white', 'YColor', 'white', 'ZColor', 'white');
    title('Poincaré Sphere / 庞加莱球', 'Color', 'white', 'FontSize', 12);

    % 3. Polarization ellipse (top right)
    axes_handles.ax_ellipse = axes('Parent', fig, ...
                                   'Position', [0.75, 0.68, 0.20, 0.25], ...
                                   'Color', [0.059 0.09 0.157], ...
                                   'XColor', 'white', 'YColor', 'white');
    title('Polarization Ellipse / 偏振椭圆', 'Color', 'white', 'FontSize', 12);
    axis equal;

    % 4. Intensity measurements (middle left)
    axes_handles.ax_intensity = axes('Parent', fig, ...
                                     'Position', [0.08, 0.38, 0.35, 0.22], ...
                                     'Color', [0.059 0.09 0.157], ...
                                     'XColor', 'white', 'YColor', 'white');
    title('Intensity Measurements / 强度测量', 'Color', 'white', 'FontSize', 12);

    % 5. DOP gauge (middle right)
    axes_handles.ax_dop = axes('Parent', fig, ...
                               'Position', [0.50, 0.38, 0.45, 0.22], ...
                               'Color', [0.059 0.09 0.157]);
    title('Degree of Polarization / 偏振度', 'Color', 'white', 'FontSize', 12);
    axis off;

    % 6. Parameters table (bottom)
    axes_handles.ax_params = axes('Parent', fig, ...
                                  'Position', [0.08, 0.18, 0.87, 0.15], ...
                                  'Color', [0.059 0.09 0.157]);
    title('Parameters / 参数', 'Color', 'white', 'FontSize', 12);
    axis off;
end


function update_plot(~, ~, fig)
% Update all visualizations
% 更新所有可视化

    data = guidata(fig);
    controls = data.controls;

    % Get slider values
    s1 = get(controls.slider_s1, 'Value');
    s2 = get(controls.slider_s2, 'Value');
    s3 = get(controls.slider_s3, 'Value');
    dop = get(controls.slider_dop, 'Value');

    % Update text displays
    set(controls.text_s1, 'String', sprintf('%.3f', s1));
    set(controls.text_s2, 'String', sprintf('%.3f', s2));
    set(controls.text_s3, 'String', sprintf('%.3f', s3));
    set(controls.text_dop, 'String', sprintf('%.3f', dop));

    % Construct Stokes vector with DOP constraint
    magnitude = sqrt(s1^2 + s2^2 + s3^2);
    if magnitude > 1e-10
        scale = dop / magnitude;
        S1 = s1 * scale;
        S2 = s2 * scale;
        S3 = s3 * scale;
    else
        S1 = 0; S2 = 0; S3 = 0;
    end

    S = [1; S1; S2; S3];

    % Validate (S₁² + S₂² + S₃² ≤ S₀²)
    if S1^2 + S2^2 + S3^2 > 1.001
        return;  % Skip invalid state
    end

    data.S = S;
    guidata(fig, data);

    % Update all visualizations
    plot_stokes_bars(data.axes.ax_bars, S);
    plot_poincare_sphere(data.axes.ax_poincare, S);
    plot_ellipse(data.axes.ax_ellipse, S);
    plot_intensities(data.axes.ax_intensity, S);
    plot_dop_gauge(data.axes.ax_dop, S);
    display_parameters(data.axes.ax_params, S);

    drawnow;
end


function plot_stokes_bars(ax, S)
% Bar chart of S₀, S₁, S₂, S₃
% S₀, S₁, S₂, S₃ 的柱状图

    cla(ax);
    hold(ax, 'on');

    % Colors
    colors = [0.133 0.827 0.933;  % Cyan for S₀
              0.937 0.267 0.267;  % Red for S₁
              0.961 0.620 0.043;  % Orange for S₂
              0.655 0.545 0.980]; % Purple for S₃

    % Plot bars
    labels = {'S₀', 'S₁', 'S₂', 'S₃'};
    x_pos = 1:4;

    for i = 1:4
        bar(ax, x_pos(i), S(i), 'FaceColor', colors(i,:), 'EdgeColor', 'white', 'LineWidth', 1.5);

        % Add value labels
        if S(i) >= 0
            text(ax, x_pos(i), S(i), sprintf('%.3f', S(i)), ...
                 'HorizontalAlignment', 'center', 'VerticalAlignment', 'bottom', ...
                 'Color', 'white', 'FontSize', 10);
        else
            text(ax, x_pos(i), S(i), sprintf('%.3f', S(i)), ...
                 'HorizontalAlignment', 'center', 'VerticalAlignment', 'top', ...
                 'Color', 'white', 'FontSize', 10);
        end
    end

    set(ax, 'XTick', x_pos, 'XTickLabel', labels);
    set(ax, 'YLim', [-1.2, 1.2]);
    ylabel(ax, 'Value', 'Color', 'white', 'FontSize', 11);
    grid(ax, 'on');
    hold(ax, 'off');
end


function plot_poincare_sphere(ax, S)
% 3D Poincaré sphere with state
% 庞加莱球3D可视化

    cla(ax);
    hold(ax, 'on');

    % Draw unit sphere
    [X, Y, Z] = sphere(30);
    surf(ax, X, Y, Z, 'FaceColor', 'cyan', 'FaceAlpha', 0.1, 'EdgeColor', 'none');

    % Draw axes
    axis_length = 1.3;
    plot3(ax, [-axis_length, axis_length], [0, 0], [0, 0], 'r-', 'LineWidth', 2);
    plot3(ax, [0, 0], [-axis_length, axis_length], [0, 0], 'g-', 'LineWidth', 2);
    plot3(ax, [0, 0], [0, 0], [-axis_length, axis_length], 'b-', 'LineWidth', 2);

    % Labels
    text(ax, axis_length, 0, 0, 'H', 'Color', 'red', 'FontSize', 11);
    text(ax, -axis_length, 0, 0, 'V', 'Color', 'red', 'FontSize', 11);
    text(ax, 0, axis_length, 0, '+45°', 'Color', 'green', 'FontSize', 11);
    text(ax, 0, -axis_length, 0, '-45°', 'Color', 'green', 'FontSize', 11);
    text(ax, 0, 0, axis_length, 'L', 'Color', 'blue', 'FontSize', 11);
    text(ax, 0, 0, -axis_length, 'R', 'Color', 'blue', 'FontSize', 11);

    % Normalize and plot current state
    s1 = S(2) / S(1);
    s2 = S(3) / S(1);
    s3 = S(4) / S(1);

    plot3(ax, s1, s2, s3, 'o', 'MarkerSize', 12, 'MarkerFaceColor', [1 0.267 0.267], ...
          'MarkerEdgeColor', 'white', 'LineWidth', 2);

    % Line from origin
    plot3(ax, [0, s1], [0, s2], [0, s3], 'w--', 'LineWidth', 2);

    axis(ax, [-1.5, 1.5, -1.5, 1.5, -1.5, 1.5]);
    xlabel(ax, 'S₁', 'Color', 'white', 'FontSize', 10);
    ylabel(ax, 'S₂', 'Color', 'white', 'FontSize', 10);
    zlabel(ax, 'S₃', 'Color', 'white', 'FontSize', 10);
    view(ax, 3);
    grid(ax, 'on');
    hold(ax, 'off');
end


function plot_ellipse(ax, S)
% 2D polarization ellipse
% 偏振椭圆2D

    cla(ax);
    hold(ax, 'on');

    % Calculate DOP
    dop = sqrt(S(2)^2 + S(3)^2 + S(4)^2) / S(1);

    % Calculate ellipse parameters
    [a, b, psi_deg, chi_deg, handedness] = ellipse_params(S);

    if dop < 0.01
        % Unpolarized - draw circle
        theta = linspace(0, 2*pi, 100);
        plot(ax, 0.3*cos(theta), 0.3*sin(theta), '--', 'Color', [0.5 0.5 0.5], 'LineWidth', 2);
        text(ax, 0, 0, 'Unpolarized', 'Color', 'white', 'FontSize', 11, ...
             'HorizontalAlignment', 'center');
    elseif abs(chi_deg) < 0.1
        % Linear polarization
        psi_rad = deg2rad(psi_deg);
        x_line = [-dop*cos(psi_rad), dop*cos(psi_rad)];
        y_line = [-dop*sin(psi_rad), dop*sin(psi_rad)];
        plot(ax, x_line, y_line, 'o-', 'Color', [0.133 0.827 0.933], 'LineWidth', 3, 'MarkerSize', 8);
    else
        % Elliptical/circular
        t = linspace(0, 2*pi, 100);
        if strcmp(handedness, 'right')
            t = fliplr(t);
        end

        psi_rad = deg2rad(psi_deg);
        x_ell = a*dop*cos(t)*cos(psi_rad) - b*dop*sin(t)*sin(psi_rad);
        y_ell = a*dop*cos(t)*sin(psi_rad) + b*dop*sin(t)*cos(psi_rad);
        plot(ax, x_ell, y_ell, '-', 'Color', [0.133 0.827 0.933], 'LineWidth', 2.5);

        % Arrow for direction
        arrow_idx = 25;
        quiver(ax, x_ell(arrow_idx-5), y_ell(arrow_idx-5), ...
               x_ell(arrow_idx)-x_ell(arrow_idx-5), y_ell(arrow_idx)-y_ell(arrow_idx-5), ...
               0, 'Color', [0.961 0.447 0.714], 'LineWidth', 2, 'MaxHeadSize', 2);
    end

    axis(ax, [-1.2, 1.2, -1.2, 1.2]);
    xlabel(ax, 'Ex', 'Color', 'white', 'FontSize', 10);
    ylabel(ax, 'Ey', 'Color', 'white', 'FontSize', 10);
    grid(ax, 'on');
    axis(ax, 'equal');

    % Info text
    info_str = sprintf('ψ = %.1f°\nχ = %.1f°\n%s', psi_deg, chi_deg, upper(handedness));
    text(ax, -1.1, 1.1, info_str, 'Color', 'white', 'FontSize', 10, ...
         'VerticalAlignment', 'top', 'BackgroundColor', [0.118 0.161 0.275]);

    hold(ax, 'off');
end


function plot_intensities(ax, S)
% 6 intensity measurements
% 6个强度测量

    cla(ax);
    hold(ax, 'on');

    % Calculate intensities
    I_H = (S(1) + S(2)) / 2;
    I_V = (S(1) - S(2)) / 2;
    I_45 = (S(1) + S(3)) / 2;
    I_m45 = (S(1) - S(3)) / 2;
    I_R = (S(1) - S(4)) / 2;
    I_L = (S(1) + S(4)) / 2;

    intensities = [I_H, I_V, I_45, I_m45, I_R, I_L];
    labels = {'I_H', 'I_V', 'I_{+45}', 'I_{-45}', 'I_R', 'I_L'};

    colors = [0.133 0.827 0.933;  % Cyan
              0.231 0.510 0.961;  % Blue
              0.961 0.620 0.043;  % Orange
              0.918 0.702 0.031;  % Yellow
              0.655 0.545 0.980;  % Purple
              0.753 0.518 0.988]; % Light purple

    x_pos = 1:6;
    for i = 1:6
        bar(ax, x_pos(i), intensities(i), 'FaceColor', colors(i,:), 'EdgeColor', 'white', 'LineWidth', 1.5);
        text(ax, x_pos(i), intensities(i), sprintf('%.3f', intensities(i)), ...
             'HorizontalAlignment', 'center', 'VerticalAlignment', 'bottom', ...
             'Color', 'white', 'FontSize', 10);
    end

    set(ax, 'XTick', x_pos, 'XTickLabel', labels);
    set(ax, 'YLim', [0, 1.2]);
    ylabel(ax, 'Intensity', 'Color', 'white', 'FontSize', 11);
    grid(ax, 'on');
    hold(ax, 'off');
end


function plot_dop_gauge(ax, S)
% DOP radial gauge
% 偏振度仪表

    cla(ax);
    hold(ax, 'on');

    dop = sqrt(S(2)^2 + S(3)^2 + S(4)^2) / S(1);

    % Draw arc background
    theta = linspace(0, pi, 100);
    plot(ax, cos(theta), sin(theta), 'w-', 'LineWidth', 3);

    % Draw filled arc
    theta_fill = linspace(0, dop*pi, 100);

    % Color based on DOP
    if dop < 0.33
        color = [0.937 0.267 0.267];  % Red
    elseif dop < 0.67
        color = [0.918 0.702 0.031];  % Yellow
    else
        color = [0.063 0.725 0.506];  % Green
    end

    plot(ax, cos(theta_fill), sin(theta_fill), '-', 'Color', color, 'LineWidth', 8);

    % DOP value text
    text(ax, 0, 0.5, sprintf('%.3f', dop), 'Color', 'white', 'FontSize', 32, ...
         'FontWeight', 'bold', 'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle');

    text(ax, 0, -0.2, sprintf('DOP = %.1f%%', dop*100), 'Color', 'white', 'FontSize', 14, ...
         'HorizontalAlignment', 'center');

    % Labels
    text(ax, -1.1, 0, '0', 'Color', 'white', 'FontSize', 11, 'HorizontalAlignment', 'right');
    text(ax, 1.1, 0, '1', 'Color', 'white', 'FontSize', 11, 'HorizontalAlignment', 'left');
    text(ax, 0, 1.1, 'Fully Polarized', 'Color', 'white', 'FontSize', 10, ...
         'HorizontalAlignment', 'center');

    axis(ax, [-1.2, 1.2, -0.5, 1.2]);
    axis(ax, 'off');
    hold(ax, 'off');
end


function display_parameters(ax, S)
% Parameters table
% 参数表

    cla(ax);

    dop = sqrt(S(2)^2 + S(3)^2 + S(4)^2) / S(1);
    s1 = S(2) / S(1);
    s2 = S(3) / S(1);
    s3 = S(4) / S(1);

    [a, b, psi, chi, hand] = ellipse_params(S);

    % Decompose
    S_pol = dop * S(1) * [1; s1; s2; s3];
    S_unpol = (1 - dop) * S(1) * [1; 0; 0; 0];

    info_str = sprintf([...
        'STOKES VECTOR: S = [%.4f, %.4f, %.4f, %.4f]ᵀ\n\n', ...
        'DEGREE OF POLARIZATION: DOP = √(S₁² + S₂² + S₃²) / S₀ = %.4f (%.2f%%)\n\n', ...
        'POINCARÉ COORDINATES: (s₁, s₂, s₃) = (%.4f, %.4f, %.4f)  |  Radius = %.4f\n\n', ...
        'ELLIPSE PARAMETERS: a = %.4f, b = %.4f, ψ = %.2f°, χ = %.2f°, %s\n\n', ...
        'DECOMPOSITION:\n', ...
        '  Polarized:   S_pol = [%.4f, %.4f, %.4f, %.4f]ᵀ\n', ...
        '  Unpolarized: S_unpol = [%.4f, %.4f, %.4f, %.4f]ᵀ'], ...
        S(1), S(2), S(3), S(4), dop, dop*100, s1, s2, s3, dop, ...
        a, b, psi, chi, upper(hand), ...
        S_pol(1), S_pol(2), S_pol(3), S_pol(4), ...
        S_unpol(1), S_unpol(2), S_unpol(3), S_unpol(4));

    text(ax, 0.05, 0.95, info_str, 'Color', 'white', 'FontSize', 10, ...
         'VerticalAlignment', 'top', 'FontName', 'FixedWidth', ...
         'BackgroundColor', [0.118 0.161 0.275]);

    axis(ax, 'off');
end


function [a, b, psi_deg, chi_deg, handedness] = ellipse_params(S)
% Extract polarization ellipse parameters
% 提取偏振椭圆参数

    s1 = S(2) / S(1);
    s2 = S(3) / S(1);
    s3 = S(4) / S(1);

    % Orientation angle
    if abs(s1) < 1e-10 && abs(s2) < 1e-10
        psi_rad = 0;
    else
        psi_rad = 0.5 * atan2(s2, s1);
    end
    psi_deg = rad2deg(psi_rad);

    % Ellipticity angle
    sin_2chi = max(-1, min(1, s3));
    chi_rad = 0.5 * asin(sin_2chi);
    chi_deg = rad2deg(chi_rad);

    % Semi-axes
    dop = sqrt(s1^2 + s2^2 + s3^2);
    a = sqrt(S(1) * (1 + dop));
    b = sqrt(S(1) * (1 - dop));

    % Handedness
    if abs(chi_deg) < 0.1
        handedness = 'linear';
    elseif chi_deg > 0
        handedness = 'left';
    else
        handedness = 'right';
    end
end


function reset_callback(~, ~, fig)
% Reset all sliders to default
% 重置所有滑块

    data = guidata(fig);
    controls = data.controls;

    set(controls.slider_s1, 'Value', 1);
    set(controls.slider_s2, 'Value', 0);
    set(controls.slider_s3, 'Value', 0);
    set(controls.slider_dop, 'Value', 1);

    update_plot([], [], fig);
end


function preset_callback(~, ~, fig, state)
% Set preset polarization states
% 设置预设偏振态

    data = guidata(fig);
    controls = data.controls;

    switch state
        case 'H'  % Horizontal
            s1 = 1; s2 = 0; s3 = 0; dop = 1;
        case 'V'  % Vertical
            s1 = -1; s2 = 0; s3 = 0; dop = 1;
        case '45'  % +45°
            s1 = 0; s2 = 1; s3 = 0; dop = 1;
        case 'R'  % Right circular
            s1 = 0; s2 = 0; s3 = -1; dop = 1;
        case 'U'  % Unpolarized
            s1 = 0; s2 = 0; s3 = 0; dop = 0;
        otherwise
            return;
    end

    set(controls.slider_s1, 'Value', s1);
    set(controls.slider_s2, 'Value', s2);
    set(controls.slider_s3, 'Value', s3);
    set(controls.slider_dop, 'Value', dop);

    update_plot([], [], fig);
end
