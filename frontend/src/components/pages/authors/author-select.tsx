import { fetchAuthors, searchAuthors } from '@/components/api/author-api'
import { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'

type Props = {
  selected: Author | null
  setSelected: (value: Author | null) => void
}

const AuthorSelect = ({ selected, setSelected }: Props) => {
  const handleLoadOptions = async (name: string): Promise<Author[]> => {
    if (name == null || name === '') {
      const authors = await fetchAuthors()
      return authors.list
    } else {
      const authors = await searchAuthors({
        name
      })
      return authors.list
    }
  }

  const handleChange = (value: SingleValue<Author>) => {
    setSelected(value)
  }

  return (
    <AsyncSelect
      form='__author' // メニュー非表示時のEnter押下でform submitされるのを防ぐ
      isClearable
      cacheOptions
      defaultOptions
      value={selected}
      getOptionLabel={(a) => a.name}
      getOptionValue={(a) => a.id.toString()}
      loadOptions={handleLoadOptions}
      placeholder='製作者検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default AuthorSelect
