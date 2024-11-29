import Link from 'next/link'
import { Form, message } from 'antd'
import { useState } from 'react'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import InputPassword from '~/components/common/InputPassword'

import { endpointAuth } from '~/services/endpoint'
import { postRequest } from '~/services/request'
import { useRouter } from 'next/navigation'

export default function Signup({ onChangeTab }: { onChangeTab: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    setLoading(true)
    postRequest(endpointAuth.REGISTER, {
      data: {
        username: values.username,
        email: values.email,
        password1: values.password,
        password2: values.password,
      },
    })
      .then((res: any) => {
        message.success(`${values.username} Register successfully `)
        router.push(`/auth?tab=SIGNIN`)
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
    <div>
      <h2 className="text-center font-semibold text-4xl text-[#41c6cb]">Sign up</h2>
      <Form
        form={form}
        initialValues={{
          email: '',
          password: '',
          username: '',
        }}
        onFinish={onFinish}
        className="mt-4 mx-auto max-w-md"
      >
        <Form.Item
          name={'username'}
          validateFirst
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Username" size="large" />
        </Form.Item>
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
        <Form.Item
          name={'confirm_password'}
          validateFirst
          dependencies={['password']}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Confirm password not match!'))
              },
            }),
          ]}
        >
          <InputPassword placeholder="Confirm password" size="large" />
        </Form.Item>
        <Button
          loading={loading}
          type="primary"
          size="large"
          className="w-full mt-2 bg-[#5d59bf]"
          htmlType="submit"
        >
          Create account
        </Button>
      </Form>
      <p className="text-center mt-3 font-semibold">
        Already got your account?
        <span className="underline cursor-pointer" onClick={onChangeTab}>
          Sign
        </span>
      </p>
      <p className="text-sm mt-4 text-slate-700 text-center">
        You want your school to join the project? Contact us at this email:
        <Link href={'mailto:linthuhai@gmail.com'}>fastguess@gmail.com</Link>
      </p>
    </div>
  )
}
