'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { Col, Flex, Image, message, Modal, Row, Spin } from 'antd'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'

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

export default function PlayOneOne() {
  const router = useRouter()
  const { id: roomID } = useParams()
  const wsUrl = `ws://${new URL(domainSocket ?? '').host}/ws/game/${roomID}/?token=${accessToken}`
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [roomData, setRoomData] = useState<IRoom | null>(null)
  const [answer, setAnswer] = useState('')
  const [opponent, setOpponent] = useState<string | null>(null)

  const [currentStatus, setCurrentStatus] = useState<'NEED_START' | 'WAITING' | null>(null)

  const player1CountDown = useCountDown(roomData?.time || 61)
  const player2CountDown = useCountDown(roomData?.time || 61)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [result, setResult] = useState<'WIN' | 'LOSE' | null>(null)
  const [joinedUser, setJoinedUser] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const handleSwitchTurn = () => {
    if (!player2CountDown.isRunning) {
      player1CountDown.pauseCountDown()
      player2CountDown.startCountDown()
    } else {
      player2CountDown.pauseCountDown()
      player1CountDown.startCountDown()
    }
  }

  const handleMessage = (data: TWsEvent<any>) => {
    console.log(data)

    switch (data.type) {
      case 'start':
        setCurrentStatus(null)
        message.success(data.message)
        setOpponent(data.players.find((name) => name !== userInfo!.username)!)
        if (data.current_turn === userInfo?.username) player1CountDown.startCountDown()
        else player2CountDown.startCountDown()
        break

      case 'question':
        setCurrentImage(data.question)
        break

      case 'error':
        message.error(data.message)
        setIsError(true)
        break
      case 'turn':
        setAnswer('')
        handleSwitchTurn()
        message.success(data.message)
        break

      case 'user_joined':
        if (data.username !== userInfo?.username) setCurrentStatus('NEED_START')
        setJoinedUser(data.username)
        break

      case 'end':
        if (data.winner === userInfo?.username) setResult('WIN')
        else setResult('LOSE')
    }
  }

  const { sendMessage } = useWebSocket(wsUrl, handleMessage)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getRequest<IRoom>(`${endpointBase.ROOM}${roomID}/`)
        player1CountDown.setTime(response.time)
        player2CountDown.setTime(response.time)
        setRoomData(response)
      } catch (error) {}
    })()
  }, [])

  useEffect(() => {
    if (roomData && roomData.created_by.username !== userInfo?.username) setCurrentStatus('WAITING')
  }, [roomData])

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
        },
        {
          title: 'Play One and One',
        },
      ]}
    >
      <Flex justify="space-between">
        <p className="font-bold text-2xl">ID: 1111</p>
        <SettingOutlined className="text-2xl" />
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
            className="rounded-xl"
            src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl ">
            {userInfo?.username}
          </p>
        </Col>

        <Col span={14} className="flex items-center justify-center">
          {/* Topic */}
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
          <div className={twMerge(player2CountDown.isRunning && 'text-[#15683b] font-semibold')}>
            -----------------------
          </div>
          <FaLongArrowAltRight
            className={twMerge('text-3xl', player2CountDown.isRunning && 'text-[#15683b]')}
          />
          {/* End topic */}
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
            className="rounded-xl"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDso3YjdjeD_8tA6vVacoI3ogd6YqF-VfyGiylBV2v6-zitJretXOtsLvJ5UZDrlNs7nc&usqp=CAU"
          />
          <p className="font-bold text-xl px-4 py-2 border-[2px] border-[#000] rounded-2xl">
            {opponent ?? '...'}
          </p>
        </Col>
      </Row>

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
            onChange={(e) => {
              setAnswer(e.target.value)
              setIsError(false)
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
      <div className="max-w-[40%] m-auto">
        <Flex className="gap-6 mt-10">
          <Button
            onClick={handleSubmit}
            className="w-full"
            type="default"
            disabled={!player1CountDown.isRunning}
          >
            Submit
          </Button>
          <Button className="w-full" type="primary" disabled={!player1CountDown.isRunning}>
            Next
          </Button>
        </Flex>
      </div>
      <Modal
        width={700}
        open={!!result}
        centered
        closeIcon={null}
        destroyOnClose
        footer={
          <Flex justify="space-between" align="center" className="pt-6 pb-2">
            <Button>Ready (1/2)</Button>
            <Flex gap={16}>
              <Button className="w-32" onClick={() => router.replace('/home')}>
                Quit
              </Button>
              <Button type="primary" className="w-32">
                Play
              </Button>
            </Flex>
          </Flex>
        }
      >
        <Flex align="center" justify="space-evenly" className="py-5 text-2xl font-bold">
          <p className={`${result === 'WIN' ? 'text-green-600' : ''}`}>YOU {result}</p>
          <p className="border rounded-full px-3 py-2">+ {result === 'WIN' ? '20' : '0'}elo</p>
        </Flex>
        <div className="rounded-3xl border p-5">
          <p className="text-center">NEXT TOPIC</p>

          <div className="flex justify-center">
            <Image
              preview={false}
              className="object-cover mx-auto block"
              src="https://img.freepik.com/free-vector/flags-different-countries-speech-bubble-shape_23-2147862139.jpg?semt=ais_hybrid"
              width={200}
              height={200}
              alt=""
            />
          </div>

          <p className="text-2xl font-bold text-center mt-2">
            300 Images
            <br />
            Animal
          </p>
        </div>
      </Modal>
      <Modal open={!!currentStatus} centered destroyOnClose footer={null} closable={false}>
        {currentStatus === 'NEED_START' ? (
          <div>
            <p className="text-xl text-center font-semibold">Start game</p>
            <p className="text-lg">
              <span className="font-bold text-green-950 text-xl">{joinedUser}</span> has join this
              room. Let start now!
            </p>
            <Button type="primary" size="large" className="w-full mt-5" onClick={handleStart}>
              Start game
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-center text-xl font-semibold">Waiting for host</p>
            <Flex justify="center" align="center" className="aspect-video">
              <Spin />
            </Flex>
            <p className="text-center font-bold">This game will start when host start game</p>
          </div>
        )}
      </Modal>
    </Content>
  )
}
