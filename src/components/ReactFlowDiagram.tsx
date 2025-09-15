"use client";
import React, { useMemo, useState } from "react";
import ReactFlow, {
  Background, Controls, MiniMap, Node, Edge, Position
} from "reactflow";
import 'reactflow/dist/base.css';
import { HybridInverterNode, InverterNodeData, SynchronousMachineNode, SyncNodeData } from "./blocks/HybridNodes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type DiagramProps = {
  // live telemetry
  frequency: number;
  voltage: number;
  totalGenerationKW: number;
  dcBusKW: number;
  loadKW: number;
  rectifierOn: boolean;
  inverterOn: boolean;
  // sync machine params + optional callbacks
  sync: {
    enabled: boolean;
    targetHz: 50|60;
    droopPct: number;
    inertia: number;
    onChange?: (p: {enabled?: boolean; targetHz?: 50|60; droopPct?: number; inertia?: number}) => void;
  };
};

const nodeTypes = {
  hybridInverter: HybridInverterNode,
  synchronousMachine: SynchronousMachineNode,
};

export default function ReactFlowDiagram(props: DiagramProps) {
  const { frequency, voltage, totalGenerationKW, dcBusKW, loadKW, rectifierOn, inverterOn, sync } = props;

  const [paramsOpen, setParamsOpen] = useState(false);
  const [tmpEnabled, setTmpEnabled] = useState(sync.enabled);
  const [tmpTarget, setTmpTarget] = useState<50|60>(sync.targetHz);
  const [tmpDroop, setTmpDroop] = useState(sync.droopPct);
  const [tmpInertia, setTmpInertia] = useState(sync.inertia);

  const nodes = useMemo<Node[]>(() => ([
    {
      id: "dc-bus",
      type: "default",
      position: { x: 80, y: 120 },
      data: { label: `DC Bus\n${dcBusKW.toFixed(2)} kW` },
      style: { borderRadius: 12, border: "2px solid hsl(var(--muted-foreground))", padding: 10, width: 160, textAlign: "center" }
    },
    {
      id: "inv",
      type: "hybridInverter",
      position: { x: 320, y: 100 },
      data: { frequency, voltage, inverterOn, eff: 0.94 } as InverterNodeData,
    },
    {
      id: "sync",
      type: "synchronousMachine",
      position: { x: 600, y: 100 },
      data: {
        enabled: sync.enabled,
        targetHz: sync.targetHz,
        droopPct: sync.droopPct,
        inertia: sync.inertia,
        frequency,
        onOpenParams: () => {
          setTmpEnabled(sync.enabled);
          setTmpTarget(sync.targetHz);
          setTmpDroop(sync.droopPct);
          setTmpInertia(sync.inertia);
          setParamsOpen(true);
        }
      } as SyncNodeData,
    },
    {
      id: "ac-load",
      type: "default",
      position: { x: 860, y: 120 },
      data: { label: `AC Load / Grid\n${loadKW.toFixed(2)} kW` },
      style: { borderRadius: 12, border: "2px solid hsl(var(--muted-foreground))", padding: 10, width: 160, textAlign: "center" }
    },
    {
      id: "rect",
      type: "default",
      position: { x: 80, y: 260 },
      data: { label: `Rectifier\n${rectifierOn ? "ON" : "OFF"}` },
      style: { borderRadius: 12, border: `2px solid ${rectifierOn ? "#22c55e" : "hsl(var(--muted-foreground))"}`, padding: 10, width: 160, textAlign: "center" }
    },
    {
      id: "pv",
      type: "default",
      position: { x: 80, y: 20 },
      data: { label: `Solar PV\n→ DC` },
      style: { borderRadius: 12, border: "2px solid hsl(var(--muted-foreground))", padding: 10, width: 160, textAlign: "center" }
    },
    {
      id: "wind",
      type: "default",
      position: { x: 80, y: 360 },
      data: { label: `Wind Turbine\nAC` },
      style: { borderRadius: 12, border: "2px solid hsl(var(--muted-foreground))", padding: 10, width: 160, textAlign: "center" }
    },
  ]), [frequency, voltage, inverterOn, dcBusKW, loadKW, rectifierOn, sync.enabled, sync.targetHz, sync.droopPct, sync.inertia]);

  const edges = useMemo<Edge[]>(() => ([
    { id: "pv->dc",    source: "pv",   target: "dc-bus",  label: "DC",         animated: true, style: { stroke: "#0ea5e9", strokeWidth: 2 } },
    { id: "rect->dc",  source: "rect", target: "dc-bus",  label: "AC→DC",      animated: rectifierOn, style: { stroke: rectifierOn ? "#22c55e" : "#94a3b8", strokeWidth: 2 } },
    { id: "dc->inv",   source: "dc-bus", target: "inv",   label: `${dcBusKW.toFixed(2)} kW`, animated: inverterOn, style: { stroke: inverterOn ? "#22c55e" : "#94a3b8", strokeWidth: 2 } },
    { id: "inv->sync", source: "inv",  target: "sync",    label: `${totalGenerationKW.toFixed(2)} kW`, animated: true, style: { stroke: "#22c55e", strokeWidth: 2 } },
    { id: "sync->load", source: "sync", target: "ac-load", label: `${loadKW.toFixed(2)} kW`, animated: true, style: { stroke: "#22c55e", strokeWidth: 2 } },
    { id: "wind->rect", source: "wind", target: "rect",    label: "AC", animated: rectifierOn, style: { stroke: rectifierOn ? "#22c55e" : "#94a3b8", strokeWidth: 2 } },
  ]), [rectifierOn, inverterOn, totalGenerationKW, dcBusKW, loadKW]);

  return (
    <>
      <div className="h-[520px] w-full rounded-xl border bg-background">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {/* Parameters dialog for the Sync Machine */}
      <Dialog open={paramsOpen} onOpenChange={setParamsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Synchronous Machine Parameters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch checked={tmpEnabled} onCheckedChange={setTmpEnabled} />
              <Label>Enable</Label>
            </div>
            <div>
              <Label>Target Frequency</Label>
              <div className="flex gap-2 mt-2">
                <Button variant={tmpTarget===50?"default":"outline"} onClick={()=>setTmpTarget(50)}>50 Hz</Button>
                <Button variant={tmpTarget===60?"default":"outline"} onClick={()=>setTmpTarget(60)}>60 Hz</Button>
              </div>
            </div>
            <div>
              <Label>Droop (%)</Label>
              <Slider value={[tmpDroop]} min={1} max={10} step={0.5} onValueChange={(v)=>setTmpDroop(v[0])} />
              <p className="text-xs text-muted-foreground mt-1">{tmpDroop.toFixed(1)}%</p>
            </div>
            <div>
              <Label>Inertia (0–1)</Label>
              <Slider value={[tmpInertia]} min={0} max={1} step={0.05} onValueChange={(v)=>setTmpInertia(v[0])} />
              <p className="text-xs text-muted-foreground mt-1">{tmpInertia.toFixed(2)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setParamsOpen(false)}>Cancel</Button>
            <Button onClick={()=>{
              sync.onChange?.({ enabled: tmpEnabled, targetHz: tmpTarget, droopPct: tmpDroop, inertia: tmpInertia });
              setParamsOpen(false);
            }}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
