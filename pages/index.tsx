import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/feed')
      else router.push('/login')
    })
  }, [])

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
}
