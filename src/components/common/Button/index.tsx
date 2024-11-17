import { Button as ButtonAntd, ButtonProps } from 'antd'

export default function Button(props: ButtonProps) {
  return <ButtonAntd rootClassName="h-[42px] rounded-xl font-bold" {...props} />
}
