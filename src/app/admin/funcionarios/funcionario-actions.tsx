'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FuncionarioActions({ funcionario, usuarios }: { funcionario?: any; usuarios?: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    usuarioId: funcionario?.usuario.id || '',
    cargo: funcionario?.cargo || '',
    salario: funcionario?.salario?.toString() || '',
    dataAdmissao: funcionario?.dataAdmissao ? new Date(funcionario.dataAdmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    observacoes: funcionario?.observacoes || '',
  })

  const isEditing = !!funcionario

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        usuarioId: form.usuarioId,
        cargo: form.cargo,
        salario: form.salario ? parseFloat(form.salario) : null,
        dataAdmissao: form.dataAdmissao,
        observacoes: form.observacoes || null,
      }

      const url = isEditing ? `/api/admin/funcionarios/${funcionario.id}` : '/api/admin/funcionarios'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      toast({ title: isEditing ? 'Funcionario atualizado' : 'Funcionario criado' })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!funcionario) return
    if (!confirm('Tem certeza que deseja excluir este funcionario?')) return
    try {
      const res = await fetch(`/api/admin/funcionarios/${funcionario.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Funcionario excluido' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  if (!funcionario) {
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Funcionario
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Novo Funcionario</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FuncionarioFormFields form={form} setForm={setForm} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit" loading={loading}>Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="h-3 w-3" />
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 className="h-3 w-3" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Funcionario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FuncionarioFormFields form={form} setForm={setForm} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" loading={loading}>Atualizar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function FuncionarioFormFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  return (
    <>
      {!form.usuarioId && (
        <div>
          <Label>Usuario ID *</Label>
          <Input value={form.usuarioId} onChange={(e) => setForm({ ...form, usuarioId: e.target.value })} required placeholder="ID do usuario" />
        </div>
      )}
      <div>
        <Label>Cargo *</Label>
        <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Salario (R$)</Label>
          <Input type="number" step="0.01" value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} />
        </div>
        <div>
          <Label>Data Admissao *</Label>
          <Input type="date" value={form.dataAdmissao} onChange={(e) => setForm({ ...form, dataAdmissao: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label>Observacoes</Label>
        <Input value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
      </div>
    </>
  )
}
