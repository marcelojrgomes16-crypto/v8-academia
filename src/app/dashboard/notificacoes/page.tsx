import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MarkAsReadButton } from './mark-as-read-button'

const tipoConfig: Record<string, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'destructive'; icon: string }> = {
  TREINO: { label: 'Treino', variant: 'info', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
  PAGAMENTO: { label: 'Pagamento', variant: 'warning', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  AGENDAMENTO: { label: 'Agendamento', variant: 'success', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  SISTEMA: { label: 'Sistema', variant: 'default', icon: 'M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 3v18' },
}

export default async function NotificacoesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [notificacoes, unreadCount] = await Promise.all([
    prisma.notificacao.findMany({
      where: { usuarioId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notificacao.count({
      where: { usuarioId: session.user.id, lida: false },
    }),
  ])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-gray-400 text-sm mt-1">
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificação${unreadCount !== 1 ? 's' : ''} não lida${unreadCount !== 1 ? 's' : ''}`
              : 'Todas as notificações foram lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <MarkAsReadButton all unreadCount={unreadCount} />
        )}
      </div>

      {notificacoes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <p className="text-gray-400">Nenhuma notificação ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((notificacao) => {
            const config = tipoConfig[notificacao.tipo] || tipoConfig.SISTEMA
            return (
              <Card
                key={notificacao.id}
                className={!notificacao.lida ? 'border-primary-500/50 bg-primary-600/5' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gym-card">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold">{notificacao.titulo}</h3>
                        {!notificacao.lida && (
                          <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                        )}
                        <Badge variant={config.variant} className="text-[10px]">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{notificacao.mensagem}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDateTime(notificacao.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {notificacao.link && (
                            <a
                              href={notificacao.link}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Ver detalhes
                            </a>
                          )}
                          {!notificacao.lida && (
                            <MarkAsReadButton id={notificacao.id} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
