'use client'

import { usePathname, useRouter } from 'next/navigation'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Card, Col, Image, Row } from 'antd'

import Content from '~/components/common/Content'
import { getRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'

const dataDetailTopic = [
  {
    name: 'Nho đen',
    image: 'https://www.biggreen.com.vn/data/product/nho-ha-den-khong-hat.jpg',
  },
  {
    name: 'Dâu tây',
    image: 'https://www.biggreen.com.vn/data/product/D%C3%A2u%20t%C3%A2y%20Nh%E1%BA%ADt%20n.jpg',
  },
  {
    name: 'Xoài',
    image: 'https://www.biggreen.com.vn/data/product/xo%C3%A0i%20t%E1%BB%A9%20qu%C3%BD%20xtq.jpg',
  },
  {
    name: 'Chuối',
    image: 'https://www.biggreen.com.vn/data/product/chu%E1%BB%91i%20labaking%20.jpg',
  },
  {
    name: 'Quýt',
    image: 'https://www.biggreen.com.vn/data/product/Qu%C3%BDt%20b%C3%ACnh%20li%C3%AAu%201.jpg',
  },
  {
    name: 'Bơ',
    image:
      'https://www.biggreen.com.vn/data/product/b%C6%A1%20booth%20%C4%91%E1%BA%B7c%20bi%E1%BB%87t.jpg',
  },
  {
    name: 'Chôm chôm',
    image: 'https://www.biggreen.com.vn/data/product/ch%C3%B4m%20ch%C3%B4m%20bay.jpg',
  },
  {
    name: 'Na',
    image: 'https://www.biggreen.com.vn/data/product/nana.jpg',
  },
  {
    name: 'Dưa hấu',
    image:
      'https://www.biggreen.com.vn/data/product/d%C6%B0a%20h%E1%BA%A5u%20baby%20%C4%91%E1%BA%B9p.jpg',
  },
  {
    name: 'Cam',
    image:
      'https://www.biggreen.com.vn/data/product/Cam%20khe%20m%C3%A2y%20h%C3%A0%20t%C4%A9nh.jpg',
  },
  {
    name: 'Thanh long',
    image: 'https://www.biggreen.com.vn/data/product/thanh-long-vang-ruot-trang.jpg',
  },
  {
    name: 'Bưởi',
    image:
      'https://www.biggreen.com.vn/data/product/B%C6%B0%E1%BB%9Fi%20da%20xanh%20Tuy%C3%AAn%20Quang.jpg',
  },
]

interface ListImage {
  image: string
  name: string
}

export default function DetailTopic() {
  const router = useRouter()
  const pathName = usePathname()
  const [loading, setLoading] = useState<boolean>(true)

  const [listImage, setListImage] = useState<ListImage[]>([])

  useEffect(() => {
    setLoading(true)
    getRequest(`${endpointBase.QUESTION}`, {
      params: {
        topic: `${pathName?.split('/')[2]}`,
      },
    })
      .then((res: any) => {
        setListImage(res || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <Content
      layout="cms"
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Detail Topic',
        },
      ]}
    >
      <Row gutter={[24, 24]} className="mt-4">
        {listImage.map((item, index) => (
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
              className="[&_.anticon]:justify-center !border-[1px] !border-[#000]"
              loading={loading}
            >
              <Card.Meta
                description={
                  <>
                    <Image
                      preview={false}
                      className="rounded-xl object-cover"
                      width={150}
                      height={150}
                      src={item.image}
                    />
                    <p className="text-base font-bold text-black py-2">{`${item.name}`}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  )
}
