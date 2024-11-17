'use client'

import { Space, Table, TableProps, Tag } from 'antd'
import Content from '~/components/common/Content'

export default function Users() {
  interface DataType {
    key: string
    name: string
    age: number
    address: string
    tags: string[]
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      align: 'center',
      key: 'age',
    },
    {
      title: 'Address',
      align: 'center',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      align: 'center',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <a>Setting</a>
          <a>Update</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
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
        <Table<DataType> columns={columns} dataSource={data} pagination={false} />
      </Content>
    </>
  )
}
