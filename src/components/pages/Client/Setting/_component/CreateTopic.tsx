'use client'

import { InboxOutlined } from '@ant-design/icons'
import { Flex, message, Upload, UploadProps } from 'antd'
import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal'

interface Props {
  isOpen: boolean
  onCancel: () => void
}

const { Dragger } = Upload

export default function CreateTopic({ isOpen, onCancel }: Props) {
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  return (
    <Modal title="Create topic" open={isOpen} onCancel={onCancel}>
      <p className="ml-[2px] text-black font-bold">Name topic</p>
      <Input className="mb-4" placeholder="Name topic" />

      <Dragger {...props} className="">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>

      <Flex gap={24} justify="space-between" className="mt-4">
        <Button onClick={onCancel} className="w-full" type="default">
          Cancel
        </Button>
        <Button className="w-full" type="primary">
          Create
        </Button>
      </Flex>
    </Modal>
  )
}
