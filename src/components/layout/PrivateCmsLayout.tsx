'use client'

import { PieChartOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Flex, Layout, Menu, MenuProps, theme } from 'antd'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

const { Header, Content, Footer, Sider } = Layout

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
  getItem('Users', 'users', <UserOutlined />),
]

export default function PrivateCmsLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className="sticky top-0"
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="m-4 h-8 rounded-md font-bold flex items-center justify-center">
          <Image src={'/images/logo.svg'} width={200} height={60} alt="" />
        </div>
        <Menu
          theme="dark"
          className="sticky top-0"
          defaultSelectedKeys={[pathname.replace('/', '')]}
          selectedKeys={[pathname.replace('/', '')]}
          mode="inline"
          items={items}
          onClick={(info) => {
            router.push(`/${info.key}`)
          }}
        />
      </Sider>
      <Layout>
        <Header
          className="sticky top-0 z-30"
          style={{ padding: '10px 20px', background: colorBgContainer }}
        >
          <Flex justify="end">
            <Avatar
              style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
              size="large"
              gap={4}
            >
              NguyenHoangLinh
            </Avatar>
          </Flex>
        </Header>
        <Content style={{ margin: '0 16px' }}>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Fast guess ©{new Date().getFullYear()} Created by LinhNG
        </Footer>
      </Layout>
    </Layout>
  )
}
