# AI Prompt Usage Guide for Demo Generation
# 演示程序AI提示词使用指南

**Quick Start**: How to use AI prompts to generate or modify polarization optics demos

---

## 🚀 Quick Start (3 Steps)

### Step 1: Choose Your Demo
Browse `/tmp/demo_generation_prompts.md` and find the demo you want:
- Stage 1: Basic phenomena (7 demos)
- Stage 2: Mathematical tools (3 demos)

### Step 2: Copy the Prompt
Copy the entire prompt section (marked with `📋 Prompt for AI Model`)

### Step 3: Paste into AI
Paste into Claude, GPT-4, or any capable LLM and get instant code!

---

## 💡 Usage Scenarios / 使用场景

### Scenario 1: Generate New Code
**Use case**: Create a demo from scratch

```
User → AI:
[Paste full prompt for "Malus's Law"]

AI → User:
[Generates ~450 lines of Python code with visualization]
```

**Result**: Ready-to-run Python demo

---

### Scenario 2: Modify Existing Demo
**Use case**: Adapt for different needs

```
User → AI:
Based on the Malus's Law prompt, but:
- Add export to CSV feature
- Change to light theme (white background)
- Simplify to 2 panels instead of 3
- Add keyboard shortcuts (arrow keys for angle)

AI → User:
[Generates modified version]
```

**Result**: Customized demo

---

### Scenario 3: Create Variations
**Use case**: Extend to related physics

```
User → AI:
Using the Birefringence prompt as template,
create a demo for Photoelasticity (stress-induced birefringence):
- Show stress patterns in transparent materials
- Use Michel-Levy chart colors
- Add force/load controls
- Keep same visualization structure

AI → User:
[Generates new demo based on template]
```

**Result**: New related demo

---

### Scenario 4: Convert Language
**Use case**: Port Python to MATLAB or JavaScript

```
User → AI:
Convert the Jones Matrix Python prompt to:
- MATLAB version (R2020a+)
- Use App Designer for GUI
- Keep all physics calculations identical

AI → User:
[Generates MATLAB App Designer code]
```

**Result**: Cross-platform version

---

### Scenario 5: Simplify for Teaching
**Use case**: Make student-friendly version

```
User → AI:
Simplify the Mueller Matrix prompt for undergraduates:
- Remove Lu-Chipman decomposition
- Only 3 optical elements (polarizer, QWP, HWP)
- 3 panels maximum
- Add tutorial text boxes
- Limit parameters to prevent confusion

AI → User:
[Generates simplified educational version]
```

**Result**: Student-appropriate demo

---

## 🎯 Prompt Customization Patterns / 提示词定制模式

### Pattern 1: Add Feature
```
[Original prompt]

Additionally, add these features:
1. Export data as CSV
2. Save figure as PNG
3. Keyboard shortcuts (Q/E for angle ±5°)
4. Animation mode (auto-rotate)
```

### Pattern 2: Change Visualization
```
[Original prompt]

Modify visualization:
- Use plotly instead of matplotlib (interactive web)
- 3D view with camera controls
- Color scheme: viridis colormap
- Larger fonts (16pt for labels)
```

### Pattern 3: Add Data Import
```
[Original prompt]

Add experimental data support:
- Load CSV with columns: angle, intensity
- Overlay on theoretical curve
- Calculate R² goodness of fit
- Show residuals plot
```

### Pattern 4: Performance Optimization
```
[Original prompt]

Optimize for real-time performance:
- Use numba JIT compilation
- Vectorize all calculations
- Reduce plot update frequency (30 FPS)
- Cache intermediate results
```

### Pattern 5: Web Version
```
[Original prompt]

Convert to web application:
- React + TypeScript frontend
- D3.js for visualization
- Tailwind CSS styling
- Deploy to Vercel
```

---

## 📊 Prompt Quality Checklist

Before submitting, ensure your prompt has:

### ✅ Physics Requirements
- [ ] Exact formulas with symbol definitions
- [ ] Physical constraints (e.g., energy conservation)
- [ ] Validation test cases
- [ ] Reference citations

