'use client'

import { fetchGameSystems } from '@/components/api/game-system-api'
import { useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select'

type Props = {
  isClearable?: boolean
  selected: GameSystem[]
  setSelected: (value: GameSystem[]) => void
}
const GameSystemsSelect = ({
  isClearable = true,
  selected,
  setSelected
}: Props) => {
  const [options, setOptions] = useState<GameSystem[]>([])

  const handleChange = (value: MultiValue<GameSystem>) => {
    setSelected(value.map((v) => v))
  }

  useEffect(() => {
    const fetch = async () => {
      const gameSystems = await fetchGameSystems()
      setOptions(gameSystems.list)
    }
    fetch()
  }, [])

  const handleFilterOption = (
    option: GameSystem,
    rawInput: string
  ): boolean => {
    return option.dictionary_names.some((dn) => dn.includes(rawInput))
  }

  return (
    <Select
      form='__scenario' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable={isClearable}
      isMulti
      options={options}
      filterOption={(option, rawInput) =>
        handleFilterOption(option.data, rawInput)
      }
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(s) => s.id.toString()}
      placeholder='ゲームシステム検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default GameSystemsSelect
