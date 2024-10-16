import { Table as ReactTable } from '@tanstack/react-table'

type Props = {
  table: ReactTable<any>
}
const PaginationFooter = ({ table }: Props) => {
  return (
    <div className='flex w-full content-center justify-center gap-2'>
      <PaginationButton
        click={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </PaginationButton>
      <PaginationButton
        click={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </PaginationButton>
      <div className='mx-2 content-center'>
        {table.getState().pagination.pageIndex + 1}&nbsp;/&nbsp;
        {table.getPageCount()}
      </div>
      <PaginationButton
        click={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </PaginationButton>
      <PaginationButton
        click={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </PaginationButton>
      <select
        className='px-2'
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
export default PaginationFooter

const PaginationButton = ({
  children,
  click,
  disabled
}: {
  children: React.ReactNode
  click: () => void
  disabled: boolean
}) => {
  return (
    <button
      className='border border-gray-300 px-4 py-2 hover:bg-gray-300 disabled:border-none disabled:bg-gray-200 disabled:text-white'
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
