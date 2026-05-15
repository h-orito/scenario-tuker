'use client'

import { Control } from 'react-hook-form'
import { ScenarioFormInput } from './scenario-form-input'
import InputNumber from '@/components/form/input-number'

type Props = {
  control: Control<ScenarioFormInput, any>
  setValue: (value: string) => void
}

const ScenarioPlayTime = ({ control, setValue }: Props) => {
  return (
    <InputNumber
      className='flex justify-center'
      control={control}
      name='playTime'
      min={1}
      setValue={setValue}
    />
  )
}
export default ScenarioPlayTime
