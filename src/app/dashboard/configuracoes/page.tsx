'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/lib/auth-context'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

function getStoredPrefs() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('v8-config-prefs') || '{}')
  } catch { return {} }
}

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { user, logout } = useSession()
  const [mounted, setMounted] = React.useState(false)
  const [prefs, setPrefs] = React.useState(() => getStoredPrefs() || {})
  const [savingPrefs, setSavingPrefs] = React.useState(false)

  const [senhaAtual, setSenhaAtual] = React.useState('')
  const [novaSenha, setNovaSenha] = React.useState('')
  const [confirmarSenha, setConfirmarSenha] = React.useState('')
  const [showSenha, setShowSenha] = React.useState(false)
  const [alterandoSenha, setAlterandoSenha] = React.useState(false)

  const [excluindo, setExcluindo] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setPrefs(getStoredPrefs() || {})
  }, [])

  function updatePref(key: string, value: boolean) {
    const newPrefs = { ...prefs, [key]: value }
    setPrefs(newPrefs)
    localStorage.setItem('v8-config-prefs', JSON.stringify(newPrefs))
  }

  function handleSave() {
    localStorage.setItem('v8-config-prefs', JSON.stringify(prefs))
    toast({
      title: 'Configuracoes salvas',
      description: 'Suas preferencias foram atualizadas com sucesso.',
      variant: 'success',
    })
  }

  async function handleAlterarSenha() {
    if (!senhaAtual || !novaSenha) {
      toast({ title: 'Preencha os campos', description: 'Informe a senha atual e a nova senha.', variant: 'destructive' })
      return
    }
    if (novaSenha.length < 6) {
      toast({ title: 'Senha curta', description: 'A nova senha deve ter pelo menos 6 caracteres.', variant: 'destructive' })
      return
    }
    if (novaSenha !== confirmarSenha) {
      toast({ title: 'Senhas nao conferem', description: 'A confirmacao deve ser igual a nova senha.', variant: 'destructive' })
      return
    }

    setAlterandoSenha(true)
    try {
      const res = await fetch('/api/auth/alterar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      })
      if (res.ok) {
        toast({ title: 'Senha alterada', description: 'Sua senha foi atualizada com sucesso.', variant: 'success' })
        setSenhaAtual('')
        setNovaSenha('')
        setConfirmarSenha('')
      } else {
        const data = await res.json().catch(() => null)
        toast({ title: 'Erro', description: data?.message || 'Erro ao alterar senha.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erro', description: 'Erro ao conectar com o servidor.', variant: 'destructive' })
    } finally {
      setAlterandoSenha(false)
    }
  }

  async function handleExcluirConta() {
    const confirmado = window.confirm('Tem certeza que deseja excluir sua conta? Esta acao e irreversivel.')
    if (!confirmado) return

    setExcluindo(true)
    try {
      const res = await fetch('/api/auth/excluir-conta', { method: 'POST' })
      if (res.ok) {
        toast({ title: 'Conta excluida', description: 'Sua conta foi removida.', variant: 'success' })
        setTimeout(() => logout(), 1000)
      } else {
        const data = await res.json().catch(() => null)
        toast({ title: 'Erro', description: data?.message || 'Erro ao excluir conta.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erro', description: 'Erro ao conectar com o servidor.', variant: 'destructive' })
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie suas preferencias e configuracoes da conta
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Aparencia</CardTitle>
            <CardDescription>Personalize a aparencia do painel</CardDescription>
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
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    Escuro
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificacoes</CardTitle>
            <CardDescription>Controle como voce recebe notificacoes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              label="Notificacoes por e-mail"
              description="Receba notificacoes importantes por e-mail"
              checked={prefs.notifEmail !== false}
              onChange={(v) => updatePref('notifEmail', v)}
            />
            <Separator />
            <ToggleRow
              label="Notificacoes push"
              description="Receba notificacoes no navegador"
              checked={prefs.notifPush !== false}
              onChange={(v) => updatePref('notifPush', v)}
            />
            <Separator />
            <ToggleRow
              label="Lembretes de pagamento"
              description="Receba lembretes antes do vencimento"
              checked={prefs.notifPagamento !== false}
              onChange={(v) => updatePref('notifPagamento', v)}
            />
            <Separator />
            <ToggleRow
              label="Atualizacoes de treino"
              description="Seja notificado quando um treino for atualizado"
              checked={prefs.notifTreino !== false}
              onChange={(v) => updatePref('notifTreino', v)}
            />
            <Separator />
            <ToggleRow
              label="Lembretes de agendamento"
              description="Receba lembretes de aulas agendadas"
              checked={prefs.notifAgendamento !== false}
              onChange={(v) => updatePref('notifAgendamento', v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Gerencie informacoes da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Alterar senha</p>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Senha atual"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Nova senha (min. 6 caracteres)"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Confirmar nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    {showSenha ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showSenha ? 'Ocultar' : 'Mostrar'} senhas
                  </button>
                  <Button size="sm" onClick={handleAlterarSenha} disabled={alterandoSenha}>
                    {alterandoSenha ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Alterar Senha
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Excluir conta</p>
                <p className="text-xs text-gray-400">Remova permanentemente sua conta e dados</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleExcluirConta} disabled={excluindo}>
                {excluindo ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Alteracoes</Button>
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
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${
          checked ? 'bg-red-600' : 'bg-gray-700'
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
