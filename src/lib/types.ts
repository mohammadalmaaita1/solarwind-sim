
export interface HistoryData {
  time: string;
  windPower: number;
  solarPower: number;
  totalGeneration: number;
  load: number;
  windSpeed: number;
  solarIrradiance: number;
  temperature: number;
  batteryCharge: number;
  systemEfficiency: number;
  frequency: number;
}

export interface SimulatorState {
    windSpeed: number;
    setWindSpeed: (value: number) => void;
    solarIrradiance: number;
    setSolarIrradiance: (value: number) => void;
    temperature: number;
    setTemperature: (value: number) => void;
    dustFactor: number;
    setDustFactor: (value: number) => void;
    batteryCharge: number;
    setBatteryCharge: (value: number) => void;
    load: number;
    setLoad: (value: number) => void;
    turbineRotation: number;
    pitchAngle: number;
    setPitchAngle: (value: number) => void;
    yawAngle: number;
    setYawAngle: (value: number) => void;
    mpptEnabled: boolean;
    setMpptEnabled: (value: boolean) => void;
    history: HistoryData[];
    windPower: number;
    solarPower: number;
    totalGeneration: number;
    toBattery: number;
    fromBattery: number;
    gridPower: number;
    toGrid: number;
    systemEfficiency: number;
    frequency: number;
    voltage: number;
    syncEnabled: boolean;
    setSyncEnabled: (value: boolean) => void;
    droop: number;
    setDroop: (value: number) => void;
    targetFrequency: 50 | 60;
    setTargetFrequency: (value: 50 | 60) => void;
    inertia: number;
    setInertia: (value: number) => void;
}

export type UserSettings = {
    windSpeed: number;
    solarIrradiance: number;
    temperature: number;
    dustFactor: number;
    load: number;
    pitchAngle: number;
    yawAngle: number;
    mpptEnabled: boolean;
    syncEnabled: boolean;
    droop: number;
    targetFrequency: 50 | 60;
    inertia: number;
};
