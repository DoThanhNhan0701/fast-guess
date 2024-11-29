'use client'

import Image from 'next/image'
import { Layout, Menu, MenuProps, Popover } from 'antd'
import { ReactNode } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { FaRegUser } from 'react-icons/fa'
import { FaRankingStar } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { actionLogout } from '~/store/slice/auth'

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

const items: MenuItem[] = [getItem('Ranking', 'ranking', <FaRankingStar />)]

export default function PrivateClientLayout({ children }: { children: ReactNode }) {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    dispatch(actionLogout())
    router.replace('/auth')
  }

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
          className="m-4 h-8 rounded-md font-bold flex items-center justify-center"
        >
          <Image src={'/images/logo.svg'} width={100} height={30} alt="" />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname.replace('/', '')]}
          selectedKeys={[pathname.replace('/', '')]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={(info) => {
            router.push(`/${info.key}`)
          }}
        />
        <div className="border-[2px] rounded-3xl px-3 h-[45px] cursor-pointer">
          <Popover
            title={
              <div>
                <div
                  onClick={() => router.push('/settings')}
                  className="cursor-pointer py-2 hover:bg-slate-100 px-1"
                >
                  Setting
                </div>
                <div onClick={handleLogout} className="cursor-pointer py-2 hover:bg-slate-100 px-1">
                  Logout
                </div>
              </div>
            }
            rootClassName="[&_.ant-popover-title]:!mb-0"
            trigger={['click']}
            placement="bottomRight"
          >
            <div className="flex items-center gap-1 h-[41px]">
              <p className="text-white">{userInfo?.email}</p>
              <FaRegUser color="#fff" size="16px" />
            </div>
          </Popover>
        </div>
      </Header>
      <Content style={{ padding: '0 16px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        Fast guess ©{new Date().getFullYear()} Created by LinhNG
      </Footer>
    </Layout>
  )
}