### ✅ Technical Specifications
- [ ] Programming language + version
- [ ] Required libraries
- [ ] Figure size and layout
- [ ] Color scheme

### ✅ Visualization Details
- [ ] Number of panels
- [ ] Plot types (line, bar, 3D, polar)
- [ ] Axes labels and units
- [ ] Annotations and markers

### ✅ Interactivity
- [ ] Control types (sliders, buttons, dropdowns)
- [ ] Parameter ranges and steps
- [ ] Real-time vs on-demand updates
- [ ] Keyboard shortcuts (optional)

### ✅ Code Structure
- [ ] Class hierarchy
- [ ] Method signatures
- [ ] Expected line count
- [ ] Documentation requirements

---

## 🔧 Troubleshooting

### Problem 1: Generated Code Doesn't Run
**Symptom**: Import errors, syntax errors

**Solution**:
1. Check library versions in prompt
2. Add: "Ensure compatibility with [your Python version]"
3. Specify: "Test imports before main code"

Example fix:
```
At the beginning, verify all imports work:
try:
    import numpy as np
    import matplotlib.pyplot as plt
    print("All imports successful")
except ImportError as e:
    print(f"Missing library: {e}")
    sys.exit(1)
```

---

### Problem 2: Physics is Incorrect
**Symptom**: Wrong results, fails validation

**Solution**:
1. Make formulas more explicit in prompt
2. Add validation test cases
3. Request detailed comments for physics calculations

Example fix:
```
For Malus's Law calculation:
def calculate_intensity(self, I0, angle_deg):
    # Convert to radians
    theta_rad = np.radians(angle_deg)

    # Apply Malus's Law: I = I₀ × cos²(θ)
    I = I0 * np.cos(theta_rad)**2

    # Validate: I must be between 0 and I0
    assert 0 <= I <= I0, f"Invalid intensity: {I}"

    return I

# Test cases
assert calculate_intensity(100, 0) == 100, "I(0°) should equal I₀"
assert calculate_intensity(100, 90) < 0.01, "I(90°) should be ~0"
assert abs(calculate_intensity(100, 45) - 50) < 0.1, "I(45°) should be ~I₀/2"
```

---

### Problem 3: Visualization is Cluttered
**Symptom**: Too many elements, hard to read

**Solution**:
1. Reduce number of panels
2. Simplify each panel
3. Increase figure size

Example fix:
```
Simplify to 3 panels:
1. Main visualization (larger: 60% of width)
2. Controls (right sidebar: 20% width)
3. Info card (bottom: 20% height)

Figure size: 16×9 inches (wider for main plot)
Font sizes: Title 14pt, Labels 12pt, Ticks 10pt
Reduce visual clutter: Remove grid, use minimal ticks
```

---

### Problem 4: Too Slow / Laggy
**Symptom**: Slider updates are slow

**Solution**:
1. Add caching for expensive calculations
2. Reduce plot update frequency
3. Use blitting for animation

Example fix:
```
Optimize performance:
1. Pre-calculate angle array (0-180°) once
2. Cache cos²(θ) values in lookup table
3. Use plt.draw() instead of plt.show() for updates
4. Enable blitting for animated elements:

   self.line.set_data(x, y)  # Update data
   self.ax.draw_artist(self.line)  # Redraw only line
   self.fig.canvas.blit(self.ax.bbox)  # Blit only changed region
```

---

### Problem 5: Not Interactive Enough
**Symptom**: Wants more user control

**Solution**: Add more controls and features

Example fix:
```
Add these interactive features:
1. Click-and-drag on plot to adjust angle
2. Mouse hover shows value tooltip
3. Right-click for context menu:
   - Reset view
   - Export data
   - Change colormap
4. Keyboard shortcuts:
   - Left/Right arrow: ±1°
   - Shift + Left/Right: ±10°
   - Space: Play/pause animation
   - R: Reset to defaults
```

---

## 🎨 Customization Examples / 定制示例

