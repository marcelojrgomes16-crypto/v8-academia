'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = React.useState(false)

  const [notificacoesEmail, setNotificacoesEmail] = React.useState(true)
  const [notificacoesPush, setNotificacoesPush] = React.useState(true)
  const [notificacoesPagamento, setNotificacoesPagamento] = React.useState(true)
  const [notificacoesTreino, setNotificacoesTreino] = React.useState(true)
  const [notificacoesAgendamento, setNotificacoesAgendamento] = React.useState(true)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function handleSave() {
    toast({
      title: 'Configurações salvas',
      description: 'Suas preferências foram atualizadas com sucesso.',
      variant: 'success',
    })
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do painel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-gray-400">Escolha entre modo claro ou escuro</p>
              </div>
              {mounted && (
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Escuro
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Controle como você recebe notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              label="Notificações por e-mail"
              description="Receba notificações importantes por e-mail"
              checked={notificacoesEmail}
              onChange={setNotificacoesEmail}
            />
            <Separator />
            <ToggleRow
              label="Notificações push"
              description="Receba notificações no navegador"
              checked={notificacoesPush}
              onChange={setNotificacoesPush}
            />
            <Separator />
            <ToggleRow
              label="Lembretes de pagamento"
              description="Receba lembretes antes do vencimento"
              checked={notificacoesPagamento}
              onChange={setNotificacoesPagamento}
            />
            <Separator />
            <ToggleRow
              label="Atualizações de treino"
              description="Seja notificado quando um treino for atualizado"
              checked={notificacoesTreino}
              onChange={setNotificacoesTreino}
            />
            <Separator />
            <ToggleRow
              label="Lembretes de agendamento"
              description="Receba lembretes de aulas agendadas"
              checked={notificacoesAgendamento}
              onChange={setNotificacoesAgendamento}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Gerencie informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Alterar senha</p>
                <p className="text-xs text-gray-400">Atualize sua senha de acesso</p>
              </div>
              <Button variant="outline" size="sm">
                Alterar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Excluir conta</p>
                <p className="text-xs text-gray-400">Remova permanentemente sua conta e dados</p>
              </div>
              <Button variant="destructive" size="sm">
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gym-dark ${
          checked ? 'bg-primary-600' : 'bg-gym-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
