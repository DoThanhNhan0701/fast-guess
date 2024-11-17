import { Modal as ModalAntd, ModalProps } from 'antd'

function Modal({ width = '500px', ...props }: ModalProps) {
  return <ModalAntd width={width} footer={[]} {...props}></ModalAntd>
}

export default Modal