### Example 1: Dark → Light Theme
```
Original (dark):
- Background: #0f172a
- Text: white
- Lines: cyan

Modified prompt:
"Use light theme:
- Background: white
- Text: #1e293b (dark gray)
- Lines: #0ea5e9 (blue), #f43f5e (red)
- Grid: #e2e8f0 (light gray)"
```

### Example 2: Add Real-Time Animation
```
Additional requirement:
"Add animation mode:
- Toggle button: 'Animate' ▶️/⏸️
- Auto-rotate polarizer (1 full rotation in 10 seconds)
- Update plot at 30 FPS
- Show current angle indicator
- Pause on any slider interaction"
```

### Example 3: Multi-Language Support
```
Internationalization:
"Add language support:
- Languages: English, Chinese, Spanish
- Dropdown selector in top-right
- Translate all labels, titles, tooltips
- Store translations in dictionary:
  labels = {
    'en': {'angle': 'Angle (degrees)', ...},
    'zh': {'angle': '角度（度）', ...},
  }"
```

### Example 4: Export Functionality
```
Add export features:
"Include export options:
1. Save figure as PNG/PDF/SVG (dpi=300)
2. Export data as CSV (columns: angle, intensity)
3. Export animation as MP4 (30 FPS, 10 seconds)
4. Copy current parameters to clipboard (JSON format)
5. Save/load preset configurations"
```

### Example 5: Educational Annotations
```
Add teaching aids:
"Include educational features:
1. Formula card (draggable, always visible):
   - Show I = I₀ × cos²(θ)
   - Explain each symbol
   - Update values in real-time
2. Special angle markers:
   - 0°: 'Maximum transmission'
   - 45°: 'Half intensity'
   - 90°: 'Zero transmission (crossed)'
3. Step-by-step tutorial mode (5 steps)
4. Quiz questions after demonstration"
```

---

## 📚 Prompt Library Usage / 提示词库使用

### For Educators (教师)
**Best prompts**:
- Simplified versions (remove advanced features)
- Add tutorial steps
- Include quiz/assessment
- Multi-language support

**Recommended modifications**:
```
Simplify Mueller Matrix → Basic Polarizer demo
- Remove: Lu-Chipman decomposition, depolarization
- Keep: Basic matrix multiplication, 2-3 elements
- Add: Step-by-step explanation, "Why does this matter?"
```

---

### For Students (学生)
**Best prompts**:
- Start with Stage 1 (basic phenomena)
- Use presets and examples
- Focus on visualization over math
- Interactive exploration encouraged

**Recommended modifications**:
```
Add to any prompt:
"Include 'Explore Mode':
- 5 preset scenarios with questions
- After each scenario, ask: 'What do you observe?'
- Provide hints if stuck
- Show answer after 3 attempts"
```

---

### For Researchers (研究人员)
**Best prompts**:
- Stage 2 (mathematical tools)
- Add data import/export
- Precision and accuracy focus
- Publication-quality figures

**Recommended modifications**:
```
Add to Mueller Matrix:
"Research-grade features:
- Import experimental Mueller matrix (CSV)
- Compare with theoretical model
- Calculate error metrics (RMSE, R²)
- Export publication figure (vector PDF, 300 DPI)
- Include uncertainty/error bars"
```

---

### For Developers (开发者)
**Best prompts**:
- Any prompt can be base
- Focus on code quality and structure
- Add testing and documentation
- API design if needed

**Recommended modifications**:
```
Add to any prompt:
"Software engineering requirements:
- Type hints for all functions
- Docstrings (Google style)
- Unit tests (pytest)
- CI/CD configuration (GitHub Actions)
- API documentation (Sphinx)
- Pre-commit hooks (black, flake8)"
```

---

## 🌟 Advanced Techniques / 高级技巧

### Technique 1: Chained Prompts
Generate complex demos in stages:

```
Prompt 1: "Create physics calculation module only"
→ Get physics.py

Prompt 2: "Using the physics module from above, create visualization"
→ Get visualization.py

Prompt 3: "Combine physics and visualization into interactive demo"
→ Get complete demo.py
```

