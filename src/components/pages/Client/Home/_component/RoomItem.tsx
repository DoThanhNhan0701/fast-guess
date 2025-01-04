import { useEffect, useState } from 'react'
import { Avatar, Card, Col, Flex, Image, Row } from 'antd'

import { ITopic } from '~/models/common'
import { endpointBase } from '~/services/endpoint'
import { getRequest } from '~/services/request'

interface Props {
  id: string | number
  topics: string[]
  time: number
  type: string
  current_player: number
  count_player: number
  userAvatar: string | null
}

export default function RoomItem({
  id,
  topics,
  time,
  type,
  count_player,
  current_player,
  userAvatar,
}: Props) {
  const [roomBanner, setRoomBanner] = useState('')

  useEffect(() => {
    ;(async () => {
      const topic = await getRequest<ITopic>(`${endpointBase.TOPIC}${topics[0]}/`)
      setRoomBanner(topic.banner)
    })()
  }, [])

  return (
    <Card className="border-none rounded-lg">
      <Card.Meta
        title={
          <Flex align="center" gap={8}>
            <Avatar src={userAvatar ?? '/images/avatar-default.png'} />
            {`ID Room: ${id}`}
          </Flex>
        }
        className="[&_.ant-image-mask]:rounded-xl"
        description={
          <>
            <Image
              preview={false}
              className="rounded-xl object-cover"
              height={150}
              width={'100%'}
              src={roomBanner}
              alt=""
            />
            <Row className="text-base font-bold text-slate-800">
              <Col span={12}>
                <p className="text-base font-bold text-slate-800">{`Topic: ${
                  topics.length ?? 0
                }`}</p>
              </Col>
              <Col span={12}>
                <p className="text-base font-bold text-slate-800">{`Time: ${time} s`}</p>
              </Col>
              <Col span={12}>
                <p>Mode: {type}</p>
              </Col>
              <Col span={12}>
                <p>
                  Player: {current_player}/{count_player}
                </p>
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  )
}
