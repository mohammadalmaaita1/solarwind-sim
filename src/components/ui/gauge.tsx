"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  min?: number
  max?: number
  unit?: string
  color?: string
  size?: number
  thickness?: number
}

export function Gauge({ value, min = 0, max = 100, unit = "", color = "hsl(var(--primary))", size = 200, thickness = 20 }: GaugeProps) {
  const percentage = (value - min) / (max - min)
  const angle = percentage * 270 - 135
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - percentage * 0.75) // 0.75 for 270 degrees

  const valueX = size / 2
  const valueY = size / 2 + (unit ? 10 : 0)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={thickness}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size/2} ${size/2})`}
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth={thickness}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(135 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />

        {/* Needle */}
        <g transform={`rotate(${angle} ${size/2} ${size/2})`}>
          <line
            x1={size / 2}
            y1={size / 2 - 5}
            x2={size / 2}
            y2={thickness + 15}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={size / 2} cy={size / 2} r={8} fill="hsl(var(--foreground))" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <span className="text-3xl font-bold" style={{ color }}>{value.toLocaleString()}</span>
         {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <div className="absolute bottom-[15%] left-0 w-full flex justify-between text-xs text-muted-foreground px-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
