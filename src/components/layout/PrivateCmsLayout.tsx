'use client'

import { PieChartOutlined, UserOutlined } from '@ant-design/icons'
import { Flex, Layout, Menu, MenuProps, Popover, theme } from 'antd'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { FaRegUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { actionLogout } from '~/store/slice/auth'

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
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()

  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleLogout = () => {
    dispatch(actionLogout())
    router.replace('/auth')
  }

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
            <div className="border-[2px] rounded-3xl px-3 h-[45px] cursor-pointer">
              <Popover
                title={
                  <div>
                    <div
                      onClick={handleLogout}
                      className="cursor-pointer py-2 hover:bg-slate-100 px-1 t!ext-black"
                    >
                      Logout
                    </div>
                  </div>
                }
                rootClassName="[&_.ant-popover-title]:!mb-0"
                trigger={['click']}
                placement="bottomRight"
              >
                <div className="flex items-center gap-1 h-[41px]">
                  <p className="text-black">{userInfo?.email}</p>
                  <FaRegUser color="#000" size="16px" />
                </div>
              </Popover>
            </div>
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
