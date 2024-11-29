'use client'

import { useRouter } from 'next/navigation'
import { Col, Flex, Image, Row } from 'antd'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'

export default function PlayOneGk() {
  const router = useRouter()

  return (
    <Content
      layout="client"
      breadcrumb={[
        {
          title: <HomeOutlined />,
        },
        {
          title: 'Play One One and Gk',
        },
      ]}
    >
      <Flex justify="space-between">
        <p className="font-bold text-2xl">ID: 1111</p>
        <SettingOutlined className="text-2xl" />
      </Flex>
      <h1 className="text-4xl font-bold py-2 text-center">Fast Guess</h1>

      <Row align={'middle'} className="justify-center mb-10">
        <Col
          span={5}
          className="flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl"
        >
          <Image
            width={74}
            height={74}
            preview={false}
            className="rounded-xl"
            src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl ">
            LinhNG
          </p>
        </Col>

        <Col span={14} className="flex items-center justify-center">
          {/* Topic */}
          <FaLongArrowAltLeft className="text-3xl text-[#15683b]" />
          <div className="font-extrabold text-[#15683b]">-----------------------</div>
          <div
            className={`min-w-[320px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer text-center`}
          >
            <Image
              width={200}
              height={200}
              preview={false}
              className="rounded-xl object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZMDUl-SlCg0yapqjzf_EKtfkuC4CJkgpnJg&s"
            />
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
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDso3YjdjeD_8tA6vVacoI3ogd6YqF-VfyGiylBV2v6-zitJretXOtsLvJ5UZDrlNs7nc&usqp=CAU"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
            NhanDT
          </p>
        </Col>
      </Row>

      <Row align={'middle'} gutter={36} className="justify-center max-w-[80%] !m-auto">
        <Col span={5} className="flex items-center justify-center flex-col gap-2 ">
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">45</p>
        </Col>
        <Col span={14} className="flex items-center justify-center">
          <FaLongArrowAltLeft className="text-3xl text-[#15683b]" />
          <div>--</div>
          <Input
            value={'Con chuột'}
            className="h-[100px] border-[2px] border-[#000] text-6xl font-extrabold leading-[60px] text-center"
          />
          <div>--</div>
          <FaLongArrowAltRight className="text-3xl" />
        </Col>
        <Col span={5} className="flex items-center justify-center flex-col gap-2 ">
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">60</p>
        </Col>
      </Row>
      {/* --- */}
      {/* <div className="max-w-[40%] !m-auto">
        <Input className="h-[100px] border-[2px] border-[#000] text-6xl font-extrabold leading-[60px] text-center mt-6" />
      </div> */}
      {/* --- */}
      <div className="max-w-[40%] m-auto">
        <Flex className="gap-6 mt-10">
          <Button className="w-full" type="primary">
            Right
          </Button>
          <Button className="w-full" type="default">
            Wrong
          </Button>
        </Flex>
        <Button
          onClick={() => router.push('/play-one-gk/4/result')}
          className="w-full mt-6"
          type="primary"
        >
          Next
        </Button>
      </div>
    </Content>
  )
}
