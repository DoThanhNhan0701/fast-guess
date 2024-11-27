import { Flex, Image, Input } from 'antd'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'

import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal'
import Select from '~/components/common/Select'
import useModal from '~/hook/useModal'

interface Props {
  open: boolean
  handelClose: () => void
}

export default function CreateRoom({ open, handelClose }: Props) {
  const { isOpen, closeModal, openModal } = useModal()
  const [listTopic, setListTopic] = useState<number[]>([])

  // State for selected topics
  const [selectedYourTopics, setSelectedYourTopics] = useState<number[]>([])
  const [selectedSuggestTopics, setSelectedSuggestTopics] = useState<number[]>([])

  // Function to toggle topic selection
  const handleSelection = (
    topicId: number,
    setState: React.Dispatch<React.SetStateAction<number[]>>,
    state: number[],
  ) => {
    if (state.includes(topicId)) {
      setState(state.filter((id) => id !== topicId))
    } else {
      setState([...state, topicId])
    }
  }

  const handleCreateTopic = () => {
    setListTopic(selectedYourTopics)
    closeModal()
  }

  return (
    <>
      <Modal width={700} open={isOpen} onCancel={closeModal}>
        <h2 className="text-2xl font-bold py-2">Your topic:</h2>
        <div className="flex overflow-x-auto gap-5">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`min-w-[230px] p-5 relative border-[2px] ${
                selectedYourTopics.includes(item) ? 'border-green-500' : 'border-[rgb(96,_11,_118)]'
              } rounded-2xl cursor-pointer`}
              onClick={() => handleSelection(item, setSelectedYourTopics, selectedYourTopics)}
            >
              {selectedYourTopics.includes(item) ? (
                <TiTick className="absolute top-1 right-1 text-2xl" />
              ) : null}

              <Image
                width={74}
                preview={false}
                className="rounded-xl"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <div className="py-[10px]">
                <p className="text-2xl font-extrabold">{`Topic ${item}`}</p>
                <p className="text-sm font-bold">300 Image</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold py-2">Suggest topic:</h2>
        <div className="flex overflow-x-auto gap-5">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`min-w-[230px] p-5 relative border-[2px] ${
                selectedSuggestTopics.includes(item)
                  ? 'border-green-500'
                  : 'border-[rgb(96,_11,_118)]'
              } rounded-2xl cursor-pointer`}
              onClick={() => handleSelection(item, setSelectedSuggestTopics, selectedSuggestTopics)}
            >
              {selectedSuggestTopics.includes(item) ? (
                <TiTick className="absolute top-1 right-1 text-2xl" />
              ) : null}

              <Image
                width={74}
                preview={false}
                className="rounded-xl"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <div className="py-[10px]">
                <p className="text-2xl font-extrabold">{`Topic ${item}`}</p>
                <p className="text-sm font-bold">300 Image</p>
              </div>
            </div>
          ))}
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
        <div className={`flex overflow-x-auto gap-5 ${!listTopic.length ? 'justify-center' : ''}`}>
          {listTopic.map((item) => (
            <div
              key={item}
              className={`min-w-[230px] p-5 relative border-[2px] ${
                selectedYourTopics.includes(item) ? 'border-green-500' : 'border-[rgb(96,_11,_118)]'
              } rounded-2xl cursor-pointer`}
            >
              <Image
                width={74}
                preview={false}
                className="rounded-xl"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <div className="py-[10px]">
                <p className="text-2xl font-extrabold">{`Topic ${item}`}</p>
                <p className="text-sm font-bold">300 Image</p>
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

        <div className="flex justify-between max-w-[400px] m-auto mt-6">
          <div className="flex justify-center flex-col items-center">
            <p className="text-2xl font-bold">Model</p>
            <Select
              defaultValue={['1 VS 1']}
              className="w-[100px] h-[40px] [&_.ant-select-selector]:border-[2px] [&_.ant-select-selector]:border-[#000] [&_.ant-select-selection-item]:!font-bold"
              options={[
                {
                  label: '1 VS 1',
                  value: '1 VS 1',
                },
                {
                  label: 'GK',
                  value: 'GK',
                },
              ]}
            />
          </div>
          <div className="flex justify-center flex-col items-center">
            <p className="text-2xl font-bold">Time</p>
            <Input
              placeholder="Time"
              className="w-[100px] h-[40px] !border-[2px] !border-[#000] !font-bold"
            />
          </div>
        </div>

        <Flex className="gap-6">
          <Button onClick={handelClose} className="w-full mt-6" type="default">
            Cancel
          </Button>
          <Button className="w-full mt-6" type="primary">
            Create
          </Button>
        </Flex>
      </Modal>
    </>
  )
}
