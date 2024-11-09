'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { searchScenarios } from '@/components/api/scenario-api'
import { useEffect, useMemo, useState } from 'react'
import Select, { MultiValue } from 'react-select'

type Props = {
  gameSystemId: number | null
  scenarioType: ScenarioType
  selected: ScenarioResponse[]
  setSelected: (value: ScenarioResponse[]) => void
}
const ScenariosSelect = ({
  gameSystemId,
  scenarioType,
  selected,
  setSelected
}: Props) => {
  const [options, setOptions] = useState<ScenarioResponse[]>([])

  const filteredOptions = useMemo(() => {
    if (!gameSystemId) return options
    return options.filter((o) => o.game_system?.id === gameSystemId)
  }, [options, gameSystemId])

  const handleChange = (value: MultiValue<ScenarioResponse>) => {
    setSelected(value.map((v) => v))
  }

  useEffect(() => {
    const fetch = async () => {
      const scenarios = await searchScenarios({
        name: null,
        game_system_id: null,
        game_system_name: null,
        type: scenarioType ? scenarioType.value : null,
        author_name: null,
        player_num: null,
        player_num_empty: true
      })
      setOptions(scenarios.list)
    }
    fetch()
  }, [scenarioType])

  const handleFilterOption = (
    option: ScenarioResponse,
    rawInput: string
  ): boolean => {
    return option.name.includes(rawInput)
  }

  return (
    <Select
      form='__scenario' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable
      isMulti
      options={filteredOptions}
      filterOption={(option, rawInput) =>
        handleFilterOption(option.data, rawInput)
      }
      value={selected}
      getOptionLabel={(s) =>
        `${s.name}${s.game_system?.name ? `（${s.game_system.name}）` : ''}`
      }
      getOptionValue={(s) => s.id.toString()}
      placeholder='シナリオ検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default ScenariosSelect
