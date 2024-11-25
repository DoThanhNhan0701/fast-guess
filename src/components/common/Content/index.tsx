'use client'

import { Breadcrumb, theme } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { ReactNode } from 'react'

interface Props {
  layout: 'cms' | 'client'
  children: ReactNode
  breadcrumb: BreadcrumbItemType[]
}

export default function Content({ children, breadcrumb, layout }: Props) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <>
      <Breadcrumb
        className="[&_.ant-breadcrumb-link]:font-bold breadcrumb-custom"
        style={{ margin: '16px 0' }}
        items={breadcrumb}
      />
      <div
        className="p-4"
        style={{
          minHeight: layout === 'cms' ? '100%' : 'calc(100vh - 187px)',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </div>
    </>
  )
}
