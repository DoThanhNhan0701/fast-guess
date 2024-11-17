'use client'

import { PieChartOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu, MenuProps } from 'antd'
import { ReactNode } from 'react'

import { usePathname, useRouter } from 'next/navigation'

const { Header, Content, Footer } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Topics', 'topics', <PieChartOutlined />),
  getItem('Settings', 'settings', <SettingOutlined />),
]

export default function PrivateClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Layout className="min-h-[100vh]">
      <Header
        style={{
          top: 0,
          zIndex: 1,
          display: 'flex',
          position: 'sticky',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <div className="demo-logo-vertical h-8 px-3 mr-3 rounded-md bg-slate-600 text-white font-bold flex items-center justify-center">
          Fast Guess
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname.replace('/', '')]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={(info) => {
            router.push(`/${info.key}`)
          }}
        />
      </Header>
      <Content style={{ padding: '0 16px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        Nhan ©{new Date().getFullYear()} Created by TNhan
      </Footer>
    </Layout>
  )
}
