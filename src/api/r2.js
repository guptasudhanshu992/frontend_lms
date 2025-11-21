import api from './index'

export async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  const r = await api.post('/api/r2/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return r.data
}
