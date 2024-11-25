'use client'

import { useState } from 'react'
import { Form, message } from 'antd'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import InputPassword from '~/components/common/InputPassword'

import { endpointAuth } from '~/services/endpoint'
import { postRequest } from '~/services/request'
import { actionLogin } from '~/store/slice/auth'
import { Role } from '~/helper/enum/role'

export default function Signin({ onChangeTab }: { onChangeTab: () => void }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formLogin] = Form.useForm()

  const onFinish = (values: any) => {
    setLoading(true)
    postRequest(endpointAuth.LOGIN, {
      data: {
        account: values.email,
        password: values.password,
      },
    })
      .then((res: any) => {
        if (res.user.role === Role.STUDENT) {
          message.error('Invalid account')
          return
        }
        dispatch(
          actionLogin({
            refresh: res.refresh,
            access: res.access,
            userInfo: {
              id: res.user.id,
              is_active: res.user.is_active,
              is_staff: res.user.is_staff,
              is_superuser: res.user.is_superuser,
              language: res.user.language,
              account: res.user.account,
              last_login: res.user.last_login,
              name: res.user.name,
              role: res.user.role,
              surname: res.user.surname,
            },
          }),
        )
        message.success('Login successfully')
        router.push('/topics')
        setLoading(false)
      })
      .catch(() => {
        message.error('Invalid account')
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <h2 className="text-center font-semibold text-4xl text-[#41c6cb]">Sign in</h2>
      <Form
        form={formLogin}
        initialValues={{
          email: '',
          password: '',
        }}
        onFinish={onFinish}
        className="mt-4 mx-auto max-w-md"
      >
        <Form.Item
          name={'email'}
          validateFirst
          rules={[
            {
              required: true,
            },
            {
              type: 'email',
            },
          ]}
        >
          <Input placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item
          name={'password'}
          validateFirst
          rules={[
            {
              required: true,
              min: 6,
              max: 30,
            },
          ]}
        >
          <InputPassword placeholder="Password" size="large" />
        </Form.Item>
        <Button
          loading={loading}
          type="primary"
          size="large"
          className="w-full mt-2 bg-[#5d59bf]"
          htmlType="submit"
        >
          Sign in
        </Button>
      </Form>
      <p className="text-center mt-3 font-semibold">
        No account yet?{' '}
        <span className="underline cursor-pointer" onClick={onChangeTab}>
          Sign up
        </span>
      </p>
      <p className="underline mt-1 text-center">Forgot your password</p>
    </div>
  )
}
