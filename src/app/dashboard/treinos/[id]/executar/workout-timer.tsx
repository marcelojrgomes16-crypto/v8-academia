'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface WorkoutTimerProps {
  duration: number
  onComplete: () => void
  autoStart?: boolean
}

export function WorkoutTimer({ duration, onComplete, autoStart = false }: WorkoutTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const [isRunning, setIsRunning] = React.useState(autoStart)
  const [hasFinished, setHasFinished] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    setTimeLeft(duration)
    setIsRunning(autoStart)
    setHasFinished(false)
  }, [duration, autoStart])

  React.useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setHasFinished(true)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, onComplete])

  const toggle = () => setIsRunning(!isRunning)

  const reset = () => {
    setTimeLeft(duration)
    setIsRunning(false)
    setHasFinished(false)
  }

  const progress = ((duration - timeLeft) / duration) * 100
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${
              hasFinished ? 'text-green-500' : timeLeft <= 10 ? 'text-yellow-500' : 'text-red-500'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-bold tabular-nums ${
              hasFinished ? 'text-green-500' : timeLeft <= 10 ? 'text-yellow-500' : 'text-white'
            }`}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          {hasFinished && (
            <span className="text-xs text-green-500 font-medium mt-1">Pronto!</span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="h-10 w-10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={toggle}
          className={`h-10 w-10 ${
            hasFinished
              ? 'bg-green-600 hover:bg-green-700'
              : isRunning
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          size="icon"
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {hasFinished && (
        <p className="text-sm text-green-400 font-medium animate-pulse">
          Descanso concluido! Proxima serie
        </p>
      )}
    </div>
  )
}
