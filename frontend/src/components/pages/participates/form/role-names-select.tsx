'use client'

import { MultiValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'

type Props = {
  selected: string[]
  setSelected: (value: string[]) => void
}

const candidates: { label: string; value: string }[] = [
  'GM',
  'GM可',
  'KP',
  'KP可',
  'PL',
  '視聴',
  '現行',
  '参加',
  '通過予定',
  ...[...Array(15)].map((_, i) => `HO${i + 1}`),
  ...[...Array(15)].map((_, i) => `PC${i + 1}`)
].map((c) => ({ label: c, value: c }))

const RoleNamesSelect = ({ selected, setSelected }: Props) => {
  const handleChange = (
    value: MultiValue<{ label: string; value: string }>
  ) => {
    setSelected(value.map((v) => v.value))
  }

  return (
    <CreatableSelect
      isMulti
      form='__role_names' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      value={selected.map((s) => ({ label: s, value: s }))}
      options={candidates}
      placeholder='自由入力'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
      formatCreateLabel={(inputValue) => `新規: ${inputValue}`}
      isValidNewOption={(inputValue) =>
        inputValue.length > 0 && inputValue.length <= 50
      }
      onKeyDown={(event) => {
        event.stopPropagation()
      }}
    />
  )
}
export default RoleNamesSelect
