'use client'

import { HomeOutlined } from '@ant-design/icons'
import { Flex, Image, Modal } from 'antd'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import Content from '~/components/common/Content'
import useModal from '~/hook/useModal'
import CreateTopic from './_component/CreateTopic'
import React from 'react'
import { useRouter } from 'next/navigation'

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
              className="rounded-full "
              preview={false}
              width={100}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </div>
          <div>
            <p className="font-bold text-base">Name: ---</p>
            <p className="font-bold text-base">Sound: ---</p>
            <p className="font-bold text-base">Language: ---</p>
            <p className="font-bold text-base">Voice: ---</p>
          </div>
        </div>
        <h1 className="text-center py-6 text-2xl font-bold">Personal Topic</h1>
        <div className="flex gap-4 w-full overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, inx) => (
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
                    className="rounded-full"
                    preview={false}
                    width={100}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                </div>
                <div className="flex justify-center mt-4 flex-col items-center">
                  <p className="font-bold text-base">{`Fruit: ${item}`}</p>
                  <p className="font-bold text-base">300 Image</p>
                </div>
              </div>

              {inx === 9 && (
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
