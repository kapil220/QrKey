import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

type SortField = 'name' | 'company'
type SortDirection = 'asc' | 'desc'

interface UserSortingProps {
  onSort: (field: SortField, direction: SortDirection) => void
}

export default function UserSorting({ onSort }: UserSortingProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    const newDirection = 
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    
    setSortField(field)
    setSortDirection(newDirection)
    onSort(field, newDirection)
  }

  return (
    <div className="flex space-x-4 mb-4">
      <button 
        onClick={() => handleSort('name')}
        className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded"
      >
        <span>Sort by Name</span>
        {sortField === 'name' && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>
      <button 
        onClick={() => handleSort('company')}
        className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded"
      >
        <span>Sort by Company</span>
        {sortField === 'company' && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>
    </div>
  )
}