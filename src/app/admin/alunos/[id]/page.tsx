import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate, formatCurrency, maskCPF, maskPhone } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Dumbbell, CreditCard } from 'lucide-react'
import { AlunoStatusForm } from './aluno-status-form'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  INATIVO: 'warning',
  BLOQUEADO: 'destructive',
  PENDENTE: 'info',
}

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  BLOQUEADO: 'Bloqueado',
  PENDENTE: 'Pendente',
}

const treinoStatusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  PAUSADO: 'warning',
  CONCLUIDO: 'info',
  CANCELADO: 'destructive',
}

const treinoStatusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  PAUSADO: 'Pausado',
  CONCLUIDO: 'Concluido',
  CANCELADO: 'Cancelado',
}

interface AlunoDetailPageProps {
  params: { id: string }
}

export default async function AlunoDetailPage({ params }: AlunoDetailPageProps) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const aluno = await prisma.aluno.findUnique({
    where: { id: params.id },
    include: {
      usuario: {
        select: {
          id: true, nome: true, email: true, cpf: true, status: true,
          telefone: true, dataNascimento: true, endereco: true,
          avatarUrl: true, createdAt: true,
        },
      },
      plano: true,
      professor: {
        include: { usuario: { select: { nome: true, email: true } } },
      },
    },
  })

  if (!aluno) notFound()

  const [pagamentos, treinos] = await Promise.all([
    prisma.pagamento.findMany({
      where: { alunoId: aluno.usuarioId },
      include: { plano: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.treino.findMany({
      where: { alunoId: aluno.usuarioId },
      include: {
        professor: { select: { nome: true } },
        exercicios: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const endereco = aluno.usuario.endereco as Record<string, string> | null

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/admin/alunos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback name={aluno.usuario.nome} className="text-xl" />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{aluno.usuario.nome}</h1>
              <Badge variant={statusVariant[aluno.usuario.status]}>
                {statusLabel[aluno.usuario.status]}
              </Badge>
            </div>
            <p className="text-gray-400 text-sm">Matricula: {aluno.matricula}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacoes Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">E-mail</p>
                    <p className="text-sm">{aluno.usuario.email}</p>
                  </div>
                </div>
                {aluno.usuario.cpf && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">CPF</p>
                      <p className="text-sm">{maskCPF(aluno.usuario.cpf)}</p>
                    </div>
                  </div>
                )}
                {aluno.usuario.telefone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm">{maskPhone(aluno.usuario.telefone)}</p>
                    </div>
                  </div>
                )}
                {aluno.usuario.dataNascimento && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Nascimento</p>
                      <p className="text-sm">{formatDate(aluno.usuario.dataNascimento)}</p>
                    </div>
                  </div>
                )}
              </div>
              {endereco && (
                <div className="flex items-start gap-3 pt-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Endereco</p>
                    <p className="text-sm">
                      {[endereco.rua, endereco.numero, endereco.bairro, endereco.cidade, endereco.estado]
                        .filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
              {aluno.objetivo && (
                <div className="pt-2 border-t border-gym-border">
                  <p className="text-xs text-gray-500 mb-1">Objetivo</p>
                  <p className="text-sm text-gray-300">{aluno.objetivo}</p>
                </div>
              )}
              {aluno.restricoes && (
                <div className="pt-2 border-t border-gym-border">
                  <p className="text-xs text-gray-500 mb-1">Restricoes</p>
                  <p className="text-sm text-gray-300">{aluno.restricoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-red-400" />
                Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {treinos.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Nenhum treino encontrado</p>
              ) : (
                <div className="space-y-3">
                  {treinos.map((treino) => (
                    <div key={treino.id} className="flex items-center justify-between py-2 border-b border-gym-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{treino.nome}</p>
                        <p className="text-xs text-gray-500">
                          Prof. {treino.professor.nome} - {treino.exercicios.length} exercicios
                        </p>
                      </div>
                      <Badge variant={treinoStatusVariant[treino.status]}>
                        {treinoStatusLabel[treino.status]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-400" />
                Historico de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pagamentos.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Nenhum pagamento encontrado</p>
              ) : (
                <div className="space-y-3">
                  {pagamentos.map((pagamento) => (
                    <div key={pagamento.id} className="flex items-center justify-between py-2 border-b border-gym-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{pagamento.plano.nome}</p>
                        <p className="text-xs text-gray-500">
                          Vencimento: {formatDate(pagamento.dataVencimento)}
                          {pagamento.dataPagamento ? ` - Pago: ${formatDate(pagamento.dataPagamento)}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">{formatCurrency(pagamento.valor)}</p>
                        <Badge variant={pagamento.status === 'PAGO' ? 'success' : 'warning'} className="text-[10px]">
                          {pagamento.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gerenciar Status</CardTitle>
            </CardHeader>
            <CardContent>
              <AlunoStatusForm alunoId={aluno.usuarioId} currentStatus={aluno.usuario.status} />
            </CardContent>
          </Card>

          {aluno.plano && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plano Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Plano</p>
                  <p className="text-sm font-medium">{aluno.plano.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="text-sm font-medium text-green-400">{formatCurrency(aluno.plano.preco)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duracao</p>
                  <p className="text-sm font-medium">{aluno.plano.duracaoDias} dias</p>
                </div>
                {aluno.dataVencimento && (
                  <div>
                    <p className="text-xs text-gray-500">Proximo Vencimento</p>
                    <p className="text-sm font-medium">{formatDate(aluno.dataVencimento)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {aluno.professor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professor Responsavel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback name={aluno.professor.usuario.nome} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{aluno.professor.usuario.nome}</p>
                    <p className="text-xs text-gray-500">{aluno.professor.usuario.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
