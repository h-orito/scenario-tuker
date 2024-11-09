'use client'

import {
  fetchGameSystems,
  searchGameSystems
} from '@/components/api/game-system-api'
import { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'

type Props = {
  selected: GameSystem | null
  setSelected: (value: GameSystem | null) => void
}
const GameSystemSelect = ({ selected, setSelected }: Props) => {
  const debouncedLoad = async (name: string) => {
    if (name == null || name === '') {
      const gameSystems = await fetchGameSystems()
      return gameSystems.list
    } else {
      const gameSystems = await searchGameSystems({
        name
      })
      return gameSystems.list
    }
  }

  const handleChange = (value: SingleValue<GameSystem>) => {
    setSelected(value)
  }

  return (
    <AsyncSelect
      form='__gamesystem' // メニュー非表示時のEnterを押下でform submitされるのを防ぐ
      isClearable
      cacheOptions
      defaultOptions
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(gs) => gs.id.toString()}
      loadOptions={debouncedLoad}
      placeholder='ゲームシステム検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default GameSystemSelect
