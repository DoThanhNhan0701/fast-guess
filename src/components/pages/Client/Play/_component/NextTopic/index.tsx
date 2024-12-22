import { Image } from 'antd'
import { useEffect, useState } from 'react'
import { ITopic } from '~/models/common'
import { endpointBase } from '~/services/endpoint'
import { getRequest } from '~/services/request'

export default function NextTopic({ id }: { id?: string }) {
  const [topic, setTopic] = useState<ITopic | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const response = await getRequest<ITopic>(`${endpointBase.TOPIC}${id}/`)
        setTopic(response)
      } catch (error) {}
    })()
  }, [id])

  return (
    <div className="rounded-3xl border p-5">
      <p className="text-center">NEXT TOPIC</p>

      <div className="flex justify-center">
        <Image
          preview={false}
          className="object-cover mx-auto block"
          src={topic?.banner}
          width={200}
          height={200}
          alt=""
        />
      </div>

      <p className="text-2xl font-bold text-center mt-2">
        {topic?.count_image} Images
        <br />
        {topic?.name}
      </p>
    </div>
  )
}
