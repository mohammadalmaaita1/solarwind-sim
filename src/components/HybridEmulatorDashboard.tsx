
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Wind, BatteryCharging, Home, Sun, Cpu, FileOutput, LineChart as LineChartIcon, Leaf, BarChart, Server, ChevronDown, AlertTriangle, Cloud, SunMoon, ZapOff, Waves } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSimulator } from './HybridEmulator';


const WindTurbine = ({ rotation }: { rotation: number }) => (
  <div className="relative w-64 h-80 lg:w-80 lg:h-96">
    {/* Support Column */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-72 lg:w-10 lg:h-80 bg-gray-400 rounded-t-lg" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 w-full h-full">
      {/* Rotation Container */}
      <div
        className="absolute w-full h-full"
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 2s linear' }}
      >
        {/* Blades */}
        {[0, 120, 240].map((angle) => (
           <div key={angle} className="absolute top-1/2 left-1/2 w-20 h-40 lg:w-24 lg:h-48 origin-top-left" style={{transform: `rotate(${angle}deg) translate(-50%, -10px)`}}>
              <div className="w-full h-full bg-gray-700 rounded-lg p-1 shadow-lg border-2 border-gray-600"
                   style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                   }}
              >
                  <div className="w-full h-full bg-blue-900 rounded-md grid grid-cols-2 grid-rows-4 gap-0.5 p-0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-blue-500/50 border border-blue-400/50 rounded-sm" />
                    ))}
                  </div>
              </div>
           </div>
        ))}
      </div>
      {/* Hub */}
      <div
        className="absolute top-1/2 left-1/2 w-14 h-14 lg:w-16 lg:h-16 -mt-7 -ml-7 lg:-mt-8 lg:-ml-8 bg-gray-500 rounded-full z-10 flex items-center justify-center shadow-inner">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-600 rounded-full" />
      </div>
    </div>
  </div>
);

