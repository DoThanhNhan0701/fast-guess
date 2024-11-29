'use client'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space, Table, TableProps, Tag } from 'antd'
import { useState } from 'react'
import Content from '~/components/common/Content'

export default function Users() {
  interface User {
    id: number
    username: string
    email: string
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: User) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="link" />
          <Button icon={<DeleteOutlined />} type="link" danger />
        </Space>
      ),
    },
  ]

  const [users, _] = useState<User[]>([
    { id: 1, username: 'JohnDoe', email: 'john.doe@example.com' },
    { id: 2, username: 'JaneSmith', email: 'jane.smith@example.com' },
    { id: 3, username: 'JaneSmith1', email: 'jane.smith@example.com' },
    { id: 4, username: 'JaneSmith3', email: 'jane.smith@example.com' },
    { id: 5, username: 'JaneSmith2', email: 'jane.smith@example.com' },
    { id: 6, username: 'JaneSmith5', email: 'jane.smith@example.com' },
  ])

  return (
    <>
      <Content
        layout="cms"
        breadcrumb={[
          {
            title: 'Home',
          },
          {
            title: 'Users',
            href: '/users',
          },
        ]}
      >
        <div style={{ padding: 20 }}>
          <Table dataSource={users} columns={columns} rowKey="id" bordered />
        </div>
      </Content>
    </>
  )
}
