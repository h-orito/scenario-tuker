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
  const handleLoadOptions = async (name: string): Promise<GameSystem[]> => {
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
      cacheOptions
      defaultOptions
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(gs) => gs.id.toString()}
      loadOptions={handleLoadOptions}
      placeholder='文字入力で検索できます'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default GameSystemSelect
