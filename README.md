NAME : NIRNAYA RAJPUT 

DOAMIN : JAVA PROGRAMMING 

INTERN ID : CITS8563

# TEMPERATURE-CONVERTOR
A Temperature Converter is a simple and user-friendly application that allows users to convert temperatures between different measurement units quickly and accurately. The application can convert values between Celsius, Fahrenheit, and Kelvin, making temperature calculations easy and convenient.
<div align="center">

# 🌡️ TempFlux — Modern Temperature Suite

**An ultra-modern, scientific & everyday temperature conversion engine and visualizer built with Vanilla Web Technologies.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Design-success?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

[✨ Live Demo](#-live-demo) • [🔥 Features](#-features) • [📐 Formula Matrix](#-mathematical-formulas) • [🚀 Quick Start](#-quick-start) • [⌨️ Shortcuts](#️-keyboard-shortcuts)

---

</div>

## 🌟 Overview

**TempFlux** is a high-precision, real-time temperature conversion web application designed for scientists, engineers, students, and everyday users. Built with pure Vanilla HTML5, modern Glassmorphism CSS, and modular ES6+ JavaScript, it offers bi-directional conversion across **7 thermal scales**, dynamic visual gauge animations, step-by-step mathematical breakdowns, and persistent conversion history.

---

## ✨ Features

### 🔄 Multi-Scale Conversion Engine
- **7 Supported Scales**:
  - **Celsius (°C)** — Metric baseline
  - **Fahrenheit (°F)** — Imperial standard
  - **Kelvin (K)** — SI thermodynamic baseline
  - **Rankine (°R)** — Absolute thermodynamic imperial
  - **Réaumur (°Ré)** — Historical European standard
  - **Newton (°N)** — Sir Isaac Newton's 1701 scale
  - **Delisle (°De)** — Inverted boiling/freezing scale
- **Bi-Directional Live Sync**: Changes reflect immediately across all scales in the synchronized universal matrix.
- **Precision Customization**: Select 0 to 6 decimal digits on the fly.

### 🌡️ Interactive Visual Thermometer
- **Dynamic Mercury Level**: Liquid rises and falls according to temperature.
- **Adaptive Color Glow**: Transitions seamlessly from deep cryogenic cyan/blue → temperate emerald green → warm amber → boiling red → extreme plasma violet.
- **Thermal Metadata Card**: Displays thermal state classifications (Comfort Zone, Liquid Water phase, Molecular kinetic energy state).

### 📐 Step-by-Step Calculation Breakdown
- Explains the exact mathematical formula applied in real-time with live numeric substitutions.

### ⚡ Real-World Benchmarks & Presets
- One-click presets for common physical phenomena:
  - Absolute Zero (`-273.15 °C`)
  - Liquid Nitrogen (`-195.8 °C`)
  - Dry Ice Sublimation (`-78.5 °C`)
  - Water Freezing (`0.0 °C`)
  - Room Comfort (`21.0 °C`)
  - Human Body Core (`37.0 °C`)
  - Water Boiling (`100.0 °C`)
  - Lead Melting Point (`327.5 °C`)
  - Surface of the Sun (`5,505 °C`)

### 💾 History Tracking & Data Export
- Automatic and manual history logging stored in `localStorage`.
- Click any history item to restore previous conversion parameters.
- **Export to JSON & CSV** for analysis in Excel, Python, or data notebooks.

### 🎨 Themes & Micro-Interactions
- **3 Color Themes**: Dark Midnight, Crisp Daylight, and Cyberpunk Neon.
- **Web Audio Sound Effects**: Tactile synthesize audio clicks, swaps, and chimes (zero external audio dependencies).
- **Responsive Layout**: Fluidly adapts to mobile phones, tablets, and ultra-wide desktops.

---

## 📐 Mathematical Formulas

| Scale | Conversion to Celsius (°C) | Conversion from Celsius (°C) |
| :--- | :--- | :--- |
| **Fahrenheit (°F)** | $C = (F - 32) \times \frac{5}{9}$ | $F = (C \times \frac{9}{5}) + 32$ |
| **Kelvin (K)** | $C = K - 273.15$ | $K = C + 273.15$ |
| **Rankine (°R)** | $C = (R - 491.67) \times \frac{5}{9}$ | $R = (C + 273.15) \times \frac{9}{5}$ |
| **Réaumur (°Ré)** | $C = Re \times \frac{5}{4}$ | $Re = C \times \frac{4}{5}$ |
| **Newton (°N)** | $C = N \times \frac{100}{33}$ | $N = C \times \frac{33}{100}$ |
| **Delisle (°De)** | $C = 100 - (De \times \frac{2}{3})$ | $De = (100 - C) \times \frac{3}{2}$ |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>S</kbd> | Swap source and target temperature scales |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Clear input and refocus field |
| <kbd>T</kbd> | Cycle through color themes (Dark, Light, Neon) |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/temperature-converter.git
cd temperature-converter
```

### 2. Run locally
Since this is pure standard web code, you don't need any complex build tooling. You can simply open `index.html` in your favorite browser, or serve it using any local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000
```

**Using Node / npx:**
```bash
npx serve .
# or
npx live-server
```

**Using VS Code:**
- Install the **Live Server** extension.
- Right click `index.html` and choose **"Open with Live Server"**.

---

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Navigate to repository **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your temperature converter will be live at `https://<username>.github.io/<repo-name>/`!

---

## 📁 Project Structure

```plaintext
TEMPERATURE CONVERTOR/
├── index.html       # Semantic HTML5 layout, SEO meta tags & UI components
├── style.css        # Glassmorphic CSS3 styling, design tokens & animations
├── script.js        # Mathematical conversion logic, Web Audio & DOM binding
├── README.md        # Comprehensive documentation & setup instructions
├── LICENSE          # MIT Open Source License
├── .gitignore       # Git ignore configuration
└── package.json     # Project metadata
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with modern web standards • Star ⭐ this repo if you find it helpful!</sub>
</div>
