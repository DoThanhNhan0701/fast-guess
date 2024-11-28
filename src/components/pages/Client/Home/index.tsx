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

const dataRoom = [
  {
    player: 1,
    time: '120',
    mode: '1 VS 1',
    image:
      'https://motherspet.com/blogs/wp-content/webp-express/webp-images/uploads/2024/07/100-wild-animals-870x490.jpg.webp',
  },
  {
    player: 2,
    time: '120',
    mode: 'GK',
    image:
      'https://www.ninosalvaggio.com/wp-content/uploads/2023/07/Ninos_What-Makes-A-Fruit-A-Fruit-1024x683.jpg',
  },
  {
    player: 2,
    time: '120',
    mode: '1 VS 1',
    image:
      'https://i0.wp.com/echoofwings.com/wp-content/uploads/2024/06/most-colorful-birds.jpg?w=615&ssl=1',
  },
  {
    player: 1,
    time: '120',
    mode: 'GK',
    image:
      'https://tailieutienganh.edu.vn/public/files/upload/default/images/phu-am-danh-tu-dem-duoc-so-it-so-nhieu-khong-dem-duoc-tu-vung-nghe-nghiep-jobs-3.jpg',
  },
  {
    player: 1,
    time: '120',
    mode: 'GK',
    image: 'https://img.jagranjosh.com/images/2024/February/622024/World-Most-Valuable-Club.webp',
  },
  {
    player: 2,
    time: '120',
    mode: '1 VS 1',
    image:
      'https://cdn.thuvienphapluat.vn//uploads/Hoidapphapluat/2023/PHCM/Thang01/17-1/the-duc-the-thao.jpg',
  },
]

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
          {dataRoom.map((item, index) => (
            <Col key={index} span={6} xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <div
                onClick={() =>
                  router.push(
                    `${
                      item.mode === '1 VS 1' ? `/play-one-one/${index}` : `/play-one-gk/${index}`
                    }`,
                  )
                }
                className="cursor-pointer p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-100 duration-300"
              >
                <Card className="border-none rounded-lg" loading={loading}>
                  <Card.Meta
                    avatar={
                      <Avatar src="https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg" />
                    }
                    title={`ID Room: 100${index}`}
                    className="[&_.ant-image-mask]:rounded-xl"
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
                            <p className="text-base font-bold text-slate-800">{`Topic: ${index}`}</p>
                          </Col>
                          <Col span={12}>
                            <p className="text-base font-bold text-slate-800">{`Time: ${item.time} s`}</p>
                          </Col>
                          <Col span={12}>
                            <p className="text-base font-bold text-slate-800">{`Mode: ${item.mode}`}</p>
                          </Col>
                          <Col span={12}>
                            <p className="text-base font-bold text-slate-800">{`Player: ${item.player}`}</p>
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
