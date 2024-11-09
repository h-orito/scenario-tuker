'use client'

import { fetchRuleBooks, searchRuleBooks } from '@/components/api/rule-book-api'
import { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'

type Props = {
  selected: RuleBookResponse | null
  setSelected: (value: RuleBookResponse | null) => void
}
const RuleBookSelect = ({ selected, setSelected }: Props) => {
  const handleLoadOptions = async (
    name: string
  ): Promise<RuleBookResponse[]> => {
    if (name == null || name === '') {
      const ruleBooks = await fetchRuleBooks()
      return ruleBooks.list
    } else {
      const ruleBooks = await searchRuleBooks({
        name,
        game_system_id: null,
        game_system_name: null,
        rule_book_type: null
      })
      return ruleBooks.list
    }
  }

  const handleChange = (value: SingleValue<RuleBookResponse>) => {
    setSelected(value)
  }

  return (
    <AsyncSelect
      form='__rulebook' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable
      cacheOptions
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(gs) => gs.id.toString()}
      loadOptions={handleLoadOptions}
      placeholder='ルールブック検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default RuleBookSelect
