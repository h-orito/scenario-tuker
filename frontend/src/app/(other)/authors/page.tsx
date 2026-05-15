'use client'

import { fetchAuthors, searchAuthors } from '@/components/api/author-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import useModalState from '@/components/modal/modal-state'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import AuthorsTable from './authors-table'
import CreateAuthorModal from './create-author'

const AuthorPage = () => {
  const [authors, setAuthors] = useState<Author[]>([])
  const [isShowModal, openModal, , toggleModal] = useModalState()
  const router = useRouter()
  const postCreate = useCallback((author: Author) => {
    router.push(`/authors/${author.id}`)
  }, [])

  const searchRef = useRef({} as SearchAuthorsHandle)
  const reload = async () => searchRef.current.search()

  return (
    <div>
      <title>Scenario Tuker | シナリオ制作者一覧</title>
      <h1>シナリオ製作者一覧</h1>
      <SearchAuthors ref={searchRef} setAuthors={setAuthors} />
      <div className='my-4 flex justify-end'>
        <PrimaryButton click={openModal}>
          <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
          追加
        </PrimaryButton>
        {isShowModal && (
          <CreateAuthorModal toggleModal={toggleModal} postSave={postCreate} />
        )}
      </div>
      <AuthorsTable authors={authors} reload={reload} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default AuthorPage

interface FormInput {
  name: string
}

interface SearchAuthorsHandle {
  search: () => void
}

interface SearchAuthorsProps {
  setAuthors: Dispatch<SetStateAction<Author[]>>
}

const SearchAuthors = forwardRef<SearchAuthorsHandle, SearchAuthorsProps>(
  (props: SearchAuthorsProps, ref: ForwardedRef<SearchAuthorsHandle>) => {
    const { setAuthors } = props
    const { control, formState, handleSubmit, getValues } = useForm<FormInput>({
      defaultValues: {
        name: ''
      }
    })
    const canSubmit: boolean = !formState.isSubmitting

    const search = useCallback(
      async (name: string) => {
        if (name == null || name === '') {
          return await fetchAuthors()
        } else {
          return await searchAuthors({
            name: name
          })
        }
      },
      [fetchAuthors, searchAuthors]
    )

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const res = await search(data.name)
        setAuthors(res.list)
      },
      [search]
    )

    useImperativeHandle(ref, () => ({
      search() {
        reload
      }
    }))

    useEffect(() => {
      reload()
    }, [])

    const reload = async () => {
      const res = await search(getValues().name)
      setAuthors(res.list)
    }

    return (
      <div className='my-2 rounded bg-gray-200 p-2 text-center md:my-5 md:p-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='field-label'>検索条件</label>
          <div className='field my-2'>
            <div className='p-inputgroup'>
              <InputText
                control={control}
                name='name'
                placeholder='シナリオ製作者名'
                className='w-full'
              />
            </div>
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
