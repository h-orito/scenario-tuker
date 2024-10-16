'use client'

import { Control } from 'react-hook-form'
import { ScenarioFormInput } from './scenario-form-input'
import InputNumber from '@/components/form/input-number'

type Props = {
  control: Control<ScenarioFormInput, any>
  getPlayerCountMin: () => string
  getPlayerCountMax: () => string
  setPlayerCountMin: (value: string) => void
  setPlayerCountMax: (value: string) => void
}

const ScenarioPlayerCount = ({
  control,
  getPlayerCountMin,
  getPlayerCountMax,
  setPlayerCountMin,
  setPlayerCountMax
}: Props) => {
  return (
    <div className='flex justify-center gap-2 md:gap-4'>
      <InputNumber
        control={control}
        name='playerCountMin'
        rules={{
          validate: {
            lessThan: async (value) => {
              const max = getPlayerCountMax()
              if (max && value > max) {
                return '最大人数以下で入力してください'
              }
              return undefined
            }
          }
        }}
        min={1}
        setValue={setPlayerCountMin}
        innerClassName='w-16'
      />
      <div className='my-auto'>～</div>
      <InputNumber
        control={control}
        name='playerCountMax'
        rules={{
          validate: {
            greaterThan: async (value) => {
              const min = getPlayerCountMin()
              if (min && value < min) {
                return '最小人数以上で入力してください'
              }
              return undefined
            }
          }
        }}
        min={1}
        setValue={setPlayerCountMax}
        innerClassName='w-16'
      />
    </div>
  )
}
export default ScenarioPlayerCount
