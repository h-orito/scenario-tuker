'use client'

import { fetchGameSystems } from '@/components/api/game-system-api'
import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

type Props = {
  selected: GameSystem | null
  setSelected: (value: GameSystem | null) => void
}
const GameSystemSelect = ({ selected, setSelected }: Props) => {
  const [options, setOptions] = useState<GameSystem[]>([])

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

  const handleChange = (value: SingleValue<GameSystem>) => {
    setSelected(value)
  }

  return (
    <Select
      form='__gamesystem' // メニュー非表示時のEnterを押下でform submitされるのを防ぐ
      isClearable
      options={options}
      filterOption={(option, rawInput) =>
        handleFilterOption(option.data, rawInput)
      }
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(gs) => gs.id.toString()}
      placeholder='ゲームシステム検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default GameSystemSelect
