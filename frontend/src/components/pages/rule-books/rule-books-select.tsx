'use client'

import { AllRuleBookType } from '@/@types/rule-book-type'
import { fetchRuleBooks } from '@/components/api/rule-book-api'
import { useEffect, useMemo, useState } from 'react'
import Select, { MultiValue } from 'react-select'

type Props = {
  gameSystemId: number | null
  gameSystemIds?: number[] | null
  selected: RuleBookResponse[]
  setSelected: (value: RuleBookResponse[]) => void
}
const RuleBooksSelect = ({
  gameSystemId,
  gameSystemIds,
  selected,
  setSelected
}: Props) => {
  const [options, setOptions] = useState<RuleBookResponse[]>([])

  const handleChange = (value: MultiValue<RuleBookResponse>) => {
    setSelected(value.map((v) => v))
  }

  useEffect(() => {
    const fetch = async () => {
      const ruleBooks = await fetchRuleBooks()
      setOptions(
        ruleBooks.list.map((r) => ({ ...r, game_system_id: r.game_system.id }))
      )
    }
    fetch()
  }, [])

  const filteredOptions = useMemo(() => {
    if (!!gameSystemId) {
      return options.filter((o) => o.game_system.id === gameSystemId)
    } else if (!!gameSystemIds) {
      return options.filter((o) => gameSystemIds.includes(o.game_system.id))
    }
    return options
  }, [gameSystemId, gameSystemIds, options])

  const handleFilterOption = (
    option: RuleBookResponse,
    rawInput: string
  ): boolean => {
    return option.dictionary_names.some((dn) => dn.includes(rawInput))
  }

  return (
    <Select
      form='__rulebooks' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable
      isMulti
      options={filteredOptions}
      filterOption={(option, rawInput) =>
        handleFilterOption(option.data, rawInput)
      }
      value={selected}
      getOptionLabel={(gs) =>
        `${gs.name}（${AllRuleBookType.find((t) => t.value === gs.type)?.label}）`
      }
      getOptionValue={(gs) => gs.id.toString()}
      placeholder='ルールブック検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default RuleBooksSelect
