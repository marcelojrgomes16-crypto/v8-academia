import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma';
import { formatDate, maskCPF, maskPhone } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    include: {
      aluno: {
        include: {
          plano: true,
        },
      },
    },
  })

  if (!usuario) redirect('/entrar')

  const endereco = usuario.endereco as Record<string, string> | null

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-gray-400 text-sm mt-1">
            Visualize suas informacoes pessoais
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={usuario.avatarUrl || ''} alt={usuario.nome} />
                <AvatarFallback name={usuario.nome} className="text-2xl" />
              </Avatar>
              <h2 className="text-xl font-bold">{usuario.nome}</h2>
              <p className="text-gray-400 text-sm">{usuario.email}</p>
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400 capitalize">
                  {usuario.role.toLowerCase()}
                </span>
              </div>
              {usuario.aluno?.plano && (
                <div className="mt-4 w-full">
                  <Separator className="mb-4" />
                  <p className="text-xs text-gray-400 mb-1">Plano Atual</p>
                  <p className="font-medium">{usuario.aluno.plano.nome}</p>
                  <p className="text-xs text-gray-500">
                    Matrícula: {usuario.aluno.matricula}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Nome Completo" value={usuario.nome} />
              <Separator />
              <InfoRow label="E-mail" value={usuario.email} />
              <Separator />
              <InfoRow label="CPF" value={usuario.cpf ? maskCPF(usuario.cpf) : 'Não informado'} />
              <Separator />
              <InfoRow label="Telefone" value={usuario.telefone ? maskPhone(usuario.telefone) : 'Não informado'} />
              <Separator />
              <InfoRow
                label="Data de Nascimento"
                value={usuario.dataNascimento ? formatDate(usuario.dataNascimento) : 'Não informado'}
              />
              <Separator />
              <InfoRow label="Status" value={usuario.status} />
            </CardContent>
          </Card>

          {endereco && Object.keys(endereco).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {endereco.rua && <InfoRow label="Rua" value={endereco.rua} />}
                {endereco.numero && <InfoRow label="Número" value={endereco.numero} />}
                {endereco.complemento && <InfoRow label="Complemento" value={endereco.complemento} />}
                {endereco.bairro && <InfoRow label="Bairro" value={endereco.bairro} />}
                {endereco.cidade && <InfoRow label="Cidade" value={endereco.cidade} />}
                {endereco.estado && <InfoRow label="Estado" value={endereco.estado} />}
                {endereco.cep && <InfoRow label="CEP" value={endereco.cep} />}
              </CardContent>
            </Card>
          )}

          {usuario.aluno && (
            <Card>
              <CardHeader>
                <CardTitle>Informações da Matrícula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Matrícula" value={usuario.aluno.matricula} />
                <Separator />
                <InfoRow
                  label="Data de Matrícula"
                  value={formatDate(usuario.aluno.dataMatricula)}
                />
                <Separator />
                <InfoRow
                  label="Data de Vencimento"
                  value={
                    usuario.aluno.dataVencimento
                      ? formatDate(usuario.aluno.dataVencimento)
                      : 'Não definida'
                  }
                />
                {usuario.aluno.objetivo && (
                  <>
                    <Separator />
                    <InfoRow label="Objetivo" value={usuario.aluno.objetivo} />
                  </>
                )}
                {usuario.aluno.observacoes && (
                  <>
                    <Separator />
                    <InfoRow label="Observações" value={usuario.aluno.observacoes} />
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
