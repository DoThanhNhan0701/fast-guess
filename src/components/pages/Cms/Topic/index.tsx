'use client'

import { useEffect, useState } from 'react'
import { Avatar, Card, Col, Flex, Image, Pagination, Row } from 'antd'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import { useRouter } from 'next/navigation'
import { getRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'
import CreateTopic from '../../Client/Setting/_component/CreateTopic'
import useModal from '~/hook/useModal'

interface TopicCms {
  id: string
  name: string
  banner: string
  count_image: number
}

export default function Topic() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [listTopic, setListTopic] = useState<TopicCms[]>([])
  const [isRender, setIsRender] = useState(false)
  const { isOpen, closeModal, openModal } = useModal()

  useEffect(() => {
    setLoading(true)
    getRequest(endpointBase.TOPIC, {
      params: {
        category: 'system',
      },
    })
      .then((res: any) => {
        setListTopic(res || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [isRender])

  return (
    <>
      <CreateTopic render={() => setIsRender(!isRender)} isOpen={isOpen} onCancel={closeModal} />
      <Content
        layout="cms"
        breadcrumb={[
          {
            title: 'Home',
          },
          {
            title: 'Topics',
            href: '/topics',
          },
        ]}
      >
        <Flex justify="space-between">
          <Flex gap={12}>
            <Input className="max-w-[350px]" placeholder="Search" />
            <Button type="primary" onClick={openModal}>
              Import
            </Button>
          </Flex>
          <Button>Create</Button>
        </Flex>
        <Row gutter={[24, 24]} className="mt-4">
          {listTopic.map((item, index) => (
            <Col
              className="cursor-pointer"
              onClick={() => router.push(`/topics/${item.id}`)}
              key={index}
              span={6}
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={8}
              xxl={6}
            >
              <Card
                color="#f00"
                className="[&_.anticon]:justify-center border-[2px] border-[#000]"
                loading={loading}
              >
                <Card.Meta
                  avatar={
                    <Image
                      width={50}
                      height={50}
                      className="border rounded-full"
                      src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    />
                  }
                  description={
                    <>
                      <Image
                        preview={false}
                        className="rounded-xl object-cover border-[3px]"
                        width={150}
                        height={150}
                        src={item.banner}
                      />
                      <p className="text-base font-bold text-black py-2 w-full">{`${item.name}`}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Flex justify="center" className="mt-4">
          <Pagination total={1} defaultPageSize={1} responsive={false} />
        </Flex>
      </Content>
    </>
  )
}
