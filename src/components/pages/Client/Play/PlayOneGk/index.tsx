'use client'

import { useParams, useRouter } from 'next/navigation'
import { Col, Flex, Image, Modal, Row, Tooltip, message } from 'antd'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

import Button from '~/components/common/Button'
import Content from '~/components/common/Content'
import { accessToken, domainSocket } from '~/helper/contant'
import { useWebSocket } from '~/hook/useWebSocket'
import { IRoom, TWsEvent } from '~/models/common'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useCountDown } from '~/hook/useCountDown'
import { Topic } from '../../Setting'
import { getRequest } from '~/services/request'
import { endpointBase } from '~/services/endpoint'
import { actionPlaySound } from '~/store/slice/app'
import BgPlaySound from '~/components/common/BgPlaySound'
import NextTopic from '../_component/NextTopic'

export default function PlayOneGk() {
  const router = useRouter()
  const { id: roomID } = useParams()

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [roomData, setRoomData] = useState<IRoom | null>(null)
  const [roomTopic, setRoomTopic] = useState<null | Topic>(null)

  const [currentStatus, setCurrentStatus] = useState<'NEED_START' | 'WAITING' | null>(null)
  const [currentRole, setCurrentRole] = useState<'player' | 'examiner' | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [status, setStatus] = useState<
    'notAvailable' | 'waiting_opponent' | 'waiting_start' | 'playing'
  >('notAvailable')
  const [winner, setWinner] = useState<string | null>(null)

  const [users, setUsers] = useState<{
    gk: null | any
    user1: null | any
    user2: null | any
  }>({
    gk: null,
    user1: null,
    user2: null,
  })
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(0)
  const [isReadyForNextTopic, setIsReadyForNextTopic] = useState(false)

  const player1CountDown = useCountDown(roomData?.time || 61)
  const player2CountDown = useCountDown(roomData?.time || 61)

  const handleSwitchTurn = () => {
    if (!player2CountDown.isRunning) {
      player1CountDown.pauseCountDown()
      player2CountDown.startCountDown()
    } else {
      player2CountDown.pauseCountDown()
      player1CountDown.startCountDown()
    }
  }

  const handleNextTopic = () => {
    player1CountDown.setTime(roomData!.time)
    player2CountDown.setTime(roomData!.time)
    setWinner(null)
  }

  const handleMessage = (data: TWsEvent<any>) => {
    console.log(data)

    switch (data.type) {
      case 'start':
        setCurrentStatus(null)
        message.success(data.message)
        setStatus('playing')
        setCurrentTopicIndex((prev) => prev + 1)
        setIsReadyForNextTopic(false)

        if (data.current_turn === users.user1) player1CountDown.startCountDown()
        else if (data.current_turn === users.user2) player2CountDown.startCountDown()

        break

      case 'question':
        setCurrentImage(data.question)
        break

      case 'error':
        message.error(data.message)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 1000)
        break
      case 'turn':
        if (player1CountDown.isRunning || player2CountDown.isRunning) {
          dispatch(actionPlaySound('correct'))
        }
        handleSwitchTurn()
        message.success(data.message)
        break

      case 'user_joined':
        setCurrentRole(data.role!)
        if (data.role === 'examiner') {
          setUsers((prev) => {
            if (data.players[0]) prev.user1 = data.players[0]
            if (data.players[1]) prev.user2 = data.players[1]

            return {
              ...prev,
              gk: data.username,
            }
          })
        } else {
          setUsers((prev) => {
            if (prev.user1) return { ...prev, user2: data.username }
            return {
              ...prev,
              user1: data.username,
              user2: data.players[0] || null,
            }
          })
        }

        break

      case 'change_role': {
        if ('new_role' in data) {
          if (data.user === userInfo?.username) {
            setCurrentRole(data.new_role)
          }

          if (data.new_role === 'examiner') {
            setUsers((prev) => {
              if (users.user1 === data.user) return { ...prev, gk: data.user, user1: null }
              return { ...prev, gk: data.user, user2: null }
            })
          } else {
            setUsers((prev) => {
              if (prev.user1)
                return {
                  ...prev,
                  user2: data.user,
                }
              return {
                ...prev,
                user1: data.user,
              }
            })
          }
        }

        break
      }

      case 'judgment':
        if (data.judgment === 'incorrect') {
          setIsError(true)
          setTimeout(() => {
            setIsError(false)
          }, 1000)
        }

        if (
          (player1CountDown.isRunning && users.user1 === userInfo?.username) ||
          (player2CountDown.isRunning && users.user2 === userInfo?.username)
        )
          if (data.judgment === 'incorrect') dispatch(actionPlaySound('wrong'))
          else dispatch(actionPlaySound('correct'))

        break

      case 'ready_game':
        if (data.all_ready) {
          if (userInfo?.username === roomData?.created_by.username) setStatus('waiting_start')
        }

        break

      case 'end':
        setWinner(data.winner)
    }
  }

  const { sendMessage } = useWebSocket(
    `ws://${new URL(domainSocket ?? '').host}/ws/game/${roomID}/?token=${accessToken}`,
    handleMessage,
  )

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getRequest<IRoom>(`${endpointBase.ROOM}${roomID}/`)
        player1CountDown.setTime(response.time)
        player2CountDown.setTime(response.time)
        setRoomData(response)
        const roomTopic = await getRequest<Topic>(`${endpointBase.TOPIC}${response.topics[0]}/`)
        setRoomTopic(roomTopic)
      } catch (error) {}
    })()
  }, [])

  useEffect(() => {
    if (
      users.gk &&
      users.user1 &&
      users.user2 &&
      userInfo?.username === roomData?.created_by.username
    ) {
      setStatus('waiting_start')
    }
  }, [userInfo, users, roomData])

  const handleStart = () => {
    console.log('start game')
    sendMessage({
      action: 'start_game',
    })
  }

  const handleChangeRole = (role: 'examiner' | 'player') => {
    console.log(role)

    sendMessage({
      action: 'change_role',
      role,
    })
  }

  const handleJudgment = (judgment: 'correct' | 'incorrect') => {
    sendMessage({
      action: 'judgment',
      judgment,
    })
  }

  return (
    <Content
      layout="client"
      breadcrumb={[
        {
          title: <HomeOutlined />,
        },
        {
          title: 'Play One One and Gk',
        },
      ]}
    >
      <Flex justify="space-between">
        <p className="font-bold text-2xl">ID: {roomID}</p>
        <SettingOutlined className="text-2xl" />
      </Flex>
      <h1 className="text-4xl font-bold py-2 text-center">Fast Guess</h1>

      <Row align={'middle'} className="justify-center mb-10">
        <Col
          span={5}
          className={twMerge(
            'flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl',
            player1CountDown.isRunning && 'border-gray-900 shadow-gray-300',
            isError && player1CountDown.isRunning && 'border-red-500 shadow shadow-red-300',
          )}
        >
          <Image
            width={74}
            height={74}
            preview={false}
            className="rounded-xl"
            src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl ">
            {users.user1}
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
            player2CountDown.isRunning && 'border-gray-900 shadow-gray-300',
            isError && player2CountDown.isRunning && 'border-red-500 shadow shadow-red-300',
          )}
        >
          <Image
            width={74}
            height={74}
            preview={false}
            className="rounded-xl"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDso3YjdjeD_8tA6vVacoI3ogd6YqF-VfyGiylBV2v6-zitJretXOtsLvJ5UZDrlNs7nc&usqp=CAU"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
            {users.user2}
          </p>
        </Col>
      </Row>

      {status === 'playing' && (
        <Row align={'middle'} gutter={36} className="justify-center max-w-[80%] !m-auto">
          <Col span={5} className="flex items-center justify-center flex-col gap-2 ">
            <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
              {player1CountDown.time}
            </p>
          </Col>
          <Col span={14} className="flex items-center justify-center"></Col>
          <Col span={5} className="flex items-center justify-center flex-col gap-2 ">
            <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
              {player2CountDown.time}
            </p>
          </Col>
        </Row>
      )}

      {status === 'playing' ? (
        users.gk === userInfo?.username && (
          <div className="max-w-[40%] m-auto">
            <Flex className="gap-6 mt-10">
              <Button className="w-full" type="primary" onClick={() => handleJudgment('correct')}>
                Right
              </Button>
              <Button className="w-full" type="default" onClick={() => handleJudgment('incorrect')}>
                Wrong
              </Button>
            </Flex>
            <Button
              onClick={() => router.push('/play-one-gk/4/result')}
              className="w-full mt-6"
              type="primary"
            >
              Next
            </Button>
          </div>
        )
      ) : (
        <Flex className="w-2/5 mx-auto gap-6 mt-14">
          <Button
            className="w-full"
            type="primary"
            disabled={status !== 'waiting_start'}
            loading={status === 'waiting_opponent'}
            onClick={handleStart}
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

      <Flex justify="center" className="mt-8">
        <div className="flex items-center justify-center flex-col gap-2 border-[2px] p-6 max-w-[200px] rounded-2xl min-w-48">
          {currentRole === 'examiner' ? (
            <Image
              width={74}
              height={74}
              preview={false}
              className="rounded-xl"
              src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
            />
          ) : (
            <Tooltip title="Select this role (gk)">
              <button
                className="w-[74px] aspect-square rounded-full bg-gray-300"
                onClick={() => handleChangeRole('examiner')}
              ></button>
            </Tooltip>
          )}
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl ">
            {users.gk || '---'}
          </p>
        </div>
      </Flex>

      <Modal
        width={700}
        open={!!winner}
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
                    setWinner(null)
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
          {users.gk === userInfo?.username ? (
            <p className="py-5 text-2xl font-semibold">
              Winner: <span className="font-bold text-green-600">{winner}</span>
            </p>
          ) : (
            <>
              <p className={`${winner === userInfo?.username ? 'text-green-600' : ''}`}>
                YOU {winner === userInfo?.username ? 'WIN' : 'LOSE'}
              </p>
              <p className="border rounded-full px-3 py-2">
                + {winner === userInfo?.username ? '20' : '0'}elo
              </p>
            </>
          )}
        </Flex>
        {currentTopicIndex !== roomData?.topics.length && (
          <NextTopic id={roomData?.topics[currentTopicIndex]} />
        )}
      </Modal>
      <BgPlaySound />
    </Content>
  )
}
