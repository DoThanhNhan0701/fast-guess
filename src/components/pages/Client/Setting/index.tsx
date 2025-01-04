'use client'

import { HomeOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Image, message, Popconfirm, Tooltip, Upload } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { endpointBase } from '~/services/endpoint'
import { deleteRequest, getRequest, postRequest } from '~/services/request'
import { RootState } from '~/store'

import CreateTopic from './_component/CreateTopic'
import Content from '~/components/common/Content'
import useModal from '~/hook/useModal'
import { actionUpdatePartial } from '~/store/slice/auth'
import { MdMusicNote, MdMusicOff } from 'react-icons/md'
import { actionChangeMute } from '~/store/slice/app'
import { API_SERVER } from '~/settings/constants'

export interface Topic {
  id: string
  name: string
  banner: string
  count_image: number
}

// export const baseUrl = `https://be.onechamp.id.vn`

export default function SettingPage() {
  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { mute } = useSelector((state: RootState) => state.app)
  const dispatch = useDispatch()
  const [listTopic, setListTopic] = useState<Topic[]>([])
  const { isOpen, closeModal, openModal } = useModal()
  const [isRender, setIsRender] = useState(false)
  const [avatar, setAvatar] = useState<string>(userInfo?.avatar ?? '/images/avatar-default.png')

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

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response: any = await postRequest(
        endpointBase.UPLOAD_AVATAR,
        {
          data: formData,
        },
        true,
      )
      if (response) {
        setAvatar(`${API_SERVER}/${response.data.avatar}`)
        dispatch(
          actionUpdatePartial({
            avatar: `${API_SERVER}/${response.data.avatar}`,
          }),
        )
      }
      message.success('Avatar updated successfully!')
    } catch (error) {
      message.error('Failed to upload avatar')
    }
  }

  const uploadProps = {
    beforeUpload: (file: File) => {
      handleUpload(file)
      return false // Prevent auto-upload
    },
    showUploadList: false,
  }

  return (
    <>
      <CreateTopic render={() => setIsRender(!isRender)} isOpen={isOpen} onCancel={closeModal} />
      <Content
        layout="client"
        breadcrumb={[
          {
            onClick: () => router.push('/home'),
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
            <p className="font-bold text-base">{`Elo: ${userInfo?.score}`}</p>
          </Flex>
          <h4 className="py-4 font-extrabold text-2xl text-center uppercase">Setting User</h4>
          <div className="flex justify-center w-full flex-col items-center">
            {/* Upload avatar */}
            <Image
              className="rounded-full border"
              preview={false}
              width={100}
              height={100}
              src={avatar}
              alt=""
              key="avatar"
            />
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} type="primary" className="mt-4">
                Upload Avatar
              </Button>
            </Upload>
          </div>
          <div>
            <p className="font-bold text-base">{`Username: ${userInfo?.username}`}</p>
            <p className="font-bold text-base">{`Email:  ${userInfo?.email}`}</p>
            <p className="font-bold text-base">Language: English</p>
            <Flex className="mt-3" justify="end" gap={8}>
              <Tooltip title="Sound">
                <Button
                  icon={mute ? <MdMusicOff /> : <MdMusicNote />}
                  className="text-xl"
                  size="large"
                  type="primary"
                  onClick={() => dispatch(actionChangeMute(!mute))}
                ></Button>
              </Tooltip>
            </Flex>
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
