"""
Export Utilities for PolarCraft Physics Demos
PolarCraft物理演示的导出工具

Provides convenient CSV and JSON export functions for saving simulation data,
enabling further analysis in other tools (Excel, MATLAB, Python, etc.).
提供便捷的CSV和JSON导出函数，保存模拟数据供进一步分析。

Features 特性:
- CSV export with headers and metadata
- JSON export with nested structures
- Automatic timestamp generation
- Parameter tracking
- Unicode support (UTF-8)

Author: PolarCraft Team
License: MIT
"""

import csv
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import numpy as np


class NumpyEncoder(json.JSONEncoder):
    """
    Custom JSON encoder for NumPy data types
    NumPy数据类型的自定义JSON编码器
    """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, complex):
            return {'real': obj.real, 'imag': obj.imag}
        return super(NumpyEncoder, self).default(obj)


def export_to_csv(
    data: Union[List[List[Any]], Dict[str, List[Any]]],
    filename: str,
    headers: Optional[List[str]] = None,
    metadata: Optional[Dict[str, Any]] = None,
    output_dir: str = './exports'
) -> Path:
    """
    Export data to CSV file with optional metadata header
    将数据导出为CSV文件，可包含元数据头

    Parameters:
        data: Either a 2D list [[row1], [row2], ...] or a dict of columns {'col1': [vals], 'col2': [vals]}
        filename: Output filename (without .csv extension)
        headers: Column headers (optional, auto-generated if data is dict)
        metadata: Dict of metadata to include as comment lines at top of file
        output_dir: Directory to save file (default: './exports')

    Returns:
        Path object of the created file

    Example:
        >>> # Export angle vs intensity data
        >>> angles = np.linspace(0, 90, 100)
        >>> intensities = np.cos(np.deg2rad(angles))**2
        >>> data = {'Angle (deg)': angles, 'Intensity': intensities}
        >>> metadata = {'Demo': 'Malus Law', 'Polarizer Angle': '45°'}
        >>> export_to_csv(data, 'malus_law_data', metadata=metadata)
    """
    # Create output directory if it doesn't exist
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate full file path
    filepath = output_path / f"{filename}.csv"

    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        # Write metadata as comment lines
        if metadata:
            csvfile.write(f"# Exported from PolarCraft Physics Demo\n")
            csvfile.write(f"# Timestamp: {datetime.now().isoformat()}\n")
            for key, value in metadata.items():
                csvfile.write(f"# {key}: {value}\n")
            csvfile.write("#\n")

        # Handle dict input (column-based data)
        if isinstance(data, dict):
            if headers is None:
                headers = list(data.keys())

            # Convert dict to row-based list
            num_rows = len(next(iter(data.values())))
            rows = [[data[col][i] for col in headers] for i in range(num_rows)]
            data = rows

        # Write CSV data
        writer = csv.writer(csvfile)

        if headers:
            writer.writerow(headers)

        writer.writerows(data)

    print(f"✓ CSV exported successfully: {filepath}")
    return filepath


def export_to_json(
    data: Dict[str, Any],
    filename: str,
    metadata: Optional[Dict[str, Any]] = None,
    output_dir: str = './exports',
    indent: int = 2
) -> Path:
    """
    Export data to JSON file with optional metadata
    将数据导出为JSON文件，可包含元数据

    Parameters:
        data: Dictionary of data to export
        filename: Output filename (without .json extension)
        metadata: Dict of metadata to include at top level
        output_dir: Directory to save file (default: './exports')
        indent: JSON indentation level (default: 2)

    Returns:
        Path object of the created file

    Example:
        >>> # Export Jones matrix and vectors
        >>> data = {
        >>>     'input_vector': {'Ex': 1.0, 'Ey': 0.0},
        >>>     'jones_matrix': [[1, 0], [0, 0]],
        >>>     'output_vector': {'Ex': 1.0, 'Ey': 0.0},
        >>>     'intensity': 1.0
        >>> }
        >>> metadata = {'Demo': 'Jones Matrix', 'Element': 'Horizontal Polarizer'}
        >>> export_to_json(data, 'jones_matrix_data', metadata=metadata)
    """
    # Create output directory if it doesn't exist
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate full file path
    filepath = output_path / f"{filename}.json"

    # Prepare export structure
    export_data = {
        'metadata': {
            'source': 'PolarCraft Physics Demo',
            'timestamp': datetime.now().isoformat(),
            **(metadata or {})
        },
        'data': data
    }

    # Write JSON file with custom encoder for NumPy types
    with open(filepath, 'w', encoding='utf-8') as jsonfile:
        json.dump(export_data, jsonfile, indent=indent, cls=NumpyEncoder)

    print(f"✓ JSON exported successfully: {filepath}")
    return filepath


