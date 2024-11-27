'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HomeOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Flex, Image, Pagination, Row } from 'antd'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import useModal from '~/hook/useModal'
import CreateRoom from './_component/CreateRoom'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const { isOpen, openModal, closeModal } = useModal()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [])

  return (
    <>
      <CreateRoom open={isOpen} handelClose={closeModal} />
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
          <Input className="max-w-[400px]" placeholder="Search" />
          <Button type="primary" onClick={openModal}>
            Create
          </Button>
        </Flex>
        <Row gutter={[24, 24]} className="mt-4">
          {[0, 1, 2, 3, 4, 5, 6, 9].map((item, index) => (
            <Col key={index} span={6} xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <div
                onClick={() => router.push(`/play-one-one/${index}`)}
                className="cursor-pointer p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-100 duration-300"
              >
                <Card className="border-none rounded-lg" loading={loading}>
                  <Card.Meta
                    avatar={
                      <Avatar src="https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg" />
                    }
                    title={`ID Room: 100${item}`}
                    className="[&_.ant-image-mask]:rounded-xl"
                    description={
                      <>
                        <Image
                          preview={true}
                          className="rounded-xl object-cover"
                          width={150}
                          height={150}
                          src="https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg"
                        />
                        <Row>
                          <Col span={12}>
                            <p>{`Topic: ${item}`}</p>
                          </Col>
                          <Col span={12}>
                            <p>{`Time: ${item}`}</p>
                          </Col>
                          <Col span={12}>
                            <p>{`Mode: ${item}`}</p>
                          </Col>
                          <Col span={12}>
                            <p>{`Player: ${item}`}</p>
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
        {!loading && (
          <Flex justify="center" className="mt-4">
            <Pagination total={1} defaultPageSize={1} responsive={false} />
          </Flex>
        )}
      </Content>
    </>
  )
}
