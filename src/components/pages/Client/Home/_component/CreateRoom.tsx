import { Empty, Flex, Image, Input, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [listTopic, setListTopic] = useState<Topic[]>([])
  const [systemTopics, setSystemTopics] = useState<Topic[]>([])
  const [timeOut, setTimeOut] = useState<string>('')

  const [listTopicId, setListTopicId] = useState<string[]>([])
  const [selectedYourTopics, setSelectedYourTopics] = useState<string[]>([])
  const [mode, setMode] = useState<'fighting' | 'examiner'>('fighting')

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

    getRequest(endpointBase.TOPIC, {
      params: {
        category: 'system',
      },
    }).then((res: any) => setSystemTopics(res || []))
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
    const minImagesCount = Math.min(
      ...listTopicId.map((id) => {
        const topic =
          listTopic.find((_topic) => _topic.id === id) ||
          systemTopics.find((_topic) => _topic.id === id)

        return topic?.count_image ?? 0
      }),
    )

    if (minImagesCount < +timeOut) {
      message.warning(`Time must less than or equal total images (${minImagesCount})`)
      return
    }

    postRequest(`${endpointBase.ROOM}`, {
      data: {
        topics: listTopicId,
        time: timeOut,
        type: mode,
      },
    })
      .then((res: any) => {
        message.success('Create success')
        handelClose()
        renderUI()
        setListTopicId([])
        setSelectedYourTopics([])
        setTimeOut('')
        const url = mode === 'fighting' ? `/play-one-one/${res.id}` : `/play-one-gk/${res.id}`
        router.push(url)
      })
      .catch(() => {})
  }

  return (
    <>
      <Modal width={700} open={isOpen} onCancel={closeModal} zIndex={999}>
        <h2 className="text-2xl font-bold py-2">Your topic:</h2>
        <div className="flex overflow-x-auto gap-5">
          {listTopic.length ? (
            listTopic.map((item) => (
              <button
                key={item.id}
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
              </button>
            ))
          ) : (
            <Empty />
          )}
        </div>

        <h2 className="text-2xl font-bold py-2 mt-3">Suggest a topic:</h2>

        <div className="flex overflow-x-auto gap-5">
          {systemTopics.length ? (
            systemTopics.map((item) => (
              <button
                key={item.id}
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
              </button>
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
      <Modal width={700} open={open} onCancel={handelClose} title="Create room" zIndex={998}>
        <div
          className={`flex overflow-x-auto gap-5 ${!listTopicId.length ? 'justify-center' : ''}`}
        >
          {listTopicId.map((item, index) => {
            const topic = [...listTopic, ...systemTopics].find((_item) => _item.id === item)
            return (
              <div
                key={index}
                className={`min-w-[230px] p-5 relative border-[2px] ${
                  selectedYourTopics.includes(item)
                    ? 'border-green-500'
                    : 'border-[rgb(96,_11,_118)]'
                } rounded-2xl cursor-pointer`}
              >
                <Image
                  width={74}
                  height={74}
                  preview={false}
                  className="rounded-xl border object-cover"
                  src={topic?.banner}
                />
                <div className="py-[10px]">
                  <p className="text-2xl font-extrabold">{topic?.name}</p>
                  <p className="text-sm font-bold">{topic?.count_image} Images</p>
                </div>
              </div>
            )
          })}
          <button
            onClick={openModal}
            className="min-w-[230px] h-[194.67px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer flex items-center justify-center"
          >
            <FaPlus className="text-6xl" />
          </button>
        </div>

        <div className="flex justify-between w-full max-w-[450px] m-auto mt-6 gap-1">
          <div className="flex justify-center flex-col items-center w-1/2">
            <p className="text-2xl font-bold">Mode</p>
            <Select
              value={mode}
              size="large"
              options={[
                {
                  value: 'fighting',
                  label: 'Fighting',
                },
                {
                  value: 'examiner',
                  label: 'Examiner',
                },
              ]}
              className="w-full border-black border-2 rounded-xl"
              onChange={(value) => setMode(value)}
            />
          </div>
          <div className="flex justify-center flex-col items-center w-1/2">
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
