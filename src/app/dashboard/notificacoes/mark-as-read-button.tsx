'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function MarkAsReadButton({
  id,
  all,
  unreadCount,
}: {
  id?: string
  all?: boolean
  unreadCount?: number
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/notificacoes/marcar-lida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { ids: [id] } : { ids: [] }),
      })

      if (!res.ok) throw new Error('Erro ao marcar como lida')

      toast({
        title: all ? 'Todas marcadas como lidas' : 'Notificação marcada como lida',
        variant: 'success',
      })
      router.refresh()
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar como lida.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (all) {
    return (
      <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
        {loading ? 'Marcando...' : `Marcar todas como lidas (${unreadCount})`}
      </Button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
    >
      Marcar como lida
    </button>
  )
}
