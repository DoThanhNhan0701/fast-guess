'use client'

import { useEffect, useState } from 'react'
import { Avatar, Card, Col, Flex, Image, Pagination, Row } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import { useRouter } from 'next/navigation'

const dataTopic = [
  {
    name: 'Animal',
    image:
      'https://motherspet.com/blogs/wp-content/webp-express/webp-images/uploads/2024/07/100-wild-animals-870x490.jpg.webp',
  },
  {
    name: 'Fruit',
    image:
      'https://www.ninosalvaggio.com/wp-content/uploads/2023/07/Ninos_What-Makes-A-Fruit-A-Fruit-1024x683.jpg',
  },
  {
    name: 'Bird',
    image:
      'https://i0.wp.com/echoofwings.com/wp-content/uploads/2024/06/most-colorful-birds.jpg?w=615&ssl=1',
  },
  {
    name: 'Jobs',
    image:
      'https://tailieutienganh.edu.vn/public/files/upload/default/images/phu-am-danh-tu-dem-duoc-so-it-so-nhieu-khong-dem-duoc-tu-vung-nghe-nghiep-jobs-3.jpg',
  },
  {
    name: 'Club Football',
    image: 'https://img.jagranjosh.com/images/2024/February/622024/World-Most-Valuable-Club.webp',
  },
  {
    name: 'Sports',
    image:
      'https://cdn.thuvienphapluat.vn//uploads/Hoidapphapluat/2023/PHCM/Thang01/17-1/the-duc-the-thao.jpg',
  },
  {
    name: 'Influencer',
    image: 'https://thegioimarketing.vn/wp-content/uploads/2023/01/influencers-la-gi.png',
  },
  {
    name: 'Country',
    image:
      'https://img.freepik.com/free-vector/flags-different-countries-speech-bubble-shape_23-2147862139.jpg?semt=ais_hybrid',
  },
]

export default function Topic() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
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
        {dataTopic.map((item, index) => (
          <Col
            onClick={() => router.push(`/topics/${index}`)}
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
              className="[&_.anticon]:justify-center [&_.ant-card-bordered]:!border-[1px] [&_.ant-card-bordered]:!border-[#000]"
              loading={loading}
              actions={actions}
            >
              <Card.Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                description={
                  <>
                    <Image
                      preview={false}
                      className="rounded-xl object-cover"
                      width={150}
                      height={150}
                      src={item.image}
                    />
                    <Row>
                      <Col span={12}>
                        <p className="text-base font-bold text-black py-2">{`Topic: ${item.name}`}</p>
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
        <Pagination total={1} defaultPageSize={1} responsive={false} />
      </Flex>
    </Content>
  )
}
