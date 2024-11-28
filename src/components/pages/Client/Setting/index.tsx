'use client'

import { HomeOutlined } from '@ant-design/icons'
import { Flex, Image } from 'antd'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import Content from '~/components/common/Content'
import useModal from '~/hook/useModal'
import CreateTopic from './_component/CreateTopic'
import React from 'react'
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

export default function SettingPage() {
  const router = useRouter()
  const { isOpen, closeModal, openModal } = useModal()

  return (
    <>
      <CreateTopic isOpen={isOpen} onCancel={closeModal} />
      <Content
        layout="client"
        breadcrumb={[
          {
            onClick: openModal,
            title: <HomeOutlined />,
          },
          {
            title: 'Setting',
          },
        ]}
      >
        <div className="max-w-[500px] m-auto p-6 border-[2px] border-[rgb(96,_11,_118)] rounded-2xl">
          <Flex justify="space-between">
            <p className="font-bold text-base">ID: 19219999</p>
            <p className="font-bold text-base">Elo: 1000</p>
          </Flex>
          <h4 className="py-4 font-extrabold text-2xl text-center uppercase">Setting User</h4>
          <div className="flex justify-center w-full">
            <Image
              className="rounded-full border"
              preview={false}
              width={100}
              src="https://cdn.vectorstock.com/i/1000x1000/44/01/default-avatar-photo-placeholder-icon-grey-vector-38594401.webp"
            />
          </div>
          <div>
            <p className="font-bold text-base">Username: NguyenHoangLinh</p>
            <p className="font-bold text-base">Email: linh_2051220165@dau.edu.vn</p>
            <p className="font-bold text-base">Language: English</p>
          </div>
        </div>
        <h1 className="text-center py-6 text-2xl font-bold">Personal Topic</h1>
        <div className="flex gap-4 w-full overflow-x-auto">
          {dataTopic.map((item, inx) => (
            <React.Fragment key={inx}>
              <div
                onClick={() => router.push(`/settings/${inx}`)}
                className="relative cursor-pointer p-6 border-[2px] border-[rgb(96,_11,_118)] rounded-2xl min-w-[300px]"
              >
                <FaRegTrashAlt
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 text-xl"
                />
                <div className="flex justify-center">
                  <Image
                    className="rounded-full object-cover border"
                    preview={false}
                    width={100}
                    height={100}
                    src={item.image}
                  />
                </div>
                <div className="flex justify-center mt-4 flex-col items-center">
                  <p className="font-bold text-base">{`${item.name}`}</p>
                  <p className="font-bold text-base">300 Image</p>
                </div>
              </div>

              {inx === 7 && (
                <div
                  key="create-topic"
                  onClick={openModal}
                  className="cursor-pointer p-6 border-[2px] border-[rgb(96,_11,_118)] rounded-2xl min-w-[300px] flex items-center justify-center"
                >
                  <FaPlus className="text-6xl" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Content>
    </>
  )
}
