'use client'

import { DeleteOutlined } from '@ant-design/icons'
import { Button, message, Modal, Space, Table } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Content from '~/components/common/Content'
import { endpointBase } from '~/services/endpoint'
import { deleteRequest, getRequest } from '~/services/request'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export default function Users() {
  const [listUser, setListUser] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = () => {
    getRequest(endpointBase.USER)
      .then((e: any) => {
        setListUser(e)
      })
      .catch(() => {})
  }

  const handleDeleteUser = (userId: string | number) => {
    Modal.confirm({
      title: 'Delete user',
      content: 'Are use sure want to delete this user',
      okType: 'danger',
      okText: 'Delete',
      okButtonProps: {
        type: 'primary',
      },
      onOk: async () => {
        deleteRequest(`${endpointBase.USER}${userId}/`)
          .then(() => {
            message.success('User deleted')
            fetchUser()
          })
          .catch(() => {
            message.error('Delete user failed')
          })
      },
    })
  }

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: 'First name',
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center',
      render: (text: string, record: User) => <p key={record.id}>{text ? text : '---'}</p>,
    },
    {
      title: 'Last name',
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center',
      render: (text: string, record: User) => <p key={record.id}>{text ? text : '---'}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (text: string, record: User) => (
        <Space key={record.id} size="middle">
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDeleteUser(record.id)}
          />
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
            onClick: () => router.push('/home'),
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
