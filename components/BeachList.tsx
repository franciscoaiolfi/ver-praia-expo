// src/features/beaches/BeachList.tsx
import { fetchMunicipios, fetchLocaisByMunicipio, fetchPontosByLocal } from '@/features/municipios/repo'
import { Municipio, LocalBalneario, PontoColeta } from '@/features/municipios/type'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native'


export default function BeachList() {
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const lista = await fetchMunicipios()
        console.log('Municípios:', lista.slice(0, 5))
        setMunicipios(lista)
      } catch (e: any) {
        setError(e?.message ?? 'Falha ao buscar municípios')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <Loader text="Carregando municípios…" />
  if (error)   return <ErrorBox text={error} />

  return (
    <FlatList
      data={municipios}
      keyExtractor={(item) => String(item.CODIGO)}
      renderItem={({ item }) => <MunicipioRow municipio={item} />}
    />
  )
}

function MunicipioRow({ municipio }: { municipio: Municipio }) {
  const [open, setOpen] = useState(false)
  const [locais, setLocais] = useState<LocalBalneario[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const toggle = async () => {
    const willOpen = !open
    setOpen(willOpen)
    if (willOpen && locais == null && !loading) {
      try {
        setLoading(true)
        const l = await fetchLocaisByMunicipio(municipio.CODIGO)
        setLocais(l)
      } catch (e: any) {
        setErr(e?.message ?? 'Falha ao buscar locais')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <View style={{ borderBottomWidth: 1, borderColor: '#eee' }}>
      <Pressable onPress={toggle} style={{ padding: 14 }}>
        <Text style={{ fontWeight: '600' }}>{municipio.DESCRICAO}</Text>
      </Pressable>

      {open && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
          {loading && <Loader text="Carregando locais…" small />}
          {err && <ErrorBox text={err} small />}
          {locais && locais.length === 0 && <Text>Nenhum local.</Text>}
          {locais && locais.map(local => (
            <LocalRow key={local.CODIGO} local={local} />
          ))}
        </View>
      )}
    </View>
  )
}

function LocalRow({ local }: { local: LocalBalneario }) {
  const [open, setOpen] = useState(false)
  const [pontos, setPontos] = useState<PontoColeta[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const toggle = async () => {
    const willOpen = !open
    setOpen(willOpen)
    if (willOpen && pontos == null && !loading) {
      try {
        setLoading(true)
        const p = await fetchPontosByLocal(local.CODIGO)
        setPontos(p)
      } catch (e: any) {
        setErr(e?.message ?? 'Falha ao buscar pontos')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <View style={{ marginBottom: 8, backgroundColor: '#fafafa', borderRadius: 8 }}>
      <Pressable onPress={toggle} style={{ padding: 10 }}>
        <Text style={{ fontWeight: '500' }}>{local.BALNEARIO}</Text>
        <Text style={{ color:'#666', fontSize:12 }}>
          {local.LATITUDE}, {local.LONGITUDE}
        </Text>
      </Pressable>

      {open && (
        <View style={{ paddingHorizontal: 10, paddingBottom: 10, gap: 6 }}>
          {loading && <Loader text="Carregando pontos…" small />}
          {err && <ErrorBox text={err} small />}
          {pontos && pontos.length === 0 && <Text>Nenhum ponto.</Text>}
          {pontos && pontos.map((pt, idx) => (
            <View key={idx} style={{ paddingVertical: 6, borderTopWidth: idx ? 1 : 0, borderColor: '#eee' }}>
              <Text>{pt.LOCALIZACAO}</Text>
              <Text style={{ fontSize:12, fontWeight:'600', color: colorByCondicao(pt.CONDICAO) }}>
                {pt.CONDICAO}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

function colorByCondicao(c: string) {
  if (c === 'PRÓPRIO')   return 'blue'
  if (c === 'IMPRÓPRIO') return 'red'
  return 'orange'
}

function Loader({ text, small }: { text: string; small?: boolean }) {
  return (
    <View style={{ padding: small ? 6 : 16, flexDirection:'row', alignItems:'center', gap:8 }}>
      <ActivityIndicator />
      <Text>{text}</Text>
    </View>
  )
}

function ErrorBox({ text, small }: { text: string; small?: boolean }) {
  return <Text style={{ color: 'red', padding: small ? 6 : 12 }}>Erro: {text}</Text>
}