def export_plot_data(
    x_data: np.ndarray,
    y_data: Union[np.ndarray, List[np.ndarray]],
    filename: str,
    x_label: str = 'X',
    y_labels: Optional[Union[str, List[str]]] = None,
    format: str = 'csv',
    metadata: Optional[Dict[str, Any]] = None,
    output_dir: str = './exports'
) -> Path:
    """
    Export plot data (x-y curves) to CSV or JSON
    导出绘图数据（x-y曲线）为CSV或JSON

    Convenient wrapper for exporting matplotlib plot data.
    用于导出matplotlib绘图数据的便捷包装函数。

    Parameters:
        x_data: X-axis data (1D array)
        y_data: Y-axis data (1D array or list of 1D arrays for multiple curves)
        filename: Output filename (without extension)
        x_label: Label for x-axis column
        y_labels: Label(s) for y-axis column(s)
        format: 'csv' or 'json'
        metadata: Dict of metadata
        output_dir: Directory to save file

    Returns:
        Path object of the created file

    Example:
        >>> # Export Fresnel reflectance curves
        >>> angles = np.linspace(0, 90, 100)
        >>> R_s = calculate_fresnel_s(angles)
        >>> R_p = calculate_fresnel_p(angles)
        >>> export_plot_data(
        >>>     angles, [R_s, R_p],
        >>>     'fresnel_reflectance',
        >>>     x_label='Incident Angle (deg)',
        >>>     y_labels=['R_s', 'R_p'],
        >>>     metadata={'n1': 1.0, 'n2': 1.5}
        >>> )
    """
    # Handle single y_data array
    if isinstance(y_data, np.ndarray) and y_data.ndim == 1:
        y_data = [y_data]
        if y_labels is None:
            y_labels = ['Y']
        elif isinstance(y_labels, str):
            y_labels = [y_labels]

    # Auto-generate labels if not provided
    if y_labels is None:
        y_labels = [f'Y{i+1}' for i in range(len(y_data))]

    if format.lower() == 'csv':
        # Prepare column-based dict
        data_dict = {x_label: x_data}
        for label, y_vals in zip(y_labels, y_data):
            data_dict[label] = y_vals

        return export_to_csv(data_dict, filename, metadata=metadata, output_dir=output_dir)

    elif format.lower() == 'json':
        # Prepare nested structure
        data_dict = {
            'x': {
                'label': x_label,
                'values': x_data
            },
            'y': []
        }
        for label, y_vals in zip(y_labels, y_data):
            data_dict['y'].append({
                'label': label,
                'values': y_vals
            })

        return export_to_json(data_dict, filename, metadata=metadata, output_dir=output_dir)

    else:
        raise ValueError(f"Unsupported format: {format}. Use 'csv' or 'json'.")


