import { FormEvent, useState } from 'react'
import { createService } from '../config/api.services'
import { useUser } from '../context/UserContext' // ajustá el path si es distinto

export default function AdminCreateServicePage() {
  const { user } = useUser()
  const [provider, setProvider] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [isActive, setIsActive] = useState(true)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      setLoading(true)

      await createService({
        provider: user.provider,
        name,
        description,
        price: Number(price),
        currency,
        billingPeriod,
        isActive,
      })

      setSuccess('Servicio creado correctamente')
      setName('')
      setDescription('')
      setPrice('')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al crear servicio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h1>Alta de Servicio</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
        </select>

        <select value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value)}>
          <option value="monthly">Mensual</option>
          <option value="yearly">Anual</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Activo
        </label>

        <button disabled={loading}>{loading ? 'Creando...' : 'Crear servicio'}</button>
      </form>
    </div>
  )
}
