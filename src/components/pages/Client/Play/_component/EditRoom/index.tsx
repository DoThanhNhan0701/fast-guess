import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { TiTick } from 'react-icons/ti'
import { Button, Flex, Image, Input, message } from 'antd'
import { IRoom } from '~/models/common'
import { endpointBase } from '~/services/endpoint'
import { getRequest } from '~/services/request'
import { Topic } from '../../../Setting'

interface Props {
  onCancel: () => void
  onFinish: () => void
}

export default function EditRoom({ onCancel, onFinish }: Props) {
  const { id } = useParams()
  const [listTopic, setListTopic] = useState<Topic[]>([])
  const [systemTopics, setSystemTopics] = useState<Topic[]>([])
  const [room, setRoom] = useState<null | IRoom>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const roomData = await getRequest<IRoom>(`${endpointBase.ROOM}${id}/`)
        console.log(roomData)
        setRoom(roomData)

        setSelectedTopics(roomData.topics)
      } catch (error) {}
    })()

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

  const handleClickTopic = (id: string) => {
    if (selectedTopics.includes(id))
      setSelectedTopics((prev) => prev.filter((prevId) => prevId !== id))
    else setSelectedTopics((prev) => [...prev, id])
  }

  const handleUpdate = async () => {
    try {
      const totalImage = selectedTopics.reduce((total, id) => {
        const topic =
          listTopic.find((_topic) => _topic.id === id) ??
          systemTopics.find((_topic) => _topic.id === id)
        if (topic) return total + topic.count_image
        return total
      }, 0)

      if (totalImage < room!.time) {
        message.warning(`Time must less than or equal total image (${totalImage})`)
        return
      }

      setUpdating(true)
    } catch (error) {
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold py-2">
        Your topic:{' '}
        <span className="text-sm text-gray-500">
          (
          {selectedTopics.reduce((value, id) => {
            if (listTopic.some((topic) => topic.id === id)) return value + 1
            return value
          }, 0)}{' '}
          Selected)
        </span>
      </h2>
      <div className="flex overflow-x-auto gap-5">
        {listTopic.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleClickTopic(topic.id)}
            className={`min-w-[230px] p-5 relative border-[2px] ${
              selectedTopics.includes(topic.id) ? 'border-green-500' : 'border-[rgb(96,_11,_118)]'
            } rounded-2xl cursor-pointer`}
          >
            {selectedTopics.includes(topic.id) && (
              <TiTick className="absolute top-1 right-1 text-2xl" />
            )}

            <Image
              width={74}
              height={74}
              preview={false}
              className="rounded-xl border-[2px] object-cover"
              src={topic.banner}
            />
            <div className="py-[10px]">
              <p className="text-2xl font-extrabold">{`Topic ${topic.name}`}</p>
              <p className="text-sm font-bold">{`${topic.count_image} Images`}</p>
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold py-2">
        Suggest a topic:{' '}
        <span className="text-sm text-gray-500">
          (
          {selectedTopics.reduce((value, id) => {
            if (systemTopics.some((topic) => topic.id === id)) return value + 1
            return value
          }, 0)}{' '}
          Selected)
        </span>
      </h2>
      <div className="flex overflow-x-auto gap-5">
        {systemTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleClickTopic(topic.id)}
            className={`min-w-[230px] p-5 relative border-[2px] ${
              selectedTopics.includes(topic.id) ? 'border-green-500' : 'border-[rgb(96,_11,_118)]'
            } rounded-2xl cursor-pointer`}
          >
            {selectedTopics.includes(topic.id) && (
              <TiTick className="absolute top-1 right-1 text-2xl" />
            )}

            <Image
              width={74}
              height={74}
              preview={false}
              className="rounded-xl border-[2px] object-cover"
              src={topic.banner}
            />
            <div className="py-[10px]">
              <p className="text-2xl font-extrabold">{`Topic ${topic.name}`}</p>
              <p className="text-sm font-bold">{`${topic.count_image} Images`}</p>
            </div>
          </button>
        ))}
      </div>

      <Flex justify="center" className="mt-5">
        <div>
          <p className="text-lg font-semibold">Time</p>
          <Input
            disabled={!room}
            type="number"
            value={room?.time}
            className="font-semibold"
            onChange={(e) =>
              setRoom((prev) => ({
                ...prev!,
                time: +e.target.value,
              }))
            }
          />
        </div>
      </Flex>
      <Flex justify="center" gap={8} className="mt-2">
        <Button className="w-1/3" size="large" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="w-1/3"
          type="primary"
          size="large"
          disabled={!room}
          onClick={handleUpdate}
        >
          Update
        </Button>
      </Flex>
    </div>
  )
}