def export_matrix(
    matrix: np.ndarray,
    filename: str,
    matrix_name: str = 'Matrix',
    format: str = 'csv',
    metadata: Optional[Dict[str, Any]] = None,
    output_dir: str = './exports'
) -> Path:
    """
    Export matrix data (Jones, Mueller, etc.) to CSV or JSON
    导出矩阵数据（Jones、Mueller等）为CSV或JSON

    Parameters:
        matrix: 2D NumPy array
        filename: Output filename (without extension)
        matrix_name: Descriptive name for the matrix
        format: 'csv' or 'json'
        metadata: Dict of metadata
        output_dir: Directory to save file

    Returns:
        Path object of the created file

    Example:
        >>> # Export Jones matrix for horizontal polarizer
        >>> J = np.array([[1, 0], [0, 0]])
        >>> export_matrix(
        >>>     J, 'horizontal_polarizer_jones',
        >>>     matrix_name='Jones Matrix - Horizontal Polarizer',
        >>>     metadata={'Type': 'Linear Polarizer', 'Angle': '0°'}
        >>> )
    """
    if format.lower() == 'csv':
        # Convert matrix to list of rows
        rows = matrix.tolist()
        headers = [f"Col{i+1}" for i in range(matrix.shape[1])]

        # Add matrix name to metadata
        if metadata is None:
            metadata = {}
        metadata['Matrix'] = matrix_name
        metadata['Shape'] = f"{matrix.shape[0]}x{matrix.shape[1]}"

        return export_to_csv(rows, filename, headers=headers, metadata=metadata, output_dir=output_dir)

    elif format.lower() == 'json':
        data_dict = {
            'matrix_name': matrix_name,
            'shape': matrix.shape,
            'values': matrix
        }

        return export_to_json(data_dict, filename, metadata=metadata, output_dir=output_dir)

    else:
        raise ValueError(f"Unsupported format: {format}. Use 'csv' or 'json'.")


def export_stokes_vector(
    S: np.ndarray,
    filename: str,
    format: str = 'json',
    metadata: Optional[Dict[str, Any]] = None,
    output_dir: str = './exports'
) -> Path:
    """
    Export Stokes vector with polarization parameters
    导出Stokes向量及偏振参数

    Parameters:
        S: Stokes vector [S0, S1, S2, S3]
        filename: Output filename (without extension)
        format: 'csv' or 'json' (json recommended for nested structure)
        metadata: Dict of metadata
        output_dir: Directory to save file

    Returns:
        Path object of the created file

    Example:
        >>> # Export Stokes vector and DOP
        >>> S = np.array([1.0, 0.5, 0.5, 0.0])
        >>> export_stokes_vector(S, 'stokes_data', metadata={'Demo': 'Stokes Vector'})
    """
    S0, S1, S2, S3 = S

    # Calculate polarization parameters
    DOP = np.sqrt(S1**2 + S2**2 + S3**2) / S0 if S0 > 0 else 0
    DOLP = np.sqrt(S1**2 + S2**2) / S0 if S0 > 0 else 0
    DOCP = abs(S3) / S0 if S0 > 0 else 0

    # Calculate orientation angle
    if S1 != 0 or S2 != 0:
        psi = 0.5 * np.arctan2(S2, S1)
        psi_deg = np.rad2deg(psi)
    else:
        psi_deg = 0.0

    # Calculate ellipticity angle
    if S0 > 0:
        chi = 0.5 * np.arcsin(S3 / S0)
        chi_deg = np.rad2deg(chi)
    else:
        chi_deg = 0.0

    data_dict = {
        'stokes_vector': {
            'S0': float(S0),
            'S1': float(S1),
            'S2': float(S2),
            'S3': float(S3)
        },
        'polarization_parameters': {
            'DOP': float(DOP),
            'DOLP': float(DOLP),
            'DOCP': float(DOCP),
            'orientation_angle_deg': float(psi_deg),
            'ellipticity_angle_deg': float(chi_deg)
        }
    }

    if format.lower() == 'json':
        return export_to_json(data_dict, filename, metadata=metadata, output_dir=output_dir)
    elif format.lower() == 'csv':
        # Flatten structure for CSV
        rows = [
            ['Parameter', 'Value'],
            ['S0', S0],
            ['S1', S1],
            ['S2', S2],
            ['S3', S3],
            ['DOP', DOP],
            ['DOLP', DOLP],
            ['DOCP', DOCP],
            ['Orientation Angle (deg)', psi_deg],
            ['Ellipticity Angle (deg)', chi_deg]
        ]
        return export_to_csv(rows, filename, metadata=metadata, output_dir=output_dir)
    else:
        raise ValueError(f"Unsupported format: {format}. Use 'csv' or 'json'.")


