'use client'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import Content from '~/components/common/Content'
import { endpointBase } from '~/services/endpoint'
import { getRequest } from '~/services/request'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export default function Users() {
  const [listUser, setListUser] = useState<User[]>([])

  useEffect(() => {
    getRequest(endpointBase.USER)
      .then((e: any) => {
        setListUser(e)
      })
      .catch(() => {})
  }, [])

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
      title: 'First name',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (text: string, record: User) => <p key={record.id}>{text ? text : '---'}</p>,
    },
    {
      title: 'Last name',
      dataIndex: 'last_name',
      key: 'last_name',
      render: (text: string, record: User) => <p key={record.id}>{text ? text : '---'}</p>,
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
        <Space key={record.id} size="middle">
          <Button icon={<EditOutlined />} type="link" />
          <Button icon={<DeleteOutlined />} type="link" danger />
        </Space>
      ),
    },
  ]

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
          <Table dataSource={listUser} columns={columns} rowKey="id" bordered />
        </div>
      </Content>
    </>
  )
}
