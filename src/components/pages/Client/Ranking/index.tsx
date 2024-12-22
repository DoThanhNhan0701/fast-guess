'use client'

import { HomeOutlined } from '@ant-design/icons'
import { Avatar, Table, TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'
import Content from '~/components/common/Content'
import { endpointBase } from '~/services/endpoint'
import { getRequest } from '~/services/request'

interface Ranking {
  avatar: string | null
  email: string
  first_name: string
  id: string
  last_name: string
  score: number
  username: string
}

export default function Ranking() {
  const [loading, setLoading] = useState<boolean>(false)
  const [ranking, setRanking] = useState<Ranking[]>([])

  const columns: TableColumnsType<Ranking> = [
    {
      title: 'No',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      width: '5%',
      render: (text: string, record: Ranking, index: number) => <div>{index + 1}</div>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      render: (text: string, record: Ranking) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            className="border"
            src={record?.avatar ? record.avatar : 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'}
            style={{ marginRight: '8px' }}
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Elo',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      render: (text: string, record: Ranking, index: number) => <div>{record.score} Point</div>,
    },
  ]

  useEffect(() => {
    setLoading(true)
    getRequest(`${endpointBase.USER}`)
      .then((e: any) => {
        setRanking(e || [])
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }, [])

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
          loading={loading}
          columns={columns}
          dataSource={ranking}
          pagination={{ pageSize: 5 }}
          bordered
          rowClassName={() => 'ranking-row'}
        />
      </div>
    </Content>
  )
}
