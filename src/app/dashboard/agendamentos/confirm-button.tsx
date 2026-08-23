'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ConfirmButton({ agendamentoId }: { agendamentoId: string }) {
  const router = useRouter()
  const { toast } = useToast()
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

      toast({ title: 'Agendamento confirmado', variant: 'success' })
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao confirmar agendamento', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleConfirm} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
    </Button>
  )
}
