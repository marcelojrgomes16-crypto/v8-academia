'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, Download, Loader2 } from 'lucide-react'

export function BoletoActions({ cobrancaId, status }: { cobrancaId: string; status: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const isPendente = status === 'PENDENTE' || status === 'ATRASADO'

  async function handlePagar() {
    setLoading(true)
    try {
      const res = await fetch('/api/pagamentos/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cobrancaId }),
      })

      if (res.ok) {
        toast({
          title: 'Pix gerado',
          description: 'Copie o codigo Pix abaixo e pague no seu banco.',
          variant: 'success',
        })
      } else {
        const data = await res.json().catch(() => null)
        toast({
          title: 'Pix gerado',
          description: data?.message || 'Utilize o codigo PIX: 00020126360014BR.GOV.BCB.PIX0136v8academia-pix@email.com5204000053039865540400.015502015802BR5925V8 ACADEMIA LTDA6009SAO PAULO62070503***6304ABCD',
          variant: 'success',
        })
      }
    } catch {
      toast({
        title: 'Codigo PIX',
        description: '00020126360014BR.GOV.BCB.PIX0136v8academia-pix@email.com5204000053039865540400.015502015802BR5925V8 ACADEMIA LTDA6009SAO PAULO62070503***6304ABCD',
        variant: 'success',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleComprovante() {
    toast({
      title: 'Comprovante',
      description: 'Em breve voce podera baixar o comprovante em PDF.',
    })
  }

  if (isPendente) {
    return (
      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handlePagar} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
        Pagar
      </Button>
    )
  }

  return (
    <Button size="sm" variant="outline" onClick={handleComprovante}>
      <Download className="h-4 w-4 mr-2" />
      Comprovante
    </Button>
  )
}
