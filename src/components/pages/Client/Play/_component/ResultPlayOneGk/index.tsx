'use client'

import { useRouter } from 'next/navigation'
import { Flex, Image } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'

export default function ResultPlayOneGk() {
  const router = useRouter()

  return (
    <Content
      layout="client"
      breadcrumb={[
        {
          title: <HomeOutlined />,
        },
        {
          title: 'Result Gk',
        },
      ]}
    >
      <div className="max-w-[700px] m-auto border-[#000] border-[2px] p-6 rounded-3xl">
        <div className="text-center font-bold text-2xl flex items-center justify-evenly">
          <p>YOU WIN</p>
          <div className="py-2 px-4 border rounded-3xl">+ 20elo</div>
        </div>
        <div className="flex items-center justify-center border-[2px] border-[#dddd] flex-col p-6 rounded-2xl mt-6">
          <p>NEXT TOPIC</p>
          <Image
            preview={false}
            className="object-cover"
            src="https://img.freepik.com/free-vector/flags-different-countries-speech-bubble-shape_23-2147862139.jpg?semt=ais_hybrid"
            width={200}
            height={200}
            alt=""
          />

          <p className="font-bold text-2xl py-2">300 Image</p>
          <p className="font-bold text-2xl ">Animal</p>
        </div>
        <Flex justify="space-between" className="mt-6">
          <Button type="default" className="w-[120px]">
            Ready (1/2)
          </Button>
          <Button type="default" className="w-[120px]">
            Play
          </Button>
        </Flex>
      </div>
      <Flex justify="end" className="max-w-[700px] m-auto mt-6">
        <Button onClick={() => router.push('/home')} type="primary" className="w-[150px]">
          Quit
        </Button>
      </Flex>
    </Content>
  )
}
