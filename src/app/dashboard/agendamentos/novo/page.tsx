'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

const diasSemana = ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado']

export default function NovoAgendamentoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [carregandoAulas, setCarregandoAulas] = React.useState(true)
  const [aulas, setAulas] = React.useState<Array<{ id: string; nome: string; diaSemana: number; horaInicio: string; horaFim: string; professor: { nome: string } }>>([])

  React.useEffect(() => {
    fetch('/api/aulas')
      .then(res => res.json())
      .then(data => setAulas(data))
      .catch(() => {
        toast({ title: 'Erro', description: 'Nao foi possivel carregar as aulas disponiveis.', variant: 'destructive' })
      })
      .finally(() => setCarregandoAulas(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      aulaId: formData.get('aulaId') as string,
      dataHora: formData.get('dataHora') as string,
      observacoes: formData.get('observacoes') as string,
    }

    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Erro ao criar agendamento')
      }

      toast({ title: 'Agendamento criado', description: 'Sua aula foi agendada com sucesso.', variant: 'success' })
      router.push('/dashboard/agendamentos')
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao criar agendamento', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/agendamentos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Novo Agendamento</h1>
            <p className="text-gray-400">Agende uma nova aula</p>
          </div>
        </div>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-400" />
              Detalhes do Agendamento
            </CardTitle>
            <CardDescription>Preencha os dados para agendar sua aula</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aulaId">Aula</Label>
                <select
                  id="aulaId"
                  name="aulaId"
                  required
                  disabled={carregandoAulas}
                  className="flex h-10 w-full rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <option value="">{carregandoAulas ? 'Carregando aulas...' : 'Selecione uma aula'}</option>
                  {aulas.map((aula) => (
                    <option key={aula.id} value={aula.id}>
                      {aula.nome} - {diasSemana[aula.diaSemana]} ({aula.horaInicio} - {aula.horaFim}) - Prof. {aula.professor.nome}
                    </option>
                  ))}
                </select>
                {!carregandoAulas && aulas.length === 0 && (
                  <p className="text-xs text-yellow-400">Nenhuma aula disponivel no momento</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataHora">Data e Horario</Label>
                <Input
                  id="dataHora"
                  name="dataHora"
                  type="datetime-local"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observacoes (opcional)</Label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  rows={3}
                  className="flex w-full rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Alguma observacao sobre o agendamento..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/dashboard/agendamentos" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" loading={isLoading}>
                  <Loader2 className="h-4 w-4" />
                  Agendar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
