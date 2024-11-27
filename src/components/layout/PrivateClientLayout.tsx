'use client'

import { Layout, Menu, MenuProps, Popover } from 'antd'
import { ReactNode } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { FaRegUser } from 'react-icons/fa'

const { Header, Content, Footer } = Layout

export default function PrivateClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const title = (
    <div onClick={() => router.push('/settings')} className="cursor-pointer">
      Setting
    </div>
  )

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
        <div
          onClick={() => router.push('/home')}
          className="cursor-pointer demo-logo-vertical h-8 px-3 mr-3 rounded-md bg-slate-600 text-white font-bold flex items-center justify-center"
        >
          Fast Guess
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname.replace('/', '')]}
          selectedKeys={[pathname.replace('/', '')]}
          items={[]}
          style={{ flex: 1, minWidth: 0 }}
          onClick={(info) => {
            router.push(`/${info.key}`)
          }}
        />
        <div className="border-[2px] rounded-3xl px-3 h-[45px] cursor-pointer">
          <Popover
            title={title}
            rootClassName="[&_.ant-popover-title]:!mb-0"
            trigger={['click']}
            placement="bottomRight"
          >
            <div className="flex items-center gap-1 h-[41px]">
              <p className="text-white">DoThanhNhan</p>
              <FaRegUser color="#fff" size="16px" />
            </div>
          </Popover>
        </div>
      </Header>
      <Content style={{ padding: '0 16px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        Nhan ©{new Date().getFullYear()} Created by TNhan
      </Footer>
    </Layout>
  )
}
