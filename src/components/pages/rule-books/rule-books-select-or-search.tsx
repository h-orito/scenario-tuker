import useModalState from '@/components/modal/modal-state'
import RuleBooksSearch from './rule-books-search'
import RuleBooksSelect from './rule-books-select'

type Props = {
  selected: RuleBookResponse[]
  setSelected: (value: RuleBookResponse[]) => void
}

const RuleBooksSelectOrSearch = (props: Props) => {
  const { selected, setSelected } = props
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()
  const handleRuleBooksSelect = (ruleBooks: RuleBookResponse[]) => {
    setSelected(ruleBooks)
    if (isShowModal) closeModal()
  }

  return (
    <>
      <button className='text-xs border-none text-blue-500' onClick={openModal}>
        詳細検索
      </button>
      {isShowModal && (
        <RuleBooksSearch
          toggleModal={toggleModal}
          closeModal={closeModal}
          setSelected={handleRuleBooksSelect}
        />
      )}
      <RuleBooksSelect
        gameSystemId={null}
        selected={selected}
        setSelected={handleRuleBooksSelect}
      />
    </>
  )
}

export default RuleBooksSelectOrSearch
