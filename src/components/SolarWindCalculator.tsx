
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sun, Wind, Zap, TrendingUp, LineChart as LineChartIcon } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface SolarResult {
  power_output_kw: number;
  daily_energy_kwh: number;
  monthly_energy_kwh: number;
  efficiency_percentage: number;
  temp_correction_factor: number;
}

interface WindResult {
    power_output_kw: number;
    daily_energy_kwh: number;
    monthly_energy_kwh: number;
    rotor_area_m2: number;
    efficiency_percentage: number;
}

interface HybridResult {
    total: {
        total_power_kw: number;
        total_daily_energy_kwh: number;
        total_monthly_energy_kwh: number;
        solar_percentage: number;
        wind_percentage: number;
    }
}

interface CalculationResult {
  solar?: SolarResult;
  wind?: WindResult;
  hybrid?: HybridResult;
}

interface ChartData {
    x: number;
    [key: string]: number | undefined;
}


const formatNumber = {
  power: (value: number, unit: 'kW') => `${value.toFixed(2)} ${unit}`,
  energy: (value: number) => `${value.toFixed(1)} kWh`,
  percentage: (value: number) => `${value.toFixed(1)}%`,
};


export default function SolarWindCalculator() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CalculationResult>({});
  const [activeTab, setActiveTab] = useState('solar');
  const [chartData, setChartData] = useState<Record<string, ChartData[]>>({});

  // Form states
  const [solarForm, setSolarForm] = useState({
    irradiance: 800,
    panel_area: 10,
    efficiency: 0.15,
    temperature: 25,
  });

  const [windForm, setWindForm] = useState({
    wind_speed: 8,
    rotor_diameter: 20,
    efficiency: 0.35,
    air_density: 1.225,
  });

  const [hybridForm, setHybridForm] = useState({
    solar_irradiance: 800,
    wind_speed: 8,
    panel_area: 10,
    rotor_diameter: 20,
  });

  const chartConfig = {
    power: {
      label: "Power",
      color: "hsl(var(--chart-1))",
    },
    solar: {
      label: "Solar",
      color: "hsl(var(--chart-2))",
    },
    wind: {
      label: "Wind",
      color: "hsl(var(--chart-1))",
    },
    total: {
      label: "Total",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;


  // Local calculation functions
  const calculateSolarPower = (params: typeof solarForm): SolarResult => {
      const { irradiance, panel_area, efficiency, temperature } = params;
      const temp_correction_factor = 1 - 0.004 * (temperature - 25);
      const adjusted_efficiency = efficiency * temp_correction_factor;
      const power_output_watts = irradiance * panel_area * adjusted_efficiency;
      const daily_energy_kwh = (power_output_watts * 6) / 1000;
      return {
          power_output_kw: power_output_watts / 1000,
          daily_energy_kwh: daily_energy_kwh,
          monthly_energy_kwh: daily_energy_kwh * 30,
          efficiency_percentage: adjusted_efficiency * 100,
          temp_correction_factor: temp_correction_factor
      };
  };

  const calculateWindPower = (params: typeof windForm): WindResult => {
    const { wind_speed, rotor_diameter, efficiency, air_density } = params;
    const rotor_area_m2 = Math.PI * (rotor_diameter / 2) ** 2;
    const wind_power_watts = 0.5 * air_density * rotor_area_m2 * (wind_speed ** 3);
    const power_output_watts = wind_power_watts * efficiency;
    const daily_energy_kwh = (power_output_watts * 24) / 1000;
    return {
        power_output_kw: power_output_watts / 1000,
        daily_energy_kwh: daily_energy_kwh,
        monthly_energy_kwh: daily_energy_kwh * 30,
        rotor_area_m2: rotor_area_m2,
        efficiency_percentage: efficiency * 100,
    };
  };


  // Form change handlers
  const handleSolarFormChange = (field: string, value: number) => {
    setSolarForm(prev => ({ ...prev, [field]: value }));
  };

  const handleWindFormChange = (field: string, value: number) => {
    setWindForm(prev => ({ ...prev, [field]: value }));
  };

  const handleHybridFormChange = (field: string, value: number) => {
    setHybridForm(prev => ({ ...prev, [field]: value }));
  };
  
  const runCalculation = (calcFunc: () => void) => {
      setLoading(true);
      setTimeout(() => {
        calcFunc();
        setLoading(false);
      }, 500);
  }

  const handleSolarCalculation = () => {
    runCalculation(() => {
        const result = calculateSolarPower(solarForm);
        setResults(prev => ({ ...prev, solar: result }));

        const data: ChartData[] = [];
        for (let i = 0; i <= 1400; i+= 50) {
            const power = calculateSolarPower({ ...solarForm, irradiance: i });
            data.push({ x: i, power: power.power_output_kw });
        }
        setChartData(prev => ({ ...prev, solar: data }));
    });
  };

  const handleWindCalculation = () => {
     runCalculation(() => {
        const result = calculateWindPower(windForm);
        setResults(prev => ({ ...prev, wind: result }));

        const data: ChartData[] = [];
        for (let i = 0; i <= 25; i++) {
            const power = calculateWindPower({ ...windForm, wind_speed: i });
            data.push({ x: i, power: power.power_output_kw });
        }
        setChartData(prev => ({ ...prev, wind: data }));
    });
  };

  const handleHybridCalculation = () => {
     runCalculation(() => {
        const solarResults = calculateSolarPower({
            irradiance: hybridForm.solar_irradiance,
            panel_area: hybridForm.panel_area,
            efficiency: 0.15,
            temperature: 25
        });
        const windResults = calculateWindPower({
            wind_speed: hybridForm.wind_speed,
            rotor_diameter: hybridForm.rotor_diameter,
            efficiency: 0.35,
            air_density: 1.225
        });
        const total_daily_energy_kwh = solarResults.daily_energy_kwh + windResults.daily_energy_kwh;
        const result: HybridResult = {
            total: {
                total_power_kw: solarResults.power_output_kw + windResults.power_output_kw,
                total_daily_energy_kwh: total_daily_energy_kwh,
                total_monthly_energy_kwh: total_daily_energy_kwh * 30,
                solar_percentage: total_daily_energy_kwh > 0 ? (solarResults.daily_energy_kwh / total_daily_energy_kwh) * 100 : 0,
                wind_percentage: total_daily_energy_kwh > 0 ? (windResults.daily_energy_kwh / total_daily_energy_kwh) * 100 : 0,
            }
        };
        setResults(prev => ({ ...prev, hybrid: result }));

        const data: ChartData[] = [];
        for (let i = 0; i <= 25; i++) {
            const solarP = calculateSolarPower({ ...solarForm, irradiance: hybridForm.solar_irradiance }).power_output_kw;
            const windP = calculateWindPower({ ...windForm, wind_speed: i, rotor_diameter: hybridForm.rotor_diameter }).power_output_kw;
            data.push({ x: i, solar: solarP, wind: windP, total: solarP + windP });
        }
        setChartData(prev => ({ ...prev, hybrid: data }));
    });
  };

  const renderChart = (dataKey: string, xLabel: string, yLabel: string, lines: {key: string, name: string}[]) => (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChartIcon /> Performance Curve</CardTitle>
            <CardDescription>{yLabel} vs. {xLabel}</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={chartData[dataKey]} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} label={{ value: xLabel, position: 'insideBottom', offset: -10 }} />
                    <YAxis unit=" kW" label={{ value: yLabel, angle: -90, position: 'insideLeft' }}/>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Legend verticalAlign="top" />
                    {lines.map(line => (
                      <Line key={line.key} dataKey={line.key} type="monotone" stroke={`var(--color-${line.key})`} strokeWidth={2} dot={false} name={line.name} />
                    ))}
                </LineChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Solar & Wind Power Calculator</h1>
        <p className="text-center text-muted-foreground">
          Calculate the efficiency and power output of renewable energy systems using scientific calculations.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solar" className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Solar Power
          </TabsTrigger>
          <TabsTrigger value="wind" className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Wind Power
          </TabsTrigger>
          <TabsTrigger value="hybrid" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Hybrid System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Solar Power Settings
                </CardTitle>
                <CardDescription>
                  Enter solar panel data and environmental conditions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="irradiance">Solar Irradiance (W/m²)</Label>
                  <Input
                    id="irradiance"
                    type="number"
                    value={solarForm.irradiance}
                    onChange={(e) => handleSolarFormChange('irradiance', parseFloat(e.target.value))}
                    placeholder="800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panel_area">Panel Area (m²)</Label>
                  <Input
                    id="panel_area"
                    type="number"
                    value={solarForm.panel_area}
                    onChange={(e) => handleSolarFormChange('panel_area', parseFloat(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="efficiency">Panel Efficiency (0-1)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    step="0.01"
                    value={solarForm.efficiency}
                    onChange={(e) => handleSolarFormChange('efficiency', parseFloat(e.target.value))}
                    placeholder="0.15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={solarForm.temperature}
                    onChange={(e) => handleSolarFormChange('temperature', parseFloat(e.target.value))}
                    placeholder="25"
                  />
                </div>
                <Button 
                  onClick={handleSolarCalculation} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading && activeTab === 'solar' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  Calculate Solar Power
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solar Power Results</CardTitle>
                <CardDescription>
                  Calculated power output and efficiency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.solar ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatNumber.power(results.solar.power_output_kw, 'kW')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Power Output</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatNumber.energy(results.solar.daily_energy_kwh)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Daily Energy</div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between">
                        <span>Monthly Energy:</span>
                        <span className="font-semibold">
                          {formatNumber.energy(results.solar.monthly_energy_kwh)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="font-semibold">
                          {formatNumber.percentage(results.solar.efficiency_percentage)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temp. Correction Factor:</span>
                        <span className="font-semibold">
                          {results.solar.temp_correction_factor.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Click "Calculate Solar Power" to see results.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {chartData.solar && renderChart('solar', 'Solar Irradiance (W/m²)', 'Power (kW)', [{key: 'power', name: 'Power'}])}
        </TabsContent>

        <TabsContent value="wind" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  Wind Power Settings
                </CardTitle>
                <CardDescription>
                  Enter wind turbine data and weather conditions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wind_speed">Wind Speed (m/s)</Label>
                  <Input
                    id="wind_speed"
                    type="number"
                    value={windForm.wind_speed}
                    onChange={(e) => handleWindFormChange('wind_speed', parseFloat(e.target.value))}
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rotor_diameter">Rotor Diameter (m)</Label>
                  <Input
                    id="rotor_diameter"
                    type="number"
                    value={windForm.rotor_diameter}
                    onChange={(e) => handleWindFormChange('rotor_diameter', parseFloat(e.target.value))}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wind_efficiency">Turbine Efficiency (0-1)</Label>
                  <Input
                    id="wind_efficiency"
                    type="number"
                    step="0.01"
                    value={windForm.efficiency}
                    onChange={(e) => handleWindFormChange('efficiency', parseFloat(e.target.value))}
                    placeholder="0.35"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="air_density">Air Density (kg/m³)</Label>
                  <Input
                    id="air_density"
                    type="number"
                    step="0.001"
                    value={windForm.air_density}
                    onChange={(e) => handleWindFormChange('air_density', parseFloat(e.target.value))}
                    placeholder="1.225"
                  />
                </div>
                <Button 
                  onClick={handleWindCalculation} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading && activeTab === 'wind' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  Calculate Wind Power
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wind Power Results</CardTitle>
                <CardDescription>
                   Calculated power output and turbine properties.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.wind ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatNumber.power(results.wind.power_output_kw, 'kW')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Power Output</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatNumber.energy(results.wind.daily_energy_kwh)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Daily Energy</div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between">
                        <span>Monthly Energy:</span>
                        <span className="font-semibold">
                          {formatNumber.energy(results.wind.monthly_energy_kwh)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rotor Area:</span>
                        <span className="font-semibold">
                          {results.wind.rotor_area_m2.toFixed(2)} m²
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="font-semibold">
                          {formatNumber.percentage(results.wind.efficiency_percentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Click "Calculate Wind Power" to see results.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {chartData.wind && renderChart('wind', 'Wind Speed (m/s)', 'Power (kW)', [{key: 'power', name: 'Power'}])}
        </TabsContent>

        <TabsContent value="hybrid" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Hybrid System Settings
                </CardTitle>
                <CardDescription>
                  Enter data for a combined solar and wind system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hybrid_solar_irradiance">Solar Irradiance (W/m²)</Label>
                    <Input
                      id="hybrid_solar_irradiance"
                      type="number"
                      value={hybridForm.solar_irradiance}
                      onChange={(e) => handleHybridFormChange('solar_irradiance', parseFloat(e.target.value))}
                      placeholder="800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hybrid_wind_speed">Wind Speed (m/s)</Label>
                    <Input
                      id="hybrid_wind_speed"
                      type="number"
                      value={hybridForm.wind_speed}
                      onChange={(e) => handleHybridFormChange('wind_speed', parseFloat(e.target.value))}
                      placeholder="8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hybrid_panel_area">Panel Area (m²)</Label>
                    <Input
                      id="hybrid_panel_area"
                      type="number"
                      value={hybridForm.panel_area}
                      onChange={(e) => handleHybridFormChange('panel_area', parseFloat(e.target.value))}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hybrid_rotor_diameter">Rotor Diameter (m)</Label>
                    <Input
                      id="hybrid_rotor_diameter"
                      type="number"
                      value={hybridForm.rotor_diameter}
                      onChange={(e) => handleHybridFormChange('rotor_diameter', parseFloat(e.target.value))}
                      placeholder="20"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleHybridCalculation} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading && activeTab === 'hybrid' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  Calculate Hybrid System
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hybrid System Results</CardTitle>
                <CardDescription>
                  Total power output and source distribution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.hybrid ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {formatNumber.power(results.hybrid.total.total_power_kw, 'kW')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Power Output</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                          {formatNumber.percentage(results.hybrid.total.solar_percentage)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Solar Contribution</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {formatNumber.percentage(results.hybrid.total.wind_percentage)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Wind Contribution</div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between">
                        <span>Total Daily Energy:</span>
                        <span className="font-semibold">
                          {formatNumber.energy(results.hybrid.total.total_daily_energy_kwh)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Monthly Energy:</span>
                        <span className="font-semibold">
                          {formatNumber.energy(results.hybrid.total.total_monthly_energy_kwh)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Click "Calculate Hybrid System" to see results.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
           {chartData.hybrid && renderChart('hybrid', 'Wind Speed (m/s)', 'Power (kW)', [
                {key: 'solar', name: 'Solar'},
                {key: 'wind', name: 'Wind'},
                {key: 'total', name: 'Total'}
            ])}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
