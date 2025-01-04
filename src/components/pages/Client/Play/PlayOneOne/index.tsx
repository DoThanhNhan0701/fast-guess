'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { Col, Flex, Image, message, Modal, Row, Spin } from 'antd'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import { useWebSocket } from '~/hook/useWebSocket'
import { useCountDown } from '~/hook/useCountDown'
import { accessToken, domainSocket } from '~/helper/contant'
import { RootState } from '~/store'
import { getRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'
import { IRoom, TWsEvent } from '~/models/common'
import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import Input from '~/components/common/Input'
import { Topic } from '../../Setting'
import EditRoom from '../_component/EditRoom'
import BgPlaySound from '~/components/common/BgPlaySound'
import { actionPlaySound } from '~/store/slice/app'
import NextTopic from '../_component/NextTopic'
import webStorageClient from '~/utils/webStorageClient'
import { ACCESS_TOKEN } from '~/settings/constants'

export default function PlayOneOne() {
  const router = useRouter()
  const { id: roomID } = useParams()
  const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${
    new URL(domainSocket ?? '').host
  }/ws/game/${roomID}/?token=${webStorageClient.get(ACCESS_TOKEN)}`
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [roomData, setRoomData] = useState<IRoom | null>(null)
  const [roomTopic, setRoomTopic] = useState<null | Topic>(null)
  const [answer, setAnswer] = useState('')
  const [opponent, setOpponent] = useState<string | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [opponentAvatar, setOpponentAvatar] = useState<null | string | '_'>(null)

  const [currentStatus, setCurrentStatus] = useState<'NEED_START' | 'WAITING' | null>(null)

  const player1CountDown = useCountDown(roomData?.time || 61)
  const player2CountDown = useCountDown(roomData?.time || 61)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [result, setResult] = useState<'WIN' | 'LOSE' | null>(null)
  const [isError, setIsError] = useState(false)

  const [status, setStatus] = useState<
    'notAvailable' | 'waiting_opponent' | 'waiting_start' | 'playing'
  >('notAvailable')
  const [isEditing, setIsEditing] = useState(false)
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(0)
  const [isReadyForNextTopic, setIsReadyForNextTopic] = useState(false)

  const handleSwitchTurn = () => {
    if (!player2CountDown.isRunning) {
      player1CountDown.pauseCountDown()
      player2CountDown.startCountDown()
    } else {
      player2CountDown.pauseCountDown()
      player1CountDown.startCountDown()
    }
  }

  const handleReset = () => {
    player1CountDown.setTime(roomData?.time ?? 0)
    player2CountDown.setTime(roomData?.time ?? 0)
    setAnswer('')
  }

  const handleMessage = (data: TWsEvent<any>) => {
    console.log(data)

    switch (data.type) {
      case 'start':
        setCurrentStatus(null)
        setAnswer('')
        setStatus('playing')
        message.success(data.message)
        // setOpponent(data.players.find((name) => name !== userInfo!.username)!)
        if (data.current_turn === userInfo?.username) player1CountDown.startCountDown()
        else player2CountDown.startCountDown()
        setCurrentTopicIndex((prev) => prev + 1)
        setIsReadyForNextTopic(false)
        break

      case 'question':
        setCurrentImage(data.question)
        break

      case 'error':
        if (player1CountDown.isRunning) {
          message.error(data.message)
          dispatch(actionPlaySound('wrong'))
          setIsError(true)
        }
        break
      case 'turn':
        if (player1CountDown.isRunning) {
          dispatch(actionPlaySound('correct'))
        }
        setAnswer('')
        handleSwitchTurn()
        message.success(data.message)
        break

      case 'user_joined':
        setOwner(data.owner_room)
        if (data.players?.[0]) {
          // setOpponent(data.username)
          if (userInfo?.username === data.owner_room) setStatus('waiting_start')
        }

        if (data.username !== userInfo?.username) {
          setOpponent(data.username)
        } else setOpponent(data.players[0])
        break

      case 'ready_game':
        if (data.all_ready) {
          if (userInfo?.username === roomData?.created_by.username) setStatus('waiting_start')
        } else setStatus('notAvailable')

        handleReset()

        break

      case 'out_room':
        setOpponent(null)
        setOpponentAvatar(null)
        setStatus('notAvailable')
        setOwner(data.owner_room)
        break

      case 'end':
        if (data.winner === userInfo?.username) setResult('WIN')
        else setResult('LOSE')
    }
  }

  const { sendMessage } = useWebSocket(wsUrl, handleMessage, {
    onError: () => {
      router.replace('/home')
    },
  })

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getRequest<IRoom>(`${endpointBase.ROOM}${roomID}/`)
        player1CountDown.setTime(response.time)
        player2CountDown.setTime(response.time)
        setRoomData(response)
        const roomTopic = await getRequest<Topic>(`${endpointBase.TOPIC}${response.topics[0]}/`)
        setRoomTopic(roomTopic)
        if (response.created_by.username !== userInfo?.username) {
          setOpponent(response.created_by.username)
        }
      } catch (error) {}
    })()
  }, [])

  useEffect(() => {
    if (roomData && roomData.created_by.username !== userInfo?.username) setCurrentStatus('WAITING')
  }, [roomData])

  useEffect(() => {
    if (opponent && !opponentAvatar) {
      ;(async () => {
        try {
          const response = await getRequest<{ avatar: null | string }>(
            `${endpointBase.USER}${opponent}/`,
          )
          setOpponentAvatar(response.avatar ?? '_')
        } catch (error) {}
      })()
    }
  }, [opponent, opponentAvatar])

  const handleSubmit = () => {
    if (!answer.trim()) {
      message.warning('Please input answer')
      return
    }

    sendMessage({
      action: 'submit',
      answer,
    })
  }

  const handleStart = () => {
    console.log('call start')

    sendMessage({
      action: 'start_game',
    })
  }

  return (
    <Content
      layout="client"
      breadcrumb={[
        {
          title: <HomeOutlined />,
          onClick: () => router.push('/home'),
        },
        {
          title: 'Play One and One',
        },
      ]}
    >
      <Flex justify="space-between">
        <p className="font-bold text-2xl">ID: {roomID}</p>
        {roomData?.created_by.username === userInfo?.username &&
          ['waiting_start', 'notAvailable'].includes(status) && (
            <button onClick={() => setIsEditing(true)}>
              <SettingOutlined className="text-2xl" />
            </button>
          )}
      </Flex>
      <h1 className="text-4xl font-bold py-6 text-center">Fast Guess</h1>

      <Row align={'middle'} className="justify-center mb-10">
        <Col
          span={5}
          className={twMerge(
            'flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl',
            player1CountDown.isRunning && 'border-green-600 shadow shadow-green-500',
          )}
        >
          <Image
            width={74}
            height={74}
            preview={false}
            className="rounded-xl object-cover"
            src={userInfo?.avatar ?? '/images/avatar-default.png'}
            alt=""
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl ">
            {userInfo?.username}
          </p>
        </Col>

        <Col span={14} className="flex items-center justify-center">
          {status === 'playing' ? (
            <>
              <FaLongArrowAltLeft
                className={twMerge('text-3xl', player1CountDown.isRunning && 'text-[#15683b]')}
              />
              <div className={twMerge(player1CountDown.isRunning && 'text-[#15683b] font-medium')}>
                -----------------------
              </div>
              <div
                className={`min-w-[320px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer text-center`}
              >
                {currentImage && (
                  <Image
                    width={200}
                    height={200}
                    preview={false}
                    className="rounded-xl object-cover"
                    src={`${domainSocket}${currentImage}`}
                  />
                )}
              </div>
              <div
                className={twMerge(player2CountDown.isRunning && 'text-[#15683b] font-semibold')}
              >
                -----------------------
              </div>
              <FaLongArrowAltRight
                className={twMerge('text-3xl', player2CountDown.isRunning && 'text-[#15683b]')}
              />
            </>
          ) : (
            <div className="p-5 bg-gray-200 rounded-2xl">
              <Image
                src={roomTopic?.banner}
                className="object-cover rounded-lg aspect-video"
                preview={false}
              />
              <p className="text-center text-lg font-semibold mt-2">{roomTopic?.name}</p>
              <p className="text-center font-medium">{roomTopic?.count_image} images</p>
            </div>
          )}
        </Col>

        <Col
          span={5}
          className={twMerge(
            'flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl',

            player2CountDown.isRunning && 'border-green-500 shadow shadow-green-500',
          )}
        >
          <Image
            width={74}
            height={74}
            preview={false}
            className="rounded-xl object-cover"
            src={
              !opponentAvatar || opponentAvatar === '_'
                ? '/images/avatar-default.png'
                : opponentAvatar
            }
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
            {opponent ?? '...'}
          </p>
        </Col>
      </Row>

      {status === 'playing' ? (
        <Row align={'middle'} gutter={36} className="justify-center max-w-[80%] !m-auto">
          <Col span={5} className="flex items-center justify-center flex-col gap-2 ">
            <p
              className={twMerge(
                'font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl',
                player1CountDown.isRunning && 'border-green-500',
              )}
            >
              {player1CountDown.time}
            </p>
          </Col>
          <Col span={14} className="flex items-center justify-center">
            <FaLongArrowAltLeft
              className={twMerge('text-3xl', !player1CountDown.isRunning && 'text-transparent')}
            />
            <div>--</div>
            <Input
              className={twMerge(
                'h-[100px] border-[2px] border-[#000] text-6xl font-extrabold leading-[60px] text-center',
                isError && 'border-red-500',
              )}
              value={answer}
              disabled={!player1CountDown.isRunning}
              onChange={(e) => {
                setAnswer(e.target.value)
                setIsError(false)
              }}
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  handleSubmit()
                }
              }}
            />
            <div>--</div>
            <FaLongArrowAltRight
              className={twMerge('text-3xl', !player2CountDown.isRunning && 'text-transparent')}
            />
          </Col>
          <Col span={5} className="flex items-center justify-center flex-col gap-2 ">
            <p
              className={twMerge(
                'font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl',
                player2CountDown.isRunning && 'border-green-500',
              )}
            >
              {player2CountDown.time}
            </p>
          </Col>
        </Row>
      ) : (
        ''
      )}

      {status === 'playing' ? (
        <div className="max-w-[40%] m-auto">
          <Flex className="gap-6 mt-10">
            <Button
              className="w-full"
              disabled={!player1CountDown.isRunning}
              onClick={() =>
                sendMessage({
                  action: 'next_question',
                })
              }
            >
              Next
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full"
              type="primary"
              disabled={!player1CountDown.isRunning}
            >
              Submit
            </Button>
          </Flex>
        </div>
      ) : (
        <Flex className="w-2/5 mx-auto gap-6 mt-14">
          <Button
            onClick={handleStart}
            className="w-full"
            type="primary"
            disabled={status !== 'waiting_start'}
            loading={status === 'waiting_opponent'}
          >
            Play
          </Button>
          <Button
            className="w-full"
            disabled={status === 'waiting_opponent'}
            onClick={() => {
              router.replace('/home')
            }}
          >
            Quit
          </Button>
        </Flex>
      )}
      <Modal
        width={700}
        open={!!result}
        centered
        closeIcon={null}
        destroyOnClose
        footer={
          <Flex justify="space-between" align="center" className="pt-6 pb-2">
            <Button>
              Ready ({currentTopicIndex}/{roomData?.topics.length})
            </Button>
            <Flex gap={16}>
              <Button className="w-32" onClick={() => router.replace('/home')}>
                Quit
              </Button>
              {currentTopicIndex !== roomData?.topics.length && (
                <Button
                  type="primary"
                  className="w-32"
                  disabled={isReadyForNextTopic}
                  onClick={() => {
                    sendMessage({
                      action: 'ready',
                    })
                    setIsReadyForNextTopic(true)
                    setResult(null)
                  }}
                >
                  Play
                </Button>
              )}
            </Flex>
          </Flex>
        }
      >
        <Flex align="center" justify="space-evenly" className="py-5 text-2xl font-bold">
          <p className={`${result === 'WIN' ? 'text-green-600' : ''}`}>YOU {result}</p>
          <p className="border rounded-full px-3 py-2">+ {result === 'WIN' ? '20' : '0'}elo</p>
        </Flex>
        {currentTopicIndex !== roomData?.topics.length && (
          <NextTopic id={roomData?.topics[currentTopicIndex]} />
        )}
      </Modal>

      <Modal
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        destroyOnClose
        width={800}
      >
        <EditRoom onCancel={() => setIsEditing(false)} onFinish={() => {}} />
      </Modal>
      <BgPlaySound />
    </Content>
  )
}
