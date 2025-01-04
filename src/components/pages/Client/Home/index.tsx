'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HomeOutlined } from '@ant-design/icons'
import { Col, Empty, Flex, Pagination, Row, message } from 'antd'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import useModal from '~/hook/useModal'
import CreateRoom from './_component/CreateRoom'
import { getRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'
import useDebounce from '~/hook/useDebounce'
import RoomItem from './_component/RoomItem'

interface Room {
  created_by: {
    avatar: string | null
  }
  avatar: string | null
  username: string
  id: string
  time: number
  topics: string[]
  type: 'fighting' | 'examiner'
  current_player: number
  count_player: number
}

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const { isOpen, openModal, closeModal } = useModal()
  const [listRoom, setListRoom] = useState<Room[]>([])
  const [isRender, setIsRender] = useState(false)
  const [search, setSearch] = useState('')

  const useDb = useDebounce(search, 700)

  useEffect(() => {
    setLoading(true)
    getRequest(endpointBase.ROOM, {
      params: {
        search: search,
      },
    })
      .then((res: any) => {
        setListRoom(res || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [isRender, useDb])

  const handleClickRoom = (room: Room) => {
    if (room.count_player === room.current_player) {
      message.warning('Room is full')
      return
    }
    if (room.type === 'examiner') router.push(`/play-one-gk/${room.id}`)
    else router.push(`/play-one-one/${room.id}`)
  }

  return (
    <>
      <CreateRoom renderUI={() => setIsRender(!isRender)} open={isOpen} handelClose={closeModal} />
      <Content
        layout="client"
        breadcrumb={[
          {
            title: <HomeOutlined />,
          },
          {
            title: 'Home',
          },
        ]}
      >
        <Flex gap={12}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[400px]"
            placeholder="Search"
          />
          <Button type="primary" onClick={openModal}>
            Create
          </Button>
        </Flex>
        <Row gutter={[24, 24]} className="mt-4">
          {listRoom.map((item) => (
            <Col key={item.id} span={6} xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <div
                onClick={() => handleClickRoom(item)}
                className="cursor-pointer p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-100 duration-300"
              >
                <RoomItem
                  id={item.id}
                  count_player={item.count_player}
                  current_player={item.current_player}
                  time={item.time}
                  topics={item.topics}
                  type={item.type}
                  userAvatar={item.created_by.avatar}
                />
              </div>
            </Col>
          ))}
        </Row>
        {!loading ? (
          <Flex justify="center" className="mt-4">
            <Pagination total={1} defaultPageSize={1} responsive={false} />
          </Flex>
        ) : (
          <Empty />
        )}
      </Content>
    </>
  )
}
