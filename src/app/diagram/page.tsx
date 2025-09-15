
"use client";

import React from 'react';
import { useSimulator } from '@/components/HybridEmulator';
import ReactFlowDiagram from '@/components/ReactFlowDiagram';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiagramPage() {
  const simulatorState = useSimulator();

  if (!simulatorState) {
    return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-[520px]" />
        </div>
    );
  }

  const {
    frequency,
    voltage,
    totalGeneration,
    windPower,
    solarPower,
    mpptEnabled,
    load,
    syncEnabled,
    targetFrequency,
    droop,
    inertia,
    setSyncEnabled,
    setTargetFrequency,
    setDroop,
    setInertia,
  } = simulatorState;

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                    Live System Diagram
                </CardTitle>
                <CardDescription>
                    A real-time, interactive block diagram illustrating the power flow through the hybrid system's components.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ReactFlowDiagram
                    frequency={frequency}
                    voltage={voltage}
                    totalGenerationKW={totalGeneration}
                    dcBusKW={Number((Math.max(0.0001, windPower * 0.95 + solarPower * (mpptEnabled ? 0.97 : 0.90))).toFixed(2))}
                    loadKW={load}
                    rectifierOn={windPower > 0}
                    inverterOn={totalGeneration > 0}
                    sync={{
                        enabled: syncEnabled,
                        targetHz: targetFrequency,
                        droopPct: droop,
                        inertia: inertia,
                        onChange: (p) => {
                          if (p.enabled !== undefined) setSyncEnabled(p.enabled);
                          if (p.targetHz) setTargetFrequency(p.targetHz);
                          if (p.droopPct !== undefined) setDroop(p.droopPct);
                          if (p.inertia !== undefined) setInertia(p.inertia);
                        },
                    }}
                />
            </CardContent>
        </Card>
    </div>
  );
}
