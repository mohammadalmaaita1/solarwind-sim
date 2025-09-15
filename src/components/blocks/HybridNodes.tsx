"use client";
import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

export type InverterNodeData = {
  title?: string;
  frequency: number;
  voltage: number;
  inverterOn: boolean;
  eff?: number;
};

export function HybridInverterNode({ data }: NodeProps<InverterNodeData>) {
  const { title = "Hybrid Inverter", frequency, voltage, inverterOn, eff = 0.94 } = data;
  return (
    <div className={`rounded-xl border-2 bg-card p-3 w-56 shadow-sm ${inverterOn ? "border-green-500" : "border-muted"}`}>
      <div className="font-semibold text-sm text-center">{title}</div>
      <div className="text-xs mt-2 space-y-1">
        <div className="flex justify-between"><span>Frequency</span><span className="font-mono">{frequency.toFixed(2)} Hz</span></div>
        <div className="flex justify-between"><span>Voltage</span><span className="font-mono">{voltage.toFixed(1)} V</span></div>
        <div className="flex justify-between"><span>η (inv.)</span><span className="font-mono">{Math.round(eff*100)}%</span></div>
      </div>
      {/* Ports */}
      <Handle type="target"  position={Position.Left}  id="dc-in"     style={{ background: "#0ea5e9" }} />
      <Handle type="source"  position={Position.Right} id="ac-out"    style={{ background: "#22c55e" }} />
    </div>
  );
}

export type SyncNodeData = {
  title?: string;
  enabled: boolean;
  targetHz: 50|60;
  droopPct: number;
  inertia: number;
  frequency: number;
  onOpenParams?: () => void;
};

export function SynchronousMachineNode({ data }: NodeProps<SyncNodeData>) {
  const { title = "Synchronous Machine", enabled, targetHz, droopPct, inertia, frequency, onOpenParams } = data;
  return (
    <div className={`rounded-xl border-2 bg-card p-3 w-64 shadow-sm ${enabled ? "border-green-500" : "border-muted"}`}>
      <div className="font-semibold text-sm text-center">{title}</div>
      <div className="text-xs mt-2 space-y-1">
        <div className="flex justify-between"><span>Enabled</span><span className="font-mono">{enabled ? "Yes" : "No"}</span></div>
        <div className="flex justify-between"><span>Target f</span><span className="font-mono">{targetHz} Hz</span></div>
        <div className="flex justify-between"><span>Droop</span><span className="font-mono">{droopPct.toFixed(1)}%</span></div>
        <div className="flex justify-between"><span>Inertia</span><span className="font-mono">{inertia.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>f (live)</span><span className="font-mono">{frequency.toFixed(2)} Hz</span></div>
      </div>
      <button
        className="mt-2 text-xs w-full rounded-md border px-2 py-1 hover:bg-muted"
        onClick={onOpenParams}
      >Open Parameters</button>
      {/* Ports */}
      <Handle type="target" position={Position.Left} id="ac-in"   style={{ background: "#22c55e" }} />
      <Handle type="source" position={Position.Right} id="ac-out" style={{ background: "#22c55e" }} />
    </div>
  );
}
