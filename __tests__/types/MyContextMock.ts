export interface MyContextMock {
  req: {
    headers: {
      cookie?: string
    }
    connection: {
      encrypted: boolean
    }
  }
  res: {
    getHeader: (key: string) => string
    setHeader: (key: string, value: string | string[]) => void
    headers: Record<string, string>
  }
}
