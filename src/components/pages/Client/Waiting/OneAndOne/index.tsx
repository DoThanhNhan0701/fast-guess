'use client'

import { useRouter } from 'next/navigation'
import { Col, Flex, Image, Row } from 'antd'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'

export default function WattingOneAndOne() {
  const router = useRouter()

  return (
    <Content
      layout="client"
      breadcrumb={[
        {
          title: <HomeOutlined />,
        },
        {
          title: 'Watting One and One',
        },
      ]}
    >
      <Flex justify="space-between">
        <p className="font-bold text-2xl">ID: 1111</p>
        <SettingOutlined className="text-2xl" />
      </Flex>

      <Row
        style={{
          minHeight: 'calc(100vh - 293px)',
        }}
        align={'middle'}
        className="justify-center"
      >
        <Col
          span={5}
          className="flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl"
        >
          <Image
            width={74}
            preview={false}
            className="rounded-xl"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl ">
            Player 1
          </p>
        </Col>

        <Col span={14} className="flex items-center justify-center">
          {/* Topic */}
          <FaLongArrowAltLeft className="text-3xl" />
          <div>-----------------------</div>
          <div
            className={`min-w-[320px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer text-center`}
          >
            <Image
              width={200}
              height={200}
              preview={false}
              className="rounded-xl object-cover"
              src="https://motherspet.com/blogs/wp-content/webp-express/webp-images/uploads/2024/07/100-wild-animals-870x490.jpg.webp"
            />
            <div className="py-[10px]">
              <p className="text-2xl font-extrabold">{`Animal`}</p>
              <p className="text-sm font-bold">300 Image</p>
            </div>
          </div>
          <div>-----------------------</div>
          <FaLongArrowAltRight className="text-3xl" />
          {/* End topic */}
        </Col>

        <Col
          span={5}
          className="flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl"
        >
          <Image
            width={74}
            height={74}
            preview={false}
            className="rounded-xl"
            src="https://cdn-icons-png.flaticon.com/512/5726/5726775.png"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
            Player 2
          </p>
        </Col>
      </Row>
      <div className="max-w-[700px] m-auto">
        <Flex className="gap-6">
          <Button
            onClick={() => router.push(`/play-one-one/${100}`)}
            className="w-full"
            type="default"
          >
            Play
          </Button>
          <Button onClick={() => router.push(`/home`)} className="w-full" type="primary">
            Quit
          </Button>
        </Flex>
      </div>
    </Content>
  )
}