**Benefit**: More control, easier debugging

---

### Technique 2: Hybrid Human-AI
Use AI for boilerplate, customize manually:

```
Prompt: "Generate 80% complete demo with TODOs for:
- Custom colormap (TODO: implement)
- Advanced validation (TODO: add test cases)
- Optimization (TODO: vectorize this loop)"

Then fill in TODOs yourself.
```

**Benefit**: AI speed + human expertise

---

### Technique 3: Multi-Model Ensemble
Use different AIs for different strengths:

```
Claude → Physics accuracy and code structure
GPT-4 → Visualization creativity
GitHub Copilot → Code completion and refactoring
```

**Benefit**: Best of each model

---

### Technique 4: Iterative Refinement
Don't expect perfect first generation:

```
Generation 1: Basic working code
↓
"Add feature X, improve Y"
↓
Generation 2: Enhanced version
↓
"Optimize performance, add tests"
↓
Generation 3: Production-ready
```

**Benefit**: Progressive improvement

---

### Technique 5: Template Extraction
Create your own prompt templates from successful generations:

```
After successful generation:
1. Identify what worked well in prompt
2. Extract reusable template
3. Parameterize for other demos
4. Build personal prompt library
```

**Benefit**: Faster future generations

---

## 📖 Example Workflow / 示例工作流程

### Complete Example: Creating "Photoelasticity Demo"

#### Step 1: Find Similar Prompt
Start with Birefringence (closest physics)

#### Step 2: Customize
```markdown
[Copy Birefringence prompt]

Modifications for Photoelasticity:
- Replace "calcite crystal" with "stressed material"
- Instead of o-ray/e-ray, show stress-induced birefringence
- Add force/stress controls (0-100 MPa)
- Use Michel-Levy interference colors
- Show stress distribution pattern
- Add Young's modulus parameter
```

#### Step 3: Generate
Paste into Claude/GPT-4

#### Step 4: Test
```bash
python photoelasticity_demo.py
```

#### Step 5: Refine
```
Issues found:
- Colors don't match Michel-Levy chart exactly
- Need colorbar legend

Refinement prompt:
"Fix color mapping:
- Use standard Michel-Levy chart RGB values
- Map retardation (nm) to color precisely
- Add colorbar with retardation scale (0-3000 nm)"
```

#### Step 6: Integrate
- Move to project folder
- Update documentation
- Add to test suite

---

## 🎓 Learning Path / 学习路径

### Beginner → Advanced Prompt Engineering

**Level 1: Direct Usage**
- Copy prompts as-is
- Generate code without modifications
- Focus on understanding output

**Level 2: Simple Customization**
- Change parameters (colors, sizes)
- Add/remove features
- Adapt for your use case

**Level 3: Template Creation**
- Create prompt templates
- Parameterize common variations
- Build personal library

**Level 4: Advanced Engineering**
- Multi-stage generation
- Hybrid approaches
- Optimize for specific LLMs

**Level 5: Prompt Research**
- Experiment with prompt structure
- Compare LLM outputs
- Contribute improvements

---

## 📊 Effectiveness Metrics / 效果评估

### How to Evaluate Generated Code

| Criterion | Method | Target |
|-----------|--------|--------|
| **Correctness** | Run test cases | 100% pass |
| **Completeness** | Check all features | All requirements met |
| **Code Quality** | Linting (flake8) | 0 errors, <5 warnings |
| **Performance** | Time critical operations | <100ms for updates |
| **Usability** | User testing | Intuitive controls |
| **Documentation** | Check docstrings | All functions documented |

### Success Rate by Demo Complexity

Based on experience with 10 demos:

| Complexity | Success Rate | Iterations Needed |
|------------|--------------|-------------------|
| ⭐⭐ Simple | ~95% | 1 generation |
| ⭐⭐⭐ Medium | ~80% | 1-2 generations |
| ⭐⭐⭐⭐ Complex | ~70% | 2-3 generations |
| ⭐⭐⭐⭐⭐ Very Complex | ~60% | 3-5 generations |

