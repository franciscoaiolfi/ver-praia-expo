export type Municipio = {
  CODIGO: string; 
  DESCRICAO: string;
  EMAIL?: string;
  IBGE?: string;
}


export type Condicao = 'PRÓPRIO' | 'IMPRÓPRIO' | 'MEDIÇÃO NÃO REALIZADA' | string

export interface PontoColeta {
  LOCALIZACAO: string
  CONDICAO: Condicao
}

export interface LocalBalneario {
  CODIGO: number
  LATITUDE: string
  LONGITUDE: string
  BALNEARIO: string
}