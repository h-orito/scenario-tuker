'use client'

import { fetchRuleBooks } from '@/components/api/rule-book-api'
import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

type Props = {
  selected: RuleBookResponse | null
  setSelected: (value: RuleBookResponse | null) => void
}
const RuleBookSelect = ({ selected, setSelected }: Props) => {
  const [options, setOptions] = useState<RuleBookResponse[]>([])

  useEffect(() => {
    const fetch = async () => {
      const ruleBooks = await fetchRuleBooks()
      setOptions(
        ruleBooks.list.map((r) => ({ ...r, game_system_id: r.game_system.id }))
      )
    }
    fetch()
  }, [])

  const handleChange = (value: SingleValue<RuleBookResponse>) => {
    setSelected(value)
  }

  const handleFilterOption = (
    option: RuleBookResponse,
    rawInput: string
  ): boolean => {
    return option.dictionary_names.some((dn) => dn.includes(rawInput))
  }

  return (
    <Select
      form='__rulebook' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable
      options={options}
      filterOption={(option, rawInput) =>
        handleFilterOption(option.data, rawInput)
      }
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(gs) => gs.id.toString()}
      placeholder='ルールブック検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default RuleBookSelect
