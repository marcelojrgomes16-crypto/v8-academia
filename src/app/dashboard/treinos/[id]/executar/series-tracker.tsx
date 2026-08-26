'use client'

import * as React from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface SeriesTrackerProps {
  totalSeries: number
  completedSeries: number
  onToggle: (seriesIndex: number) => void
  seriesCompleted: boolean[]
}

export function SeriesTracker({
  totalSeries,
  completedSeries,
  onToggle,
  seriesCompleted,
}: SeriesTrackerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Series</span>
        <span className="text-sm text-gray-500">
          {completedSeries}/{totalSeries} concluidas
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: totalSeries }, (_, i) => {
          const isCompleted = seriesCompleted[i]
          return (
            <button
              key={i}
              onClick={() => onToggle(i)}
              className={`flex items-center justify-center h-12 w-12 rounded-xl font-bold text-sm transition-all ${
                isCompleted
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:border-red-500/50 hover:text-white'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{i + 1}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex gap-1 mt-2">
        {Array.from({ length: totalSeries }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              seriesCompleted[i] ? 'bg-green-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
