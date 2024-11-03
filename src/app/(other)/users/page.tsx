'use client'

import { searchUser } from '@/components/api/user-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import UsersTable from './users-table'

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])

  return (
    <div>
      <title>Scenario Tuker | ユーザー検索</title>
      <h1>ユーザー検索</h1>
      <SearchUsers setUsers={setUsers} />
      <UsersTable users={users} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default UsersPage

interface FormInput {
  name: string
  twitterId: string
}

interface SearchUsersHandle {
  search: () => void
}

interface SearchUsersProps {
  setUsers: Dispatch<SetStateAction<User[]>>
}

const SearchUsers = forwardRef<SearchUsersHandle, SearchUsersProps>(
  (props: SearchUsersProps, ref: ForwardedRef<SearchUsersHandle>) => {
    const { setUsers } = props
    const { control, formState, handleSubmit, getValues, watch } =
      useForm<FormInput>({
        defaultValues: {
          name: '',
          twitterId: ''
        }
      })

    const isEmpty = useMemo(() => {
      const values = watch()
      return values.name === '' && values.twitterId === ''
    }, [watch(['name', 'twitterId'])])

    const canSubmit: boolean = !formState.isSubmitting && !isEmpty

    const search = useCallback(
      async (data: FormInput) => {
        return await searchUser({
          name: data.name ? data.name : null,
          screen_name: data.twitterId ? data.twitterId : null,
          is_twitter_following: false
        })
      },
      [searchUser]
    )

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const res = await search(data)
        setUsers(res.list)
      },
      [search]
    )

    useImperativeHandle(ref, () => ({
      search() {
        reload
      }
    }))

    const reload = async () => {
      const res = await search(getValues())
      setUsers(res.list)
    }

    return (
      <div className='my-2 rounded bg-gray-200 p-2 text-center md:my-5 md:p-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='field-label'>検索条件</label>
          <div className='field my-2'>
            <InputText
              control={control}
              name='name'
              placeholder='ユーザー名'
              className='w-full'
            />
          </div>
          <div className='field my-2'>
            <InputText
              control={control}
              name='twitterId'
              placeholder='Twitter ID'
              className='w-full'
            />
          </div>
          <div className='my-4'>
            <div>
              <SubmitButton disabled={!canSubmit}>
                <FontAwesomeIcon icon={faSearch} className='mr-2 h-4' />
                検索
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    )
  }
)
