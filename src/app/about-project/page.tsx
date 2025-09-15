import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Calculator, FileOutput, Leaf, LineChart, SlidersHorizontal, Zap } from "lucide-react";

export default function AboutProject() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            About SolarWindSim
          </CardTitle>
          <CardDescription>
            A comprehensive overview of the Hybrid Power Emulator project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold border-b pb-2">Project Overview</h2>
            <p>
              SolarWindSim is an advanced, interactive web application designed for the dynamic simulation of a hybrid wind and solar power system. It provides a real-time dashboard that visualizes the interplay between renewable energy sources, battery storage, and grid dependency. It serves as an educational tool for understanding the complexities and performance of modern hybrid energy systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong><SlidersHorizontal className="inline-block w-4 h-4 mr-2" />Interactive Controls:</strong> Dynamically adjust environmental factors like wind speed and solar irradiance, as well as system settings like turbine pitch and panel temperature.</li>
              <li><strong><LineChart className="inline-block w-4 h-4 mr-2" />Real-Time Analytics:</strong> Monitor key performance indicators through a tabbed interface with dynamic charts for Power Generation, Environmental Factors, and System Performance.</li>
              <li><strong><Calculator className="inline-block w-4 h-4 mr-2" />Static Calculator:</strong> Use a dedicated calculator page to determine power output for specific, user-defined solar and wind conditions, complete with performance curve visualizations.</li>
              <li><strong><Leaf className="inline-block w-4 h-4 mr-2" />Component Simulation:</strong> Independent, client-side simulation of wind and solar power generation with animated visuals for the wind turbine.</li>
              <li><strong><BarChart className="inline-block w-4 h-4 mr-2" />Power Flow Visualization:</strong> Clear diagrams show the distribution of energy between sources, battery storage, household load, and the grid.</li>
              <li><strong><FileOutput className="inline-block w-4 h-4 mr-2" />Data Export:</strong> Export a snapshot of the current simulation data to a CSV file for external analysis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
                <Badge>Next.js (App Router)</Badge>
                <Badge>React</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>ShadCN/UI</Badge>
                <Badge>Recharts</Badge>
                <Badge>Lucide React</Badge>
            </div>
             <p className="mt-4 text-muted-foreground">The project is a completely self-contained web application built with a modern front-end stack. All simulation and calculation logic runs directly in the browser, with no external backend dependency.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold border-b pb-2">System Components & Simulation Logic</h2>
            <p>The emulator is composed of several interconnected components, each with its own simulation logic:</p>
            <ul className="list-disc list-inside space-y-4">
                <li>
                    <strong>Wind Power:</strong> Simulates a wind turbine generating power based on wind speed, blade pitch, and yaw angle. The turbine's rotation is animated for visual feedback.
                     <p className="text-sm text-muted-foreground pl-4"><strong>Controls:</strong> Wind Speed, Blade Pitch Angle, Yaw Angle | <strong>Output:</strong> Wind Power (kW)</p>
                </li>
                <li>
                    <strong>Solar Power:</strong> Simulates a solar PV array generating power based on solar irradiance, panel temperature, and dust accumulation.
                    <p className="text-sm text-muted-foreground pl-4"><strong>Controls:</strong> Solar Irradiance, PV Temperature, Dust Factor | <strong>Output:</strong> Solar Power (kW)</p>
                </li>
                <li>
                    <strong>Battery Storage:</strong> Represents an energy storage system that charges with excess power and discharges to meet load demand, with realistic charging/discharging constraints.
                    <p className="text-sm text-muted-foreground pl-4"><strong>State:</strong> Battery Charge (%) | <strong>Flow:</strong> Charging/Discharging Rate (kW)</p>
                </li>
                <li>
                    <strong>Household Load:</strong> Represents the electrical consumption of a connected household, which can be adjusted by the user.
                    <p className="text-sm text-muted-foreground pl-4"><strong>Control:</strong> Consumption (kW)</p>
                </li>
                 <li>
                    <strong>Grid Connection:</strong> Simulates the connection to the main power grid, either drawing power when generation is low or sending excess power back.
                     <p className="text-sm text-muted-foreground pl-4"><strong>Flow:</strong> Drawing from Grid / Sending to Grid (kW)</p>
                </li>
                 <li>
                    <strong><Zap className="inline-block w-4 h-4 mr-2 text-yellow-400" />Advanced Simulation Features:</strong>
                     <ul className="list-disc list-inside pl-6 mt-2 space-y-2">
                        <li>
                            <strong>MPPT (Maximum Power Point Tracking):</strong> A toggle to simulate an optimization algorithm that increases solar panel efficiency by about 15% when enabled.
                        </li>
                        <li>
                            <strong>Synchronous Machine Simulation:</strong> The system simulates grid frequency control. The frequency, displayed in the analytics panel, adjusts in response to changes in wind speed, demonstrating a key mechanism for maintaining grid stability.
                        </li>
                        <li>
                            <strong>Two-Stage Converter Logic:</strong> The overall system flow, managing inputs from both AC (wind) and DC (solar) sources, charging a DC battery, and providing a stable AC output, simulates the function of a modern hybrid inverter system like an SMA Sunny Island, which performs AC-DC-AC conversion for maximum stability and control.
                        </li>
                     </ul>
                </li>
            </ul>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}

    