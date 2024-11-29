'use client'

import { HomeOutlined } from '@ant-design/icons'
import { Flex, Image, message, Popconfirm } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { endpointBase } from '~/services/endpoint'
import { deleteRequest, getRequest } from '~/services/request'
import { RootState } from '~/store'

import CreateTopic from './_component/CreateTopic'
import Content from '~/components/common/Content'
import useModal from '~/hook/useModal'

export interface Topic {
  id: string
  name: string
  banner: string
  count_image: number
}

export default function SettingPage() {
  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [listTopic, setListTopic] = useState<Topic[]>([])
  const { isOpen, closeModal, openModal } = useModal()
  const [isRender, setIsRender] = useState(false)

  useEffect(() => {
    getRequest(endpointBase.TOPIC, {
      params: {
        category: 'user',
      },
    })
      .then((res: any) => {
        setListTopic(res || [])
      })
      .catch(() => {})
  }, [isRender])

  const confirm = (id: string) => {
    deleteRequest(`${endpointBase.TOPIC}${id}/`)
      .then(() => {
        message.success('Delete success')
        setIsRender(!isRender)
      })
      .catch(() => {})
  }

  return (
    <>
      <CreateTopic render={() => setIsRender(!isRender)} isOpen={isOpen} onCancel={closeModal} />
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
            <p className="font-bold text-base">{`ID: ${userInfo?.id}`}</p>
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
            <p className="font-bold text-base">{`Username: ${userInfo?.username}`}</p>
            <p className="font-bold text-base">{`Email:  ${userInfo?.email}`}</p>
            <p className="font-bold text-base">Language: English</p>
          </div>
        </div>
        <h1 className="text-center py-6 text-2xl font-bold">Personal Topic</h1>
        <div className="flex gap-4 w-full overflow-x-auto">
          {listTopic.map((item, inx) => (
            <React.Fragment key={inx}>
              <div
                onClick={() => router.push(`/settings/${item.id}`)}
                className="relative cursor-pointer p-6 border-[2px] border-[rgb(96,_11,_118)] rounded-2xl min-w-[300px]"
              >
                <Popconfirm
                  title="Delete the topic"
                  description="Are you sure to delete this topic?"
                  onConfirm={(e) => {
                    e?.stopPropagation()
                    confirm(item.id)
                  }}
                  okText="Yes"
                  placement="rightBottom"
                  cancelText="No"
                >
                  <FaRegTrashAlt
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 right-1 text-xl"
                  />
                </Popconfirm>
                <div className="flex justify-center">
                  <Image
                    className="rounded-full object-cover border"
                    preview={false}
                    width={100}
                    height={100}
                    src={item.banner}
                  />
                </div>
                <div className="flex justify-center mt-4 flex-col items-center">
                  <p className="font-bold text-base">{`${item.name}`}</p>
                  <p className="font-bold text-base">{`${item.count_image} Images`}</p>
                </div>
              </div>
              {listTopic.length - 1 === inx ? (
                <div
                  key="create-topic"
                  onClick={openModal}
                  className="cursor-pointer p-6 border-[2px] border-[rgb(96,_11,_118)] rounded-2xl min-w-[300px] flex items-center justify-center"
                >
                  <FaPlus className="text-6xl" />
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
        {listTopic.length === 0 ? (
          <div
            key="create-topic"
            onClick={openModal}
            className="cursor-pointer p-6 border-[2px] border-[rgb(96,_11,_118)] rounded-2xl min-w-[300px] flex items-center justify-center"
          >
            <FaPlus className="text-6xl" />
          </div>
        ) : null}
      </Content>
    </>
  )
}
