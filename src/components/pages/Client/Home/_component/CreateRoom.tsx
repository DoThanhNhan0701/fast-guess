import { Flex, Image } from 'antd'
import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal'

interface Props {
  open: boolean
  handelClose: () => void
}

export default function CreateRoom({ open, handelClose }: Props) {
  return (
    <Modal width={700} open={open} onCancel={handelClose} title="Create room">
      <div className="flex overflow-x-auto gap-5">
        {[0, 1, 2, 3, 4, 5].map((item, idx) => (
          <div
            key={idx}
            className="min-w-[230px] p-5 relative border-[2px] border-[rgb(96,_11,_118)] rounded-2xl cursor-pointer"
          >
            <Image
              width={74}
              preview={false}
              className="rounded-xl"
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <div className="py-[10px]">
              <p className="text-2xl font-extrabold">{`Room ${item}`}</p>
              <p className="text-sm font-bold">300 Image</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between max-w-[400px] m-auto mt-6">
        <p className="text-2xl font-bold">Model</p>
        <p className="text-2xl font-bold">Time: 60s</p>
      </div>

      <Flex className="gap-6">
        <Button onClick={handelClose} className="w-full mt-6" type="default">
          Cancel
        </Button>
        <Button className="w-full mt-6" type="primary">
          Create
        </Button>
      </Flex>
    </Modal>
  )
}
