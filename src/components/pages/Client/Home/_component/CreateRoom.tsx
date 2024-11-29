import { Empty, Flex, Image, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'

import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal'
import useModal from '~/hook/useModal'
import { endpointBase } from '~/services/endpoint'
import { getRequest, postRequest } from '~/services/request'
import { Topic } from '../../Setting'

interface Props {
  open: boolean
  handelClose: () => void
  renderUI: () => void
}

export default function CreateRoom({ open, handelClose, renderUI }: Props) {
  const { isOpen, closeModal, openModal } = useModal()
  const [listTopic, setListTopic] = useState<Topic[]>([])
  const [timeOut, setTimeOut] = useState<string>('')

  const [listTopicId, setListTopicId] = useState<string[]>([])
  const [selectedYourTopics, setSelectedYourTopics] = useState<string[]>([])

  useEffect(() => {
    getRequest(endpointBase.TOPIC, {
      params: {
        category: 'user',
      },
    })
      .then((res: any) => {
        setListTopic(res || [])
      })
      .catch(() => {})
  }, [])

  const handleSelection = (
    topicId: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    state: string[],
  ) => {
    if (state.includes(topicId)) {
      setState(state.filter((id) => id !== topicId))
    } else {
      setState([...state, topicId])
    }
  }

  const handleCreateTopic = () => {
    setListTopicId(selectedYourTopics)
    closeModal()
  }

  const handleCreateRoom = () => {
    postRequest(`${endpointBase.ROOM}`, {
      data: {
        topics: listTopicId,
        time: timeOut,
      },
    })
      .then(() => {
        message.success('Create success')
        handelClose()
        renderUI()
        setListTopicId([])
        setSelectedYourTopics([])
        setTimeOut('')
      })
      .catch(() => {})
  }

  return (
    <>
      <Modal width={700} open={isOpen} onCancel={closeModal}>
        <h2 className="text-2xl font-bold py-2">Your topic:</h2>
        <div className="flex overflow-x-auto justify-center gap-5">
          {listTopic.length ? (
            listTopic.map((item, index) => (
              <div
                key={index}
                className={`min-w-[230px] p-5 relative border-[2px] ${
                  selectedYourTopics.includes(item.id)
                    ? 'border-green-500'
                    : 'border-[rgb(96,_11,_118)]'
                } rounded-2xl cursor-pointer`}
                onClick={() => handleSelection(item.id, setSelectedYourTopics, selectedYourTopics)}
              >
                {selectedYourTopics.includes(item.id) ? (
                  <TiTick className="absolute top-1 right-1 text-2xl" />
                ) : null}

                <Image
                  width={74}
                  height={74}
                  preview={false}
                  className="rounded-xl border-[2px] object-cover"
                  src={item.banner}
                />
                <div className="py-[10px]">
                  <p className="text-2xl font-extrabold">{`Topic ${item.name}`}</p>
                  <p className="text-sm font-bold">{`${item.count_image} Images`}</p>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>

        <Flex className="gap-6">
          <Button onClick={closeModal} className="w-full mt-6" type="default">
            Cancel
          </Button>
          <Button onClick={handleCreateTopic} className="w-full mt-6" type="primary">
            Create
          </Button>
        </Flex>
      </Modal>

      {/* Create */}
      <Modal width={700} open={open} onCancel={handelClose} title="Create room">
        <div
          className={`flex overflow-x-auto gap-5 ${!listTopicId.length ? 'justify-center' : ''}`}
        >
          {listTopicId.map((item, index) => (
            <div
              key={index}
              className={`min-w-[230px] p-5 relative border-[2px] ${
                selectedYourTopics.includes(item) ? 'border-green-500' : 'border-[rgb(96,_11,_118)]'
              } rounded-2xl cursor-pointer`}
            >
              <Image
                width={74}
                height={74}
                preview={false}
                className="rounded-xl border object-cover"
                src={listTopic.find((i) => i.id === item)?.banner ?? ''}
              />
              <div className="py-[10px]">
                <p className="text-2xl font-extrabold">{`${
                  listTopic.find((i) => i.id === item)?.name ?? ''
                }`}</p>
                <p className="text-sm font-bold">{`${
                  listTopic.find((i) => i.id === item)?.count_image ?? ''
                } Images`}</p>
              </div>
            </div>
          ))}
          <div
            onClick={openModal}
            className="min-w-[230px] h-[194.67px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer flex items-center justify-center"
          >
            <FaPlus className="text-6xl" />
          </div>
        </div>

        <div className="flex justify-between w-full max-w-[250px] m-auto mt-6">
          <div className="flex justify-center flex-col items-center w-full">
            <p className="text-2xl font-bold">Time</p>
            <Input
              value={timeOut}
              onChange={(e) => setTimeOut(e.target.value)}
              placeholder="Time"
              type="number"
              className="w-full h-[40px] !border-[2px] !border-[#000] !font-bold"
            />
          </div>
        </div>

        <Flex className="gap-6">
          <Button onClick={handelClose} className="w-full mt-6" type="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (timeOut !== '' && selectedYourTopics.length) {
                handleCreateRoom()
              } else {
                if (timeOut === '') {
                  message.warning('Please input time')
                } else if (!selectedYourTopics.length) {
                  message.warning('Please select topic')
                } else {
                  message.error('Error')
                }
              }
            }}
            className="w-full mt-6"
            type="primary"
          >
            Create
          </Button>
        </Flex>
      </Modal>
    </>
  )
}
