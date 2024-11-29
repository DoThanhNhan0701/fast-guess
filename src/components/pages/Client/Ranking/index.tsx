'use client'

import { HomeOutlined } from '@ant-design/icons'
import { Avatar, Table, TableColumnsType } from 'antd'
import Content from '~/components/common/Content'

interface RankingData {
  key: number
  rank: number
  username: string
  elo: string
  avatar: string
}

export default function Ranking() {
  const columns: TableColumnsType<RankingData> = [
    {
      title: 'tt',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
    },
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      render: (text: string, record: RankingData) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={record.avatar} style={{ marginRight: '8px' }} />
          {text}
        </div>
      ),
    },
    {
      title: 'elo',
      dataIndex: 'elo',
      key: 'elo',
      align: 'center',
    },
  ]

  const data: RankingData[] = [
    {
      key: 1,
      rank: 1,
      username: 'abc',
      elo: '1000 points',
      avatar: 'https://i.pravatar.cc/50?img=1',
    },
    {
      key: 2,
      rank: 2,
      username: 'abcd',
      elo: '1000 points',
      avatar: 'https://i.pravatar.cc/50?img=2',
    },
    {
      key: 3,
      rank: 3,
      username: 'abcde',
      elo: '1000 points',
      avatar: 'https://i.pravatar.cc/50?img=3',
    },
  ]

  return (
    <Content
      breadcrumb={[
        {
          title: <HomeOutlined />,
        },
        {
          title: 'Ranking',
        },
      ]}
      layout="client"
    >
      <div style={{ padding: '20px' }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          bordered
          rowClassName={() => 'ranking-row'}
        />
      </div>
    </Content>
  )
}
