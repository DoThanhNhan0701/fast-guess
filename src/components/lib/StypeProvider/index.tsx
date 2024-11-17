'use client'

import { ReactNode } from 'react'
import { StyleProvider as StyleProviderAntd } from '@ant-design/cssinjs'

export default function StyleProvider({ children }: { children: ReactNode }) {
  return <StyleProviderAntd layer>{children}</StyleProviderAntd>
}
