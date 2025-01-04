import { HomeOutlined } from '@ant-design/icons'
import { Col, Flex, Image, message, Popover, Row, Modal as ModalAnt } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { endpointBase } from '~/services/endpoint'
import { deleteRequest, getRequest, updateRequest } from '~/services/request'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal'
import useModal from '~/hook/useModal'

interface Detail {
  id: string
  name: string
  src: string
}

interface ListImage {
  image: string
  name: string
  id: string
}

export default function DetaiTopic() {
  const pathName = usePathname()
  const { isOpen, closeModal, openModal } = useModal()
  const [detail, setDetail] = useState<Detail>({
    id: '',
    name: '',
    src: '',
  })
  const router = useRouter()

  const [listImage, setListImage] = useState<ListImage[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    getRequest(`${endpointBase.QUESTION}`, {
      params: {
        topic: `${pathName?.split('/')[2]}`,
      },
    })
      .then((res: any) => {
        setListImage(res || [])
      })
      .catch(() => {})
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData()
      formData.append('name', detail.name)
      await updateRequest(
        `${endpointBase.QUESTION}${detail.id}/`,
        {
          data: formData,
        },
        true,
      )

      message.success('Image updated')
      fetchData()
      closeModal()
    } catch (error) {
      message.error('Update failed')
    }
  }

  const handleDelete = async (id: string) => {
    ModalAnt.confirm({
      title: 'Are you sure you want to delete this Image?',
      content: 'This action cannot be undo.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      onOk: () => {
        deleteRequest(`${endpointBase.QUESTION}${id}/`)
          .then(() => {
            message.success('Topic deleted successfully')
            fetchData()
          })
          .catch(() => {
            message.error('Failed to delete topic')
          })
      },
    })
  }

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={() => {
          setDetail({
            id: '',
            name: '',
            src: '',
          })
          closeModal()
        }}
        title="Update topic"
      >
        <Flex justify="center" vertical gap={24} align="center">
          <Image
            preview={false}
            src={detail.src}
            width={200}
            height={200}
            className="object-cover rounded-2xl"
            alt=""
          />
          <Input
            className="h-[40px]"
            onChange={(e) =>
              setDetail((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            value={detail.name}
            placeholder="Name"
          />
        </Flex>

        <Flex className="mt-6" gap={24}>
          <Button
            onClick={() => {
              setDetail({
                id: '',
                name: '',
                src: '',
              })
              closeModal()
            }}
            className="w-full"
            type="default"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} className="w-full" type="primary">
            Update
          </Button>
        </Flex>
      </Modal>

      <Content
        layout="client"
        breadcrumb={[
          {
            title: <HomeOutlined />,
            onClick: () => router.push('/home'),
          },
          {
            title: 'Setting',
          },
          {
            title: 'Detail topic',
          },
        ]}
      >
        <Row gutter={[24, 24]}>
          {listImage.map((ite, inx) => (
            <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={inx}>
              <div className="min-w-[230px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer flex items-center justify-center flex-col overflow-hidden">
                <Popover
                  rootClassName="[&_.ant-popover-inner]:!p-0 z-10"
                  content={
                    <div className="cursor-pointer">
                      <p
                        className="py-2 px-4 hover:bg-slate-50"
                        onClick={() => handleDelete(ite.id)}
                      >
                        Delete
                      </p>
                      <p
                        className="py-2 px-4 hover:bg-slate-50"
                        onClick={() => {
                          setDetail({
                            id: ite.id,
                            name: ite.name,
                            src: ite.image,
                          })
                          openModal()
                        }}
                      >
                        Update
                      </p>
                    </div>
                  }
                  trigger="click"
                  placement="bottom"
                >
                  <BsThreeDotsVertical className="absolute top-1 right-1 text-xl" />
                </Popover>

                <Image
                  width={150}
                  height={150}
                  preview={false}
                  className="rounded-xl object-cover"
                  src={ite.image}
                />
                <div className="flex justify-between max-w-[400px] m-auto mt-6">
                  <p className="text-2xl font-bold whitespace-nowrap">{ite.name}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Content>
    </>
  )
}
