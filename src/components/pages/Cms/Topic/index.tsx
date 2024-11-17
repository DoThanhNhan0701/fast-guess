'use client'

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Flex, Image, Pagination, Row } from 'antd'
import { useEffect, useState } from 'react'
import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'

export default function Topic() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const actions: React.ReactNode[] = [
    <EditOutlined key="edit" />,
    <SettingOutlined key="setting" />,
    <EllipsisOutlined key="ellipsis" />,
  ]

  return (
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
          <Button type="primary">Import</Button>
        </Flex>
        <Button>Create</Button>
      </Flex>
      <Row gutter={[24, 24]} className="mt-4">
        {[0, 1, 2, 3, 4, 5, 6, 9].map((item, index) => (
          <Col key={index} span={6} xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
            <Card
              color="#f00"
              className="[&_.anticon]:justify-center [&_.ant-card-bordered]:!border-[1px] [&_.ant-card-bordered]:!border-[#000]"
              loading={loading}
              actions={actions}
            >
              <Card.Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                title={`ID Room: 100${item}`}
                description={
                  <>
                    <Image
                      preview={false}
                      className="rounded-xl"
                      width={150}
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
          </Col>
        ))}
      </Row>
      <Flex justify="center" className="mt-4">
        <Pagination total={20} defaultPageSize={1} responsive={false} />
      </Flex>
    </Content>
  )
}
