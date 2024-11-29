'use client'

import { InboxOutlined } from '@ant-design/icons'
import { Flex, message, Upload, UploadFile, UploadProps } from 'antd'
import { RcFile } from 'antd/es/upload'
import { UploadRef } from 'antd/es/upload/Upload'
import { useRef, useState } from 'react'
import { endpointBase } from '~/services/endpoint'
import { postRequest } from '~/services/request'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal'

interface Props {
  isOpen: boolean
  onCancel: () => void
  render: () => void
}

const { Dragger } = Upload

export default function CreateTopic({ isOpen, onCancel, render }: Props) {
  const uploadRef = useRef<UploadRef | null>(null)
  const [inputName, setInputName] = useState<string>('')
  const [uploading, setUploading] = useState<boolean>(false)

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    beforeUpload(file) {
      const zipTypes = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip']
      const isZip = zipTypes.includes(file.type)

      if (!isZip) {
        message.error('You can only upload ZIP files!')
      }
      return isZip || Upload.LIST_IGNORE
    },
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const handleUploadClick = () => {
    if (!inputName) return message.warning('Please input key camera')
    const uploadComponent = uploadRef.current

    if (uploadComponent) {
      const fileList = uploadComponent.fileList as UploadFile[]

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as RcFile

        const zipTypes = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip']
        const isZip = zipTypes.includes(file.type)

        if (isZip) {
          setUploading(true)
          const formData = new FormData()
          formData.append('file', file)
          formData.append('name', inputName)

          postRequest(
            `${endpointBase.TOPIC}import_topics/`,
            {
              data: formData,
            },
            true,
          )
            .then(() => {
              message.success(`${file.name} file uploaded successfully.`)
              render()
              onCancel()
              setInputName('')
              setUploading(false)
            })
            .catch(() => {
              message.error(`${file.name} file upload failed.`)
              onCancel()
              setUploading(false)
            })
        } else {
          message.error('You can only upload ZIP files!')
        }
      } else {
        message.warning('No file selected for upload!')
      }
    }
  }

  return (
    <Modal
      title="Create topic"
      open={isOpen}
      onCancel={() => {
        const uploadComponent = uploadRef.current

        if (uploadComponent) {
          const fileList = uploadComponent.fileList as UploadFile[]
          if (fileList.length > 0)
            return message.warning('Please press the YES button to complete the process')
        }
        onCancel()
      }}
    >
      <p className="ml-[2px] text-black font-bold">Name topic</p>
      <Input
        value={inputName}
        className="mb-4 h-[40px]"
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Name topic"
      />

      <Dragger {...props} ref={uploadRef}>
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
        <Button loading={uploading} onClick={handleUploadClick} className="w-full" type="primary">
          Create
        </Button>
      </Flex>
    </Modal>
  )
}
