'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export function ConfirmButton({ agendamentoId }: { agendamentoId: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      const res = await fetch('/api/agendamentos/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendamentoId }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Erro ao confirmar')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao confirmar agendamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleConfirm} disabled={loading}>
      <CheckCircle className="h-4 w-4" />
    </Button>
  )
}
