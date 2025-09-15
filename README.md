# 🌞 SolarWindSim

An advanced, interactive web application designed to simulate hybrid **solar and wind power systems**.  
It provides a real-time dashboard to visualize the interplay between renewable energy sources, storage, and grid connection.  
The project serves as both an **educational tool** and a **performance emulator** for modern hybrid energy systems.

---

## 📖 Project Overview

SolarWindSim was developed to introduce new ideas to the world of renewable energy.  
The app dynamically simulates **solar PV panels** and **wind turbines**, integrates battery storage, grid connection, and household load, and displays **real-time performance analytics**.

---

## ✨ Key Features
- 🎛️ **Interactive Controls**: Adjust environmental factors such as wind speed, solar irradiance, PV temperature, turbine pitch, and more.
- 📊 **Real-Time Analytics**: Dynamic charts for generation, system efficiency, and environmental conditions.
- 🧮 **Static Calculator**: Dedicated calculator to estimate power output under specific user-defined conditions.
- ⚡ **Component Simulation**: Visual simulation of solar, wind, battery, and grid interactions.
- 🌍 **Live System Diagram**: Real-time block diagram showing power flow and component states.
- 📑 **Data Export**: Export system performance data as CSV for further analysis.

---

## 🛠️ Technology Stack
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Recharts**
- **Lucide React**

The entire system is front-end only — all simulation and calculation logic runs client-side in the browser.

---

## ⚙️ System Components & Simulation Logic
- **Wind Power**: Simulates a wind turbine with adjustable wind speed, blade pitch, and yaw angle. Includes animated visuals.  
- **Solar Power**: Simulates a PV array with irradiance, temperature, and dust accumulation.  
- **Battery Storage**: Stores excess power and discharges to meet demand with realistic constraints.  
- **Household Load**: Adjustable consumer demand.  
- **Grid Connection**: Imports or exports energy to the main grid.  
- **Advanced Simulation**:  
  - MPPT (Maximum Power Point Tracking) optimization.  
  - Synchronous Machine simulation (grid stability & frequency control).  
  - Two-Stage Converter logic for AC/DC hybrid flow.  

---

## 📷 Screenshots

### Dashboard
![Dashboard](./assets/screenshots/dashboard.png)

### Solar & Wind Power Calculator
![Hybrid Calculator](./assets/screenshots/hybrid-calculator.png)

### Wind Power Module
![Wind Calculator](./assets/screenshots/wind-calculator.png)

### Solar Power Module
![Solar Calculator](./assets/screenshots/solar-calculator.png)

### Live System Diagram
![System Diagram](./assets/screenshots/system-diagram.png)

### System Analytics
![System Analytics](./assets/screenshots/system-analytics.png)

---

## 👥 About Us

**Project Idea**  
This project was developed to introduce new ideas to the world.  

**Team Members**  
- **Mohammad Almaaita** – ENG  
- **Zead Shalash** – ENG  

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm, yarn, or pnpm

### Installation
```bash
# Clone the repo
git clone https://github.com/mohammadalmaaita1/solarwind-sim.git
cd solarwind-sim

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production build
npm start