# ============================================================================
# EXAMPLE USAGE
# 使用示例
# ============================================================================

if __name__ == '__main__':
    """
    Example usage of export utilities
    导出工具的使用示例
    """
    print("=== PolarCraft Export Utilities Demo ===\n")

    # Example 1: Export Malus's Law data
    print("1. Exporting Malus's Law data...")
    angles = np.linspace(0, 90, 100)
    intensities = np.cos(np.deg2rad(angles))**2

    export_plot_data(
        angles, intensities,
        'malus_law_example',
        x_label='Polarizer Angle (deg)',
        y_labels='Normalized Intensity',
        format='csv',
        metadata={
            'Demo': "Malus's Law",
            'Formula': 'I = I₀ × cos²(θ)',
            'I0': 1.0
        }
    )

    # Example 2: Export Fresnel curves
    print("\n2. Exporting Fresnel reflectance curves...")
    angles = np.linspace(0, 89, 100)
    n1, n2 = 1.0, 1.5

    # Calculate Fresnel coefficients (simplified)
    theta_i = np.deg2rad(angles)
    cos_i = np.cos(theta_i)
    sin_i = np.sin(theta_i)
    sin_t = (n1/n2) * sin_i

    # Avoid total internal reflection
    valid = sin_t < 1
    cos_t = np.sqrt(1 - sin_t[valid]**2)

    R_s = np.zeros_like(angles)
    R_p = np.zeros_like(angles)

    R_s[valid] = ((n1*cos_i[valid] - n2*cos_t) / (n1*cos_i[valid] + n2*cos_t))**2
    R_p[valid] = ((n1*cos_t - n2*cos_i[valid]) / (n1*cos_t + n2*cos_i[valid]))**2

    export_plot_data(
        angles, [R_s, R_p],
        'fresnel_example',
        x_label='Incident Angle (deg)',
        y_labels=['R_s (⊥)', 'R_p (∥)'],
        format='csv',
        metadata={
            'Demo': 'Fresnel Equations',
            'n1': n1,
            'n2': n2,
            'Brewster Angle (deg)': float(np.rad2deg(np.arctan(n2/n1)))
        }
    )

    # Example 3: Export Jones matrix
    print("\n3. Exporting Jones matrix...")
    angle_deg = 45
    angle = np.deg2rad(angle_deg)
    c, s = np.cos(angle), np.sin(angle)

    J_polarizer = np.array([
        [c**2, c*s],
        [c*s, s**2]
    ])

    export_matrix(
        J_polarizer,
        'jones_polarizer_45deg_example',
        matrix_name='Linear Polarizer Jones Matrix',
        format='json',
        metadata={
            'Demo': 'Jones Matrix',
            'Element': 'Linear Polarizer',
            'Angle': f'{angle_deg}°',
            'Type': 'Complex 2×2'
        }
    )

    # Example 4: Export Stokes vector
    print("\n4. Exporting Stokes vector...")
    S = np.array([1.0, 0.707, 0.707, 0.0])  # +45° linear polarization

    export_stokes_vector(
        S,
        'stokes_45deg_linear_example',
        format='json',
        metadata={
            'Demo': 'Stokes Parameters',
            'Polarization State': '+45° Linear'
        }
    )

    print("\n✓ All examples exported successfully!")
    print("Check the './exports' directory for output files.")
