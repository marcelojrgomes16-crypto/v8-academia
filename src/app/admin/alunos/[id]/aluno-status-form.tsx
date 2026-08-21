'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { updateAlunoStatus } from '../../actions'
import { useToast } from '@/hooks/use-toast'

type Status = 'ATIVO' | 'INATIVO' | 'BLOQUEADO'

const statusConfig: Record<Status, { label: string; color: string }> = {
  ATIVO: { label: 'Ativo', color: 'bg-green-600 hover:bg-green-700' },
  INATIVO: { label: 'Inativo', color: 'bg-yellow-600 hover:bg-yellow-700' },
  BLOQUEADO: { label: 'Bloqueado', color: 'bg-red-600 hover:bg-red-700' },
}

export function AlunoStatusForm({
  alunoId,
  currentStatus,
}: {
  alunoId: string
  currentStatus: string
}) {
  const [loading, setLoading] = useState<Status | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = async (status: Status) => {
    setLoading(status)
    try {
      await updateAlunoStatus(alunoId, status)
      toast({
        title: 'Status atualizado',
        description: `Aluno marcado como ${statusConfig[status].label}`,
      })
      router.refresh()
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-2">
      {(Object.keys(statusConfig) as Status[]).map((status) => (
        <Button
          key={status}
          variant={currentStatus === status ? 'default' : 'outline'}
          className={`w-full ${currentStatus === status ? statusConfig[status].color : ''}`}
          onClick={() => handleChange(status)}
          disabled={loading !== null || currentStatus === status}
          loading={loading === status}
        >
          {statusConfig[status].label}
        </Button>
      ))}
    </div>
  )
}