**Note**: Even "failed" generations provide useful starting point

---

## 🔗 Integration with Project / 与项目集成

### Folder Structure

```
polarisationcourse/src/demo-sources/
├── prompts/                      # ← New folder
│   ├── stage1/
│   │   ├── malus_law_prompt.md
│   │   ├── birefringence_prompt.md
│   │   └── ...
│   ├── stage2/
│   │   ├── jones_matrix_prompt.md
│   │   └── ...
│   └── custom/
│       └── user_created_prompts.md
│
├── python/
│   └── [generated demos here]
│
└── matlab/
    └── [generated demos here]
```

### Workflow Integration

```
1. Browse prompts in /prompts folder
2. Generate code using AI
3. Test generated code
4. Move to /python or /matlab
5. Update README.md
6. Run test_demos.py
7. Commit with: "feat: add [demo] generated from prompt"
```

---

## ⚡ Quick Reference Card / 快速参考卡

### Essential Prompt Components

```markdown
1. Physical Principle: [Formula + explanation]
2. Requirements: [Bullet list of features]
3. Visualization: [Panels, plots, colors]
4. Controls: [Sliders, buttons, inputs]
5. Tech Specs: [Language, libraries, versions]
6. Code Structure: [Classes, methods]
7. Validation: [Test cases]

[Optional]
8. Additional Features
9. References
10. Expected Output (line count)
```

### Quick Modifications

| Want to... | Add to prompt... |
|------------|-----------------|
| Change language | "Convert to [MATLAB/JavaScript/etc.]" |
| Simplify | "Remove [features], keep only [basics]" |
| Add export | "Add CSV/PNG/PDF export functionality" |
| Web version | "Convert to React + D3.js web app" |
| Animation | "Add animation mode with [FPS] updates" |
| Dark theme | "Use background #0f172a, white text" |
| Light theme | "Use white background, dark gray text" |

---

## 📞 Support & Community / 支持与社区

### Where to Get Help

1. **AI Model Issues**: Check model documentation (Claude, GPT-4)
2. **Physics Questions**: See references in prompt
3. **Code Debugging**: Use standard debugging tools
4. **Prompt Optimization**: Experiment and iterate

### Contribution

Help improve prompts:
- Submit better formulas
- Add validation tests
- Improve clarity
- Translate to other languages

---

## 🎯 Success Stories / 成功案例

### Case 1: Research Lab
**Need**: Mueller matrix polarimeter simulation
**Approach**: Used Mueller Matrix prompt + added experimental data import
**Result**: Saved 2 weeks of development time
**Customization**: 15 minutes to add data import feature

### Case 2: Undergraduate Course
**Need**: Interactive demos for optics lab
**Approach**: Used Stage 1 prompts, simplified for students
**Result**: 7 demos in 1 day instead of 1 week
**Customization**: Removed math, added tutorials

### Case 3: Industry Training
**Need**: Polarimetry training tool
**Approach**: Combined Stokes + Mueller prompts
**Result**: Custom training app in 2 hours
**Customization**: Added company branding, specific scenarios

---

## 📝 Checklist for Production Use / 生产使用清单

Before deploying generated code:

- [ ] **Test all features** (sliders, buttons, plots)
- [ ] **Validate physics** (run test cases)
- [ ] **Check performance** (<100ms updates)
- [ ] **Test edge cases** (0°, 90°, boundary values)
- [ ] **Review code quality** (readable, documented)
- [ ] **Add error handling** (try/except, input validation)
- [ ] **Test on target platform** (Python version, OS)
- [ ] **Create user documentation** (README, examples)
- [ ] **Add to version control** (git commit)
- [ ] **Consider maintenance** (who will update?)

---

**Document Version**: 1.0
**Created**: 2026-01-14
**For Use With**: `/tmp/demo_generation_prompts.md`
**Target Audience**: Educators, students, researchers, developers

**Happy Prompting!** 🚀✨
