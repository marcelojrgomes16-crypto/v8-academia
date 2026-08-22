import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PlanoPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const aluno = await prisma.aluno.findFirst({
    where: { usuarioId: session.user.id },
    include: {
      plano: true,
      professor: {
        select: { nome: true, cref: true },
      },
    },
  })

  if (!aluno) redirect('/dashboard')

  const pagamentosRecentes = await prisma.pagamento.findMany({
    where: { alunoId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Meu Plano</h1>
          <p className="text-gray-400 text-sm mt-1">Detalhes da sua matricula</p>
        </div>

        <Card className="bg-[#141414] border-red-900/20 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-600 to-red-800" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{aluno.plano?.nome || 'Sem plano'}</h2>
                  <Badge variant={aluno.plano?.ativo ? 'success' : 'warning'}>
                    {aluno.plano?.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4">{aluno.plano?.descricao || 'Plano de acadimia V8'}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Matricula: {formatDate(aluno.dataMatricula)}
                  </span>
                  {aluno.dataVencimento && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Vencimento: {formatDate(aluno.dataVencimento)}
                    </span>
                  )}
                  {aluno.professor && (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Professor: {aluno.professor.nome}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-red-500">
                  {formatCurrency(aluno.plano?.preco || 0)}
                </p>
                <p className="text-sm text-gray-400">/mes</p>
              </div>
            </div>

            {aluno.plano?.features && Array.isArray(aluno.plano.features) && (aluno.plano.features as string[]).length > 0 && (
              <div className="mt-6 pt-6 border-t border-red-900/20">
                <p className="text-sm font-medium text-gray-400 mb-3">Incluso no seu plano:</p>
                <div className="flex flex-wrap gap-2">
                  {(aluno.plano.features as string[]).map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {aluno.objetivo && (
          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base">Meu Objetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{aluno.objetivo}</p>
            </CardContent>
          </Card>
        )}

        {aluno.restricoes && (
          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base">Restricoes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{aluno.restricoes}</p>
            </CardContent>
          </Card>
        )}

        {pagamentosRecentes.length > 0 && (
          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-red-400" />
                Ultimos Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pagamentosRecentes.map((pag) => (
                  <div key={pag.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm text-gray-300">{formatDate(pag.dataPagamento || pag.createdAt)}</p>
                      <p className="text-xs text-gray-500">{pag.metodo || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{formatCurrency(pag.valor)}</p>
                      <Badge variant={pag.status === 'PAGO' ? 'success' : 'warning'} className="text-[10px]">
                        {pag.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
