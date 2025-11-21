import api from './index'

export async function listVideos() {
  const r = await api.get('/api/stream/videos')
  return r.data
}
