'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2 } from 'lucide-react'

interface Configuracao {
  id: string
  chave: string
  valor: string
  tipo: string
}

export function ConfiguracaoForm({ configuracoes }: { configuracoes: Configuracao[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [configs, setConfigs] = useState(configuracoes)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave(id: string, chave: string, valor: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/configuracoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chave, valor }),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      toast({ title: 'Configuracao salva' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao salvar configuracao', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleAdd() {
    if (!newKey.trim() || !newValue.trim()) {
      toast({ title: 'Erro', description: 'Chave e valor sao obrigatorios', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chave: newKey, valor: newValue }),
      })
      if (!res.ok) throw new Error('Erro ao criar')
      setNewKey('')
      setNewValue('')
      toast({ title: 'Configuracao criada' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao criar configuracao', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza?')) return
    try {
      const res = await fetch(`/api/admin/configuracoes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Configuracao excluida' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      {configs.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Nenhuma configuracao encontrada</p>
      ) : (
        configs.map((config) => (
          <ConfigRow key={config.id} config={config} onSave={handleSave} onDelete={handleDelete} saving={saving} />
        ))
      )}

      <div className="border-t border-red-900/20 pt-4">
        <p className="text-sm font-medium text-gray-300 mb-3">Nova Configuracao</p>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label>Chave</Label>
            <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="nome_da_config" />
          </div>
          <div className="flex-1">
            <Label>Valor</Label>
            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="valor" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd} loading={saving}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigRow({ config, onSave, onDelete, saving }: {
  config: Configuracao
  onSave: (id: string, chave: string, valor: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  saving: boolean
}) {
  const [valor, setValor] = useState(config.valor)
  const [chave, setChave] = useState(config.chave)

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-red-900/10 bg-white/[0.02]">
      <div className="flex-1">
        <Input value={chave} onChange={(e) => setChave(e.target.value)} placeholder="Chave" />
      </div>
      <div className="flex-1">
        <Input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor" />
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={() => onSave(config.id, chave, valor)} loading={saving}>
          Salvar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(config.id)} className="text-red-400">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
