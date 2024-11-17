'use client'

import { useState } from 'react'
import { Button, Col, Flex, Row, message } from 'antd'
import { useSearchParams, useRouter as routerChangeTab, useRouter } from 'next/navigation'

import Signin from './Signin'
import Signup from './Signup'
import OtpInput from 'react-otp-input'

import { postRequest } from '~/services/request'
import { endpointAuth } from '~/services/endpoint'
import { updateSearchParams } from '~/utils/updateSearchParams'

export default function Auth() {
  const router = useRouter()
  const routerTab = routerChangeTab()
  const useSearchParam = useSearchParams()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const tabForm = useSearchParam.get('tab') || 'SIGNIN'
  const email = useSearchParam.get('email')

  const onChange = (key: string) => {
    routerTab.push(updateSearchParams('tab', '' + key))
  }

  const onFinish = () => {
    if (!otp) return message.error('Please input verifi code')
    setLoading(true)
    postRequest(endpointAuth.VERIFI, {
      data: {
        email: email,
        verify_code: otp,
      },
    })
      .then(() => {
        message.success('Verifi successfully')
        router.push('/auth?tab=SIGNIN')
        setLoading(false)
      })
      .catch((res: any) => {
        message.error(res?.response?.data?.message || 'System error')
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      {tabForm === 'VERIFI' ? (
        <Flex justify="center" align="center" className="min-h-[100dvh] flex ">
          <div
            style={{ zIndex: 100 }}
            className="!bg-white !z-100 p-4 sm:p-8 md:p-10 rounded-3xl shadow-xl max-w-[min(600px,calc(100dvw-16px))] w-full"
          >
            <Row className="[&>div]:text-2xl font-medium">
              <h3 className="text-2xl text-center w-full pb-4">
                Please check your mailbox and enter the OTP for verify your account
              </h3>
              <OtpInput
                value={otp}
                containerStyle="w-full flex justify-between"
                inputStyle="border border-gray-300 p-1 text-center outline-none !w-20 !h-20  rounded-2xl"
                onChange={setOtp}
                numInputs={4}
                inputType="number"
                renderInput={(props) => <input {...props} />}
              />
            </Row>

            <Button
              onClick={onFinish}
              loading={loading}
              size="large"
              type="primary"
              className="w-full mt-6 bg-[#5d59bf]"
            >
              Verify
            </Button>
          </div>
        </Flex>
      ) : (
        <Flex justify="center" align="center" className="min-h-[100dvh] bg-gray-50 flex">
          <div
            style={{ zIndex: 100 }}
            className="!bg-white !z-100 p-4 sm:p-8 md:p-10 rounded-3xl shadow-xl max-w-[min(600px,calc(100dvw-16px))] w-full"
          >
            <Row className="[&>div]:text-2xl font-medium">
              <Col
                span={12}
                className={`py-2 text-center rounded-full duration-200 cursor-pointer ${
                  tabForm === 'SIGNIN' ? 'bg-green-primary text-white' : 'text-[#41c6cb]'
                }`}
                onClick={() => onChange('SIGNIN')}
              >
                Sign in
              </Col>
              <Col
                span={12}
                className={`py-2 text-center rounded-full duration-200 cursor-pointer ${
                  tabForm === 'SIGNUP' ? 'bg-green-primary text-white' : 'text-[#41c6cb]'
                }`}
                onClick={() => onChange('SIGNUP')}
              >
                Sign up
              </Col>
            </Row>
            <div className="mt-10">
              {tabForm === 'SIGNIN' ? (
                <Signin onChangeTab={() => onChange('SIGNUP')} />
              ) : (
                <Signup onChangeTab={() => onChange('SIGNIN')} />
              )}
            </div>
          </div>
        </Flex>
      )}
    </>
  )
}
