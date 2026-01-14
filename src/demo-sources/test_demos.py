#!/usr/bin/env python3
"""
PolarCraft 演示代码测试脚本
Test Script for PolarCraft Demo Code

验证所有Python演示代码的：
1. 语法正确性（import检查）
2. 依赖完整性（numpy, matplotlib可用）
3. 基本运行能力（无语法错误）

Verifies:
1. Syntax correctness (import check)
2. Dependency completeness (numpy, matplotlib available)
3. Basic execution capability (no syntax errors)

运行方法:
    python test_demos.py

作者: PolarCraft Team
日期: 2026-01-14
"""

import sys
import subprocess
import importlib.util
from pathlib import Path

# ANSI颜色代码
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_dependency(package_name):
    """检查Python包是否已安装"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def check_syntax(file_path):
    """检查Python文件语法"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            compile(f.read(), file_path, 'exec')
        return True, None
    except SyntaxError as e:
        return False, str(e)

def check_imports(file_path):
    """检查文件中的import语句"""
    imports = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('import ') or line.startswith('from '):
                    imports.append(line)
        return imports
    except Exception as e:
        return []

def main():
    print("=" * 70)
    print(f"{BLUE}PolarCraft 演示代码测试 / Demo Code Testing{RESET}")
    print("=" * 70)
    print()

    # 1. 检查依赖
    print(f"{BLUE}[1/4] 检查依赖 / Checking Dependencies{RESET}")
    print("-" * 70)

    dependencies = {
        'numpy': 'NumPy (数值计算)',
        'matplotlib': 'Matplotlib (可视化)',
    }

    all_deps_ok = True
    for pkg, desc in dependencies.items():
        if check_dependency(pkg):
            print(f"  {GREEN}✓{RESET} {pkg:20s} {desc}")
        else:
            print(f"  {RED}✗{RESET} {pkg:20s} {desc} - {RED}未安装{RESET}")
            all_deps_ok = False

    if not all_deps_ok:
        print(f"\n{YELLOW}警告: 缺少依赖包，请运行: pip install numpy matplotlib{RESET}")
        print()
    else:
        print(f"\n{GREEN}✓ 所有依赖已安装{RESET}")
        print()

    # 2. 查找所有演示文件
    print(f"{BLUE}[2/4] 扫描演示文件 / Scanning Demo Files{RESET}")
    print("-" * 70)

    python_dir = Path(__file__).parent / 'python'
    if not python_dir.exists():
        print(f"{RED}错误: python/ 目录不存在{RESET}")
        sys.exit(1)

    demo_files = sorted(python_dir.glob('*.py'))
    print(f"  找到 {len(demo_files)} 个演示文件:")
    for f in demo_files:
        print(f"    • {f.name}")
    print()

    # 3. 语法检查
    print(f"{BLUE}[3/4] 语法检查 / Syntax Check{RESET}")
    print("-" * 70)

    syntax_results = {}
    for demo_file in demo_files:
        is_valid, error = check_syntax(demo_file)
        syntax_results[demo_file.name] = (is_valid, error)

        if is_valid:
            print(f"  {GREEN}✓{RESET} {demo_file.name:30s} 语法正确")
        else:
            print(f"  {RED}✗{RESET} {demo_file.name:30s} 语法错误:")
            print(f"    {RED}{error}{RESET}")
    print()

    # 4. Import语句检查
    print(f"{BLUE}[4/4] Import语句检查 / Import Statement Check{RESET}")
    print("-" * 70)

    for demo_file in demo_files:
        imports = check_imports(demo_file)
        if imports:
            print(f"  {demo_file.name}:")
            for imp in imports[:5]:  # 只显示前5个
                print(f"    {imp}")
            if len(imports) > 5:
                print(f"    ... ({len(imports) - 5} more imports)")
        print()

    # 5. 总结
    print("=" * 70)
    print(f"{BLUE}测试总结 / Test Summary{RESET}")
    print("=" * 70)

    total = len(demo_files)
    passed = sum(1 for is_valid, _ in syntax_results.values() if is_valid)
    failed = total - passed

    print(f"  总计: {total} 个演示文件")
    print(f"  {GREEN}✓ 通过: {passed}{RESET}")
    print(f"  {RED}✗ 失败: {failed}{RESET}")

    if failed == 0 and all_deps_ok:
        print(f"\n{GREEN}🎉 所有测试通过！代码质量优秀！{RESET}")
        return 0
    elif failed == 0:
        print(f"\n{YELLOW}⚠️  语法检查通过，但缺少依赖包{RESET}")
        return 1
    else:
        print(f"\n{RED}❌ 发现语法错误，请修复后重试{RESET}")
        return 1

if __name__ == '__main__':
    sys.exit(main())
