import api from './index'

export async function getHello() {
  const r = await api.get('/api/hello')
  return r.data
}
