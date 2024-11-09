'use client'

import { AllRuleBookType } from '@/@types/rule-book-type'
import { fetchRuleBooks, searchRuleBooks } from '@/components/api/rule-book-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import RadioGroup from '@/components/form/radio-group'
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
import CreateRuleBookModal from './create-rule-book'
import RuleBooksTable from './rule-books-table'

const RuleBookPage = () => {
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const [isShowModal, openModal, , toggleModal] = useModalState()
  const router = useRouter()
  const postCreate = useCallback((ruleBook: RuleBookResponse) => {
    router.push(`/rule-books/${ruleBook.id}`)
  }, [])

  const searchRef = useRef({} as SearchRuleBooksHandle)
  const reload = async () => searchRef.current.search()

  return (
    <div>
      <title>Scenario Tuker | ルールブック一覧</title>
      <h1>ルールブック一覧</h1>
      <SearchRuleBooks ref={searchRef} setRuleBooks={setRuleBooks} />
      <div className='my-4 flex justify-end'>
        <PrimaryButton click={openModal}>
          <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
          追加
        </PrimaryButton>
        {isShowModal && (
          <CreateRuleBookModal
            toggleModal={toggleModal}
            postSave={postCreate}
          />
        )}
      </div>
      <RuleBooksTable ruleBooks={ruleBooks} reload={reload} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default RuleBookPage

interface FormInput {
  ruleBookName: string
  gameSystemName: string
}

interface SearchRuleBooksHandle {
  search: () => void
}

interface SearchRuleBooksProps {
  setRuleBooks: Dispatch<SetStateAction<RuleBookResponse[]>>
}

const SearchRuleBooks = forwardRef<SearchRuleBooksHandle, SearchRuleBooksProps>(
  (props: SearchRuleBooksProps, ref: ForwardedRef<SearchRuleBooksHandle>) => {
    const { setRuleBooks } = props
    const [ruleBookType, setRuleBookType] = useState('')
    const { control, formState, handleSubmit, getValues } = useForm<FormInput>({
      defaultValues: {
        ruleBookName: '',
        gameSystemName: ''
      }
    })
    const canSubmit: boolean = !formState.isSubmitting

    const search = useCallback(
      async (data: FormInput) => {
        if (
          data.ruleBookName === '' &&
          data.gameSystemName === '' &&
          ruleBookType === ''
        ) {
          return await fetchRuleBooks()
        } else {
          return await searchRuleBooks({
            name: data.ruleBookName,
            game_system_id: null,
            game_system_name: data.gameSystemName,
            rule_book_type: ruleBookType === '' ? null : ruleBookType
          })
        }
      },
      [fetchRuleBooks, searchRuleBooks, ruleBookType]
    )

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const res = await search(data)
        setRuleBooks(res.list)
      },
      [search]
    )

    useImperativeHandle(ref, () => ({
      async search() {
        reload()
      }
    }))

    useEffect(() => {
      reload()
    }, [])

    const reload = async () => {
      const res = await search(getValues())
      setRuleBooks(res.list)
    }

    return (
      <div className='my-2 rounded bg-gray-200 p-2 text-center md:my-5 md:p-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='field-label'>検索条件</label>
          <div className='field my-2'>
            <InputText
              control={control}
              name='ruleBookName'
              placeholder='ルールブック名'
              className='w-full'
            />
          </div>
          <div className='field my-2'>
            <InputText
              control={control}
              name='gameSystemName'
              placeholder='ゲームシステム名'
              className='w-full'
            />
          </div>
          <div className='field my-2'>
            <RadioGroup
              name='search-rule-book-type'
              candidates={[
                ...Object.values(AllRuleBookType).map((type) => ({
                  label: type.label,
                  value: type.value
                })),
                { label: '全て', value: '' }
              ]}
              selected={ruleBookType}
              setSelected={setRuleBookType}
            />
          </div>{' '}
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
