'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HomeOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Empty, Flex, Image, Pagination, Row } from 'antd'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import useModal from '~/hook/useModal'
import CreateRoom from './_component/CreateRoom'
import { getRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'
import useDebounce from '~/hook/useDebounce'

interface Room {
  created_by: string
  avatar: string | null
  username: string
  id: string
  time: number
  topics: string[]
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
          {listRoom.map((item, index) => (
            <Col key={index} span={6} xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <div
                onClick={() => router.push(`/play-one-one/${item.id}`)}
                className="cursor-pointer p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-100 duration-300"
              >
                <Card className="border-none rounded-lg" loading={loading}>
                  <Card.Meta
                    avatar={
                      <Avatar src="https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg" />
                    }
                    title={`ID Room: ${item.id}`}
                    className="[&_.ant-image-mask]:rounded-xl"
                    description={
                      <>
                        <Image
                          preview={false}
                          className="rounded-xl object-cover"
                          width={150}
                          height={150}
                          src={
                            'https://motherspet.com/blogs/wp-content/webp-express/webp-images/uploads/2024/07/100-wild-animals-870x490.jpg.webp'
                          }
                        />
                        <Row>
                          <Col span={12}>
                            <p className="text-base font-bold text-slate-800">{`Topic: ${
                              item.topics.length ?? 0
                            }`}</p>
                          </Col>
                          <Col span={12}>
                            <p className="text-base font-bold text-slate-800">{`Time: ${
                              item?.time ? item.time : 0
                            } s`}</p>
                          </Col>
                        </Row>
                      </>
                    }
                  />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
        {!loading && listRoom.length ? (
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
