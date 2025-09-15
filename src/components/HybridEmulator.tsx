
"use client";
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HistoryData, SimulatorState, UserSettings } from '@/lib/types';

export const SimulatorContext = createContext<SimulatorState | null>(null);

export const useSimulator = () => {
    const context = useContext(SimulatorContext);
    if (!context) {
        throw new Error('useSimulator must be used within a HybridEmulator provider');
    }
    return context;
};

export default function HybridEmulator({ children }: { children: React.ReactNode }) {
  // State declarations
  const [windSpeed, setWindSpeed] = useState(12);
  const [solarIrradiance, setSolarIrradiance] = useState(800);
  const [temperature, setTemperature] = useState(25);
  const [dustFactor, setDustFactor] = useState(0.95);
  const [batteryCharge, setBatteryCharge] = useState(60);
  const [load, setLoad] = useState(3.5);
  const [pitchAngle, setPitchAngle] = useState(5);
  const [yawAngle, setYawAngle] = useState(0);
  const [mpptEnabled, setMpptEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [droop, setDroop] = useState(4);
  const [targetFrequency, setTargetFrequency] = useState<50|60>(50);
  const [inertia, setInertia] = useState(0.5);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [turbineRotation, setTurbineRotation] = useState(0);

  // Save/Load state to/from localStorage
  const saveStateToLocalStorage = useCallback(() => {
    try {
        const settings: UserSettings = { windSpeed, solarIrradiance, temperature, dustFactor, load, pitchAngle, yawAngle, mpptEnabled, syncEnabled, droop, targetFrequency, inertia };
        localStorage.setItem('solarWindSimSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save state to localStorage", error);
    }
  }, [windSpeed, solarIrradiance, temperature, dustFactor, load, pitchAngle, yawAngle, mpptEnabled, syncEnabled, droop, targetFrequency, inertia]);
  
  useEffect(() => {
    try {
        const savedSettings = localStorage.getItem('solarWindSimSettings');
        if (savedSettings) {
            const settings: UserSettings = JSON.parse(savedSettings);
            setWindSpeed(settings.windSpeed);
            setSolarIrradiance(settings.solarIrradiance);
            setTemperature(settings.temperature);
            setDustFactor(settings.dustFactor);
            setLoad(settings.load);
            setPitchAngle(settings.pitchAngle);
            setYawAngle(settings.yawAngle);
            setMpptEnabled(settings.mpptEnabled);
            setSyncEnabled(settings.syncEnabled ?? true);
            setDroop(settings.droop ?? 4);
            setTargetFrequency(settings.targetFrequency ?? 50);
            setInertia(settings.inertia ?? 0.5);
        }
    } catch (error) {
        console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(saveStateToLocalStorage, 5000);
    return () => clearInterval(saveInterval);
  }, [saveStateToLocalStorage]);


  // Turbine rotation effect
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setTurbineRotation(prev => prev + windSpeed * 1.5);
    }, 100);
    return () => clearInterval(rotationInterval);
  }, [windSpeed]);

  // Derived state calculations
  const pitchFactor = Math.cos(pitchAngle * Math.PI / 180);
  const yawFactor = Math.cos(yawAngle * Math.PI / 180);
  let windPower = 0.005 * Math.pow(windSpeed, 2.5) * pitchFactor * yawFactor;
  windPower = Math.max(0, windPower);
  
  const tempFactor = 1 - (temperature - 25) * 0.004;
  let solarPower = (solarIrradiance / 1000) * 3.0 * tempFactor * dustFactor; // 3kW peak solar
  solarPower = Math.max(0, solarPower);
  
  const mpptFactor = mpptEnabled ? 1.15 : 1; 
  solarPower *= mpptFactor;
  
  const totalGeneration = windPower + solarPower;
  
  const excessPower = totalGeneration - load;
  const toBattery = excessPower > 0 ? Math.min(5.0, excessPower) : 0; // Max charge rate 5kW
  const fromBattery = excessPower < 0 ? Math.min(batteryCharge * 0.2, -excessPower) : 0; // Max discharge 20% of capacity
  
  const gridPower = Math.max(0, -excessPower - fromBattery);
  const toGrid = Math.max(0, excessPower - toBattery)
  
  const rawEfficiency = totalGeneration > 0 ? (load / (totalGeneration + gridPower)) * 100 : 0;
  const systemEfficiency = Math.min(rawEfficiency, 50);
  
  const frequency = syncEnabled 
    ? targetFrequency - (totalGeneration - load) * (droop / 100) * 0.1
    : 50 - (windSpeed - 12) * 0.1;
  const voltage = (48 + (batteryCharge/100 - 0.5) * 5);


  // Simulation loop
  useEffect(() => {
    const secondInterval = setInterval(() => {
        let currentBatteryCharge = 0;
        setBatteryCharge(prev => {
            const chargeChange = (toBattery - fromBattery) * 0.04;
            currentBatteryCharge = Math.max(0, Math.min(100, prev + chargeChange));
            return currentBatteryCharge;
        });

        setHistory(prev => {
          const now = new Date();
          const newEntry: HistoryData = {
            time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
            windPower: Number(windPower.toFixed(2)),
            solarPower: Number(solarPower.toFixed(2)),
            totalGeneration: Number(totalGeneration.toFixed(2)),
            load: Number(load.toFixed(2)),
            windSpeed: Number(windSpeed.toFixed(1)),
            solarIrradiance: Number(solarIrradiance.toFixed(0)),
            temperature: Number(temperature.toFixed(1)),
            batteryCharge: Number(currentBatteryCharge.toFixed(1)),
            systemEfficiency: Number(systemEfficiency.toFixed(1)),
            frequency: Number(frequency.toFixed(2)),
          }
          const newHistory = [...prev, newEntry];
          if (newHistory.length > 60) {
            return newHistory.slice(newHistory.length - 60);
          }
          return newHistory;
        });

    }, 1000);
    return () => clearInterval(secondInterval);
  }, [toBattery, fromBattery, windPower, solarPower, totalGeneration, load, windSpeed, solarIrradiance, temperature, systemEfficiency, frequency]);
  
  // Context provider logic
  const simulatorState: SimulatorState = {
    // Pass all state and setters to the context
    windSpeed, setWindSpeed,
    solarIrradiance, setSolarIrradiance,
    temperature, setTemperature,
    dustFactor, setDustFactor,
    batteryCharge, setBatteryCharge,
    load, setLoad,
    turbineRotation,
    pitchAngle, setPitchAngle,
    yawAngle, setYawAngle,
    mpptEnabled, setMpptEnabled,
    history,
    windPower,
    solarPower,
    totalGeneration,
    toBattery,
    fromBattery,
    gridPower,
    toGrid,
    systemEfficiency,
    frequency,
    voltage,
    syncEnabled, setSyncEnabled,
    droop, setDroop,
    targetFrequency, setTargetFrequency,
    inertia, setInertia
  };

  return (
      <SimulatorContext.Provider value={simulatorState}>
          {children}
      </SimulatorContext.Provider>
  );
}