export default function HybridEmulatorDashboard() {
  const simulatorState = useSimulator();

  if (!simulatorState) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  const {
    windSpeed, setWindSpeed,
    solarIrradiance, setSolarIrradiance,
    temperature, setTemperature,
    dustFactor, setDustFactor,
    batteryCharge,
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
    targetFrequency
  } = simulatorState;

  // Data export function
  const exportData = () => {
    if (history.length === 0) return;
    const headers = Object.keys(history[0] || {});
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + history.map(e => Object.values(e).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "solarwindsim_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handlePreset = (preset: 'sunny' | 'windy_night' | 'storm' | 'balanced') => {
    switch (preset) {
        case 'sunny':
            setWindSpeed(5);
            setSolarIrradiance(1000);
            setTemperature(28);
            setLoad(2.0);
            break;
        case 'windy_night':
            setWindSpeed(18);
            setSolarIrradiance(0);
            setTemperature(15);
            setLoad(4.0);
            break;
        case 'storm':
            setWindSpeed(22);
            setSolarIrradiance(200);
            setTemperature(18);
            setLoad(3.0);
            break;
        case 'balanced':
            setWindSpeed(12);
            setSolarIrradiance(800);
            setTemperature(25);
            setLoad(3.5);
            break;
    }
  }

  // Chart configuration
  const chartConfig = {
    windPower: { label: "Wind", color: "hsl(var(--chart-1))" },
    solarPower: { label: "Solar", color: "hsl(var(--chart-2))" },
    totalGeneration: { label: "Total", color: "hsl(var(--chart-5))" },
    load: { label: "Load", color: "hsl(var(--chart-4))" },
    windSpeed: { label: "Wind Speed", color: "hsl(var(--chart-1))", unit: "m/s" },
    solarIrradiance: { label: "Irradiance", color: "hsl(var(--chart-2))", unit: "W/m²" },
    temperature: { label: "Temp", color: "hsl(var(--chart-4))", unit: "°C" },
    batteryCharge: { label: "Battery", color: "#FFFFFF" },
    systemEfficiency: { label: "Efficiency", color: "hsl(var(--chart-3))" },
    frequency: { label: "Frequency", color: "hsl(var(--chart-5))", unit: "Hz" },
  }

  const lowFrequencyAlert = frequency < 47.5;
  const lowBatteryAlert = batteryCharge < 15;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 space-y-4">
       <div className="w-full max-w-screen-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-between">
              <span>Hybrid Transparent Wind-Solar Turbine System</span>
              <Button onClick={exportData} disabled={history.length === 0}><FileOutput className="mr-2 h-4 w-4" /> Export Data</Button>
            </CardTitle>
            <CardDescription>
              An advanced, interactive simulation of a hybrid wind and solar power system with detailed controls and analytics.
            </CardDescription>
          </CardHeader>
        </Card>
        {(lowFrequencyAlert || lowBatteryAlert) && (
            <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>System Alert</AlertTitle>
                <AlertDescription>
                    {lowFrequencyAlert && <div>Grid frequency is critically low: {frequency.toFixed(2)} Hz. Risk of instability.</div>}
                    {lowBatteryAlert && <div>Battery charge is critically low: {batteryCharge.toFixed(1)}%. Risk of load shedding.</div>}
                </AlertDescription>
            </Alert>
        )}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-screen-2xl mx-auto flex-grow">

        {/* Column 1: Power Sources & Controls */}
        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Wind /> Wind Power Controls</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between"><Label htmlFor="wind-speed">Wind Speed</Label><span className="font-bold text-primary">{windSpeed.toFixed(1)} m/s</span></div>
                     <Slider id="wind-speed" value={[windSpeed]} onValueChange={(val) => setWindSpeed(val[0])} max={25} step={0.1} />
                     <div className="flex items-center justify-between"><Label htmlFor="pitch-angle">Blade Pitch Angle</Label><span className="font-bold text-primary">{pitchAngle.toFixed(0)}°</span></div>
                     <Slider id="pitch-angle" value={[pitchAngle]} onValueChange={(val) => setPitchAngle(val[0])} max={90} step={1} />
                     <div className="flex items-center justify-between"><Label htmlFor="yaw-angle">Yaw Angle</Label><span className="font-bold text-primary">{yawAngle.toFixed(0)}°</span></div>
                     <Slider id="yaw-angle" value={[yawAngle]} onValueChange={(val) => setYawAngle(val[0])} max={45} step={1} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Sun /> Solar Power Controls</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between"><Label htmlFor="solar-irradiance">Solar Irradiance</Label><span className="font-bold text-primary">{solarIrradiance.toFixed(0)} W/m²</span></div>
                     <Slider id="solar-irradiance" value={[solarIrradiance]} onValueChange={(val) => setSolarIrradiance(val[0])} max={1200} step={10} />
                     <div className="flex items-center justify-between"><Label htmlFor="temperature">PV Temperature</Label><span className="font-bold text-primary">{temperature.toFixed(1)} °C</span></div>
                     <Slider id="temperature" value={[temperature]} onValueChange={(val) => setTemperature(val[0])} max={50} step={0.5} />
                     <div className="flex items-center justify-between"><Label htmlFor="dust-factor">Dust Factor</Label><span className="font-bold text-primary">{(dustFactor * 100).toFixed(0)}%</span></div>
                     <Slider id="dust-factor" value={[dustFactor]} onValueChange={(val) => setDustFactor(val[0])} max={1} min={0.8} step={0.01} />
                     <div className="flex items-center justify-between pt-2"><Label htmlFor="mppt-switch" className="flex items-center gap-2"><Cpu /> MPPT Optimization</Label><Switch id="mppt-switch" checked={mpptEnabled} onCheckedChange={setMpptEnabled}/></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Waves /> Synchronous Machine</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><Label htmlFor="sync-switch">Enable Sync Machine</Label><Switch id="sync-switch" checked={syncEnabled} onCheckedChange={setSyncEnabled}/></div>
                    <p className="text-xs text-muted-foreground">Open diagram page to change parameters.</p>
                </CardContent>
            </Card>
        </div>

        {/* Column 2: System Status & Visualization */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center w-full">
                 <Card className="w-full text-center"><CardHeader className="p-2"><CardTitle className="flex items-center justify-center gap-2 text-lg"><Wind /> Wind</CardTitle></CardHeader><CardContent className="p-2"><p className="text-2xl font-bold text-primary">{windPower.toFixed(2)} kW</p></CardContent></Card>
                 <Card className="w-full text-center"><CardHeader className="p-2"><CardTitle className="flex items-center justify-center gap-2 text-lg"><Zap /> Total</CardTitle></CardHeader><CardContent className="p-2"><p className="text-2xl font-bold text-primary">{totalGeneration.toFixed(2)} kW</p></CardContent></Card>
                 <Card className="w-full text-center"><CardHeader className="p-2"><CardTitle className="flex items-center justify-center gap-2 text-lg"><Sun /> Solar</CardTitle></CardHeader><CardContent className="p-2"><p className="text-2xl font-bold text-primary">{solarPower.toFixed(2)} kW</p></CardContent></Card>
            </div>

            <div className="relative flex-grow flex items-center justify-center w-full">
                <WindTurbine rotation={turbineRotation} />
            </div>
        </div>

        {/* Column 3: Power Distribution & Analytics */}
        <div className="lg:col-span-3 space-y-6">
            <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2">Simulation Presets</CardTitle></CardHeader>
                 <CardContent className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => handlePreset('sunny')}><Sun className="mr-2 h-4 w-4" /> Sunny</Button>
                    <Button variant="outline" onClick={() => handlePreset('windy_night')}><SunMoon className="mr-2 h-4 w-4" /> Windy</Button>
                    <Button variant="outline" onClick={() => handlePreset('storm')}><Cloud className="mr-2 h-4 w-4" /> Storm</Button>
                    <Button variant="outline" onClick={() => handlePreset('balanced')}><ZapOff className="mr-2 h-4 w-4"/> Balanced</Button>
                 </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Home /> Household Load</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><Label htmlFor="load">Consumption</Label><span className="font-bold text-primary">{load.toFixed(2)} kW</span></div>
                     <Slider id="load" value={[load]} onValueChange={(val) => setLoad(val[0])} max={10} step={0.1} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BatteryCharging /> Battery Storage</CardTitle><CardDescription>{toBattery > 0 ? `Charging at ${toBattery.toFixed(2)} kW` : fromBattery > 0 ? `Discharging at ${fromBattery.toFixed(2)} kW`: 'Idle'}</CardDescription></CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <div className="w-full bg-gray-700 rounded-full h-8 border-2 border-primary overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full flex items-center justify-center text-white font-bold" style={{ width: `${batteryCharge}%`, transition: 'width 0.5s' }}>
                           {batteryCharge.toFixed(1)}%
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Zap /> Grid Connection</CardTitle></CardHeader>
                <CardContent className="text-center"><p className="text-sm text-muted-foreground">{gridPower > 0 ? "Drawing from Grid" : toGrid > 0 ? "Sending to Grid" : "Idle"}</p><p className="text-3xl font-bold">{gridPower > 0 ? gridPower.toFixed(2) : toGrid.toFixed(2)} kW</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>System Analytics</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Frequency</span><span className="font-bold text-lg">{frequency.toFixed(2)} Hz</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Voltage</span><span className="font-bold text-lg">{voltage.toFixed(1)} V</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Current</span><span className="font-bold text-lg">{(totalGeneration * 1000 / (voltage || 48)).toFixed(1)} A</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Efficiency</span><span className="font-bold text-lg">{systemEfficiency > 0 ? systemEfficiency.toFixed(1) : '0'}%</span></div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-12">
          <Tabs defaultValue="power">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="power"><LineChartIcon className="mr-2" />Power</TabsTrigger>
              <TabsTrigger value="environment"><Leaf className="mr-2" />Environment</TabsTrigger>
              <TabsTrigger value="performance"><BarChart className="mr-2" />Performance</TabsTrigger>
              <TabsTrigger value="grid"><Waves className="mr-2" />Grid</TabsTrigger>
            </TabsList>
            <TabsContent value="power">
              <Card>
                <CardHeader>
                    <CardTitle>Power Generation History</CardTitle>
                    <CardDescription>A real-time view of power generation and load over the last minute.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                       <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis unit=" kW" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Legend />
                        <Line dataKey="windPower" type="monotone" stroke="var(--color-windPower)" strokeWidth={2} dot={false} name="Wind" />
                        <Line dataKey="solarPower" type="monotone" stroke="var(--color-solarPower)" strokeWidth={2} dot={false} name="Solar" />
                        <Line dataKey="totalGeneration" type="monotone" stroke="var(--color-totalGeneration)" strokeWidth={2} dot={false} name="Total" />
                        <Line dataKey="load" type="monotone" stroke="var(--color-load)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Load" />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="environment">
              <Card>
                <CardHeader>
                    <CardTitle>Environmental Factors</CardTitle>
                    <CardDescription>A real-time view of environmental conditions over the last minute.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                       <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Legend />
                        <Line yAxisId="left" dataKey="windSpeed" type="monotone" stroke="var(--color-windSpeed)" strokeWidth={2} dot={false} name="Wind Speed (m/s)" />
                        <Line yAxisId="right" dataKey="solarIrradiance" type="monotone" stroke="var(--color-solarIrradiance)" strokeWidth={2} dot={false} name="Irradiance (W/m²)" />
                        <Line yAxisId="left" dataKey="temperature" type="monotone" stroke="var(--color-temperature)" strokeWidth={2} dot={false} name="Temperature (°C)" />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance">
               <Card>
                <CardHeader>
                    <CardTitle>System Performance</CardTitle>
                    <CardDescription>A real-time view of battery charge and system efficiency over the last minute.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                       <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis unit="%" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Legend />
                        <Line dataKey="batteryCharge" type="monotone" stroke="var(--color-batteryCharge)" strokeWidth={2} dot={false} name="Battery SoC (%)" />
                        <Line dataKey="systemEfficiency" type="monotone" stroke="var(--color-systemEfficiency)" strokeWidth={2} dot={false} name="Efficiency (%)" />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="grid">
                   <Card>
                    <CardHeader>
                        <CardTitle>Grid Stability</CardTitle>
                        <CardDescription>A real-time view of the grid frequency over the last minute.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                           <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis domain={[targetFrequency-5, targetFrequency+5]} unit=" Hz"/>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Legend />
                            <Line dataKey="frequency" type="monotone" stroke="var(--color-frequency)" strokeWidth={2} dot={false} name="Frequency (Hz)" />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
          </Tabs>
        </div>
       </div>
    </div>
  );
}
