import { HomeOutlined } from '@ant-design/icons'
import { Col, Image, Popover, Row } from 'antd'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Content from '~/components/common/Content'

export default function DetaiTopic() {
  const content = (
    <div className="cursor-pointer">
      <p className="py-2 px-4 hover:bg-slate-50">Delete</p>
      <p className="py-2 px-4 hover:bg-slate-50">Update</p>
    </div>
  )

  return (
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((ite, inx) => (
          <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={inx}>
            <div className="min-w-[230px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer flex items-center justify-center flex-col">
              <Popover
                rootClassName="[&_.ant-popover-inner]:!p-0"
                content={content}
                trigger="click"
                placement="bottom"
              >
                <BsThreeDotsVertical className="absolute top-1 right-1 text-xl" />
              </Popover>

              <Image
                width={150}
                preview={false}
                className="rounded-xl"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <div className="flex justify-between max-w-[400px] m-auto mt-6">
                <p className="text-2xl font-bold">Fluit</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Content>
  )
}
