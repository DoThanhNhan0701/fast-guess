import { HomeOutlined } from '@ant-design/icons'
import Content from '~/components/common/Content'

export default function Room() {
  return (
    <Content
      layout="client"
      breadcrumb={[
        {
          title: <HomeOutlined />,
        },
        {
          title: 'Room',
        },
      ]}
    >
      ROME
    </Content>
  )
}
