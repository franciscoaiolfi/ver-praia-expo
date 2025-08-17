import type { AxiosInstance } from 'axios'
import { http as defaultHttp } from '../../api/http'
import { LocalBalneario, Municipio, PontoColeta } from './type'


function parseMaybeString<T>(data: unknown): T {
  if (typeof data === 'string') {
    return JSON.parse(data) as T
  }
  return data as T
}


function form(params: Record<string, string | number>) {
  const f = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => f.append(k, String(v)))
  return f
}

export async function fetchMunicipios(opts?: { http?: AxiosInstance }): Promise<Municipio[]> {
  const client = opts?.http ?? defaultHttp
  const resp = await client.post('/municipio/getMunicipios')
  const parsed = parseMaybeString<Municipio[]>(resp.data)
  return parsed
}

export async function fetchLocaisByMunicipio(
  municipioID: number | string,
  opts?: { http?: AxiosInstance }
): Promise<LocalBalneario[]> {
  const client = opts?.http ?? defaultHttp
  const resp = await client.post(
    '/local/getLocaisByMunicipio',
    form({ municipioID }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
  return parseMaybeString<LocalBalneario[]>(resp.data)
}


export async function fetchPontosByLocal(
  localID: number | string,
  opts?: { http?: AxiosInstance }
): Promise<PontoColeta[]> {
  const client = opts?.http ?? defaultHttp
  const resp = await client.post(
    '/pontoColeta/getPontosByLocal',
    form({ localID }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
  return parseMaybeString<PontoColeta[]>(resp.data)
}


export async function fetchAnosAnalisados(opts?: { http?: AxiosInstance }): Promise<number[]> {
  const client = opts?.http ?? defaultHttp
  const resp = await client.post('/registro/anosAnalisados')
  const arr = parseMaybeString<{ ANO: number }[]>(resp.data)
  return arr.map(a => a.ANO)
}