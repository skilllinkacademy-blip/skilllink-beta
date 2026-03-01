import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function NewOpportunity() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const handleSubmit = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { error } = await supabase.from('opportunities').insert({
      title, description, city: 'PTK', status: 'open'
    })
    if (error) setError(error.message)
    else router.push('/dashboard')
  }

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <h1>New Opportunity</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: '1rem' }} />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', minHeight: '80px' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
