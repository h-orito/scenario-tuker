'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { searchScenarios } from '@/components/api/scenario-api'
import { useEffect, useMemo, useState } from 'react'
import Select, { SingleValue } from 'react-select'

type Props = {
  gameSystemId?: number | null
  gameSystemIds?: number[] | null
  scenarioType: ScenarioType
  selected: ScenarioResponse | null
  setSelected: (value: ScenarioResponse | null) => void
}
const ScenarioSelect = ({
  gameSystemId,
  gameSystemIds,
  scenarioType,
  selected,
  setSelected
}: Props) => {
  const [options, setOptions] = useState<ScenarioResponse[]>([])

  const filteredOptions = useMemo(() => {
    if (!!gameSystemId) {
      return options.filter((o) =>
        o.game_systems.some((gs) => gs.id === gameSystemId)
      )
    } else if (!!gameSystemIds) {
      return options.filter((o) =>
        o.game_systems.every((gs) => gameSystemIds.includes(gs.id))
      )
    }
    return options
  }, [options, gameSystemId, gameSystemIds])

  const handleChange = (value: SingleValue<ScenarioResponse>) => {
    setSelected(value)
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
    return option.dictionary_names.some((dn) => dn.includes(rawInput))
  }

  return (
    <Select
      form='__scenario' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable
      options={filteredOptions}
      filterOption={(option, rawInput) =>
        handleFilterOption(option.data, rawInput)
      }
      value={selected}
      getOptionLabel={(s) =>
        `${s.name}${
          s.game_systems && s.game_systems.length > 0
            ? `（${s.game_systems.map((gs) => gs.name).join('、')}）`
            : ''
        }`
      }
      getOptionValue={(s) => s.id.toString()}
      placeholder='シナリオ検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default ScenarioSelect
