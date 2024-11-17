import { Input as InputAntd, InputProps } from 'antd'

export default function Input(props: InputProps) {
  return (
    <InputAntd
      rootClassName="!rounded-[10px] h-[42px] bg-gradient-to-r from-purple-500 via-pink-500 
                      to-red-500 rounded-xl transition ease-in-out delay-150 bg-blue-50 font-bold"
      {...props}
    />
  )
}
