'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Card, Col, Dropdown, Form, Image, message, Modal, Row, Spin } from 'antd'

import { deleteRequest, getRequest, updateRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'

import Content from '~/components/common/Content'
import { BsThreeDots } from 'react-icons/bs'
import Input from '~/components/common/Input'

interface ListImage {
  image: string
  name: string
  id: string
}

export default function DetailTopic() {
  const [form] = Form.useForm()
  const pathName = usePathname()
  const router = useRouter()

  const [listImage, setListImage] = useState<ListImage[]>([])
  const [currentItem, setCurrentItem] = useState<ListImage | null>(null)

  const [render, setRender] = useState<boolean>(false)

  useEffect(() => {
    getRequest(`${endpointBase.QUESTION}`, {
      params: {
        topic: `${pathName?.split('/')[2]}`,
      },
    })
      .then((res: any) => {
        setListImage(res || [])
      })
      .catch(() => {})
  }, [render])

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this topic?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      onOk: () => {
        deleteRequest(`${endpointBase.QUESTION}${id}/`)
          .then(() => {
            message.success('Topic deleted successfully')
            setRender(!render)
          })
          .catch(() => {
            message.error('Failed to delete topic')
          })
          .finally(() => {})
      },
    })
  }

  const handleUpdate = useCallback(
    (item: ListImage) => {
      setCurrentItem(item)
      form.setFieldsValue({ name: item.name })
      form.setFieldsValue({ id: item.id })

      Modal.confirm({
        title: 'Update Topic',
        content: (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        ),
        okText: 'Update',
        cancelText: 'Cancel',
        onOk: () => {
          const name = form.getFieldValue('name')
          const id = form.getFieldValue('id')

          const formData = new FormData()
          formData.append('name', name)

          updateRequest(
            `${endpointBase.QUESTION}${id}/`,
            {
              data: {
                name: formData.get('name'),
              },
            },
            true,
          )
            .then(() => {
              message.success('Topic updated successfully')
              form.resetFields()
              setRender(!render)
              setCurrentItem(null)
            })
            .catch(() => {
              message.error('Failed to update topic')
            })
            .finally(() => {})
        },
      })
    },
    [currentItem, setCurrentItem],
  )

  return (
    <Content
      layout="cms"
      breadcrumb={[
        {
          title: 'Home',
          onClick: () => router.push('/home'),
        },
        {
          title: 'Detail Topic',
        },
      ]}
    >
      <Row gutter={[24, 24]} className="mt-4">
        {listImage?.length ? (
          <>
            {listImage.map((item, index) => (
              <Col key={index} span={6} xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
                <Card
                  color="#f00"
                  className="[&_.anticon]:justify-center !border-[1px] !border-[#000]"
                >
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: '1',
                          label: (
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item.id)
                              }}
                            >
                              Delete
                            </div>
                          ),
                        },
                        {
                          key: '2',
                          label: (
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdate(item)
                              }}
                            >
                              Update
                            </div>
                          ),
                        },
                      ],
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                  >
                    <BsThreeDots
                      className="absolute top-2 right-2 text-2xl cursor-pointer"
                      onClick={(e) => e.stopPropagation()} // Prevents dropdown click propagation
                    />
                  </Dropdown>

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
          </>
        ) : (
          <Spin />
        )}
      </Row>
    </Content>
  )
}
