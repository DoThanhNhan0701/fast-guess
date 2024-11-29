import { HomeOutlined } from '@ant-design/icons'
import { Col, Flex, Image, message, Popover, Row } from 'antd'
import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal'
import useModal from '~/hook/useModal'

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

interface Detail {
  id: string
  name: string
  src: string
}

export default function DetaiTopic() {
  const { isOpen, closeModal, openModal } = useModal()
  const [openProve, setOpenProve] = useState(false)
  const [detail, setDetail] = useState<Detail>({
    id: '',
    name: '',
    src: '',
  })

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
          <Button
            onClick={() => message.success('Update successfully')}
            className="w-full"
            type="primary"
          >
            Update
          </Button>
        </Flex>
      </Modal>

      <Content
        layout="client"
        breadcrumb={[
          {
            title: <HomeOutlined />,
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
          {dataDetailTopic.map((ite, inx) => (
            <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={inx}>
              <div className="min-w-[230px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer flex items-center justify-center flex-col">
                <Popover
                  rootClassName="[&_.ant-popover-inner]:!p-0 z-10"
                  content={
                    <div className="cursor-pointer">
                      <p className="py-2 px-4 hover:bg-slate-50">Delete</p>
                      <p
                        className="py-2 px-4 hover:bg-slate-50"
                        onClick={() => {
                          setDetail({
                            id: `${inx}`,
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
                  <p className="text-2xl font-bold">{ite.name}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Content>
    </>
  )
}
