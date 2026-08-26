# Padroes

> Como eu faco as coisas.

## Componentes

```tsx
interface Props {
  titulo: string
}

export function MeuComponente({ titulo }: Props) {
  return <h1>{titulo}</h1>
}
```

## Server Component

```tsx
export const dynamic = 'force-dynamic'

export default async function Pagina() {
  const session = await getSession()
  const dados = await prisma.modelo.findMany()
  return <Componente dados={dados} />
}
```

## Prisma

```typescript
const resultado = await prisma.modelo.findMany({
  where: { campo: 'valor' },
  include: { relacao: true }
})
```

## Regras

1. Um componente por arquivo
2. PascalCase para componentes
3. TypeScript sempre
4. Testar antes de commitar
