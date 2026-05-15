import { fetchAuthors, searchAuthors } from '@/components/api/author-api'
import { MultiValue } from 'react-select'
import AsyncSelect from 'react-select/async'

type Props = {
  selected: Author[]
  setSelected: (value: Author[]) => void
}

const AuthorsSelect = ({ selected, setSelected }: Props) => {
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

  const handleChange = (values: MultiValue<Author>) => {
    setSelected(values.map((v) => v))
  }

  return (
    <AsyncSelect
      form='__authors' // メニュー非表示時Enterを押下でform submitされるのを防ぐ
      isClearable
      isMulti
      cacheOptions
      defaultOptions
      value={selected}
      getOptionLabel={(gs) => gs.name}
      getOptionValue={(gs) => gs.id.toString()}
      loadOptions={handleLoadOptions}
      placeholder='製作者検索'
      onChange={handleChange}
      className='flex-1'
      classNamePrefix={'rs'}
    />
  )
}
export default AuthorsSelect
