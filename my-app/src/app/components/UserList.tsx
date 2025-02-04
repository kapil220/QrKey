// components/UserList.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

import { User } from '../types'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'
import { 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter 
} from 'lucide-react'


interface UserListProps {
  users?: User[]
  isLoading: boolean
  selectedUserId: number | null
  onUserSelect: (userId: number) => void
}

type SortField = 'name' | 'company'
type SortDirection = 'asc' | 'desc'





export default function UserList({ 
  users = [], 
  isLoading, 
  selectedUserId, 
  onUserSelect 
}: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const router = useRouter()

  const handleNavigation = (userId: number) => {
    router.push(`/users/${userId}`)
  }

  // Sorting and Filtering Logic
  const processedUsers = useMemo(() => {
    let result = [...users]

    // Search Filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sorting
    return result.sort((a, b) => {
      const valueA = sortField === 'name' ? a.name : a.company.name
      const valueB = sortField === 'name' ? b.name : b.company.name
      
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    })
  }, [users, searchTerm, sortField, sortDirection])

  // Sorting Toggle Handler
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }


  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div>
     
      <div className="mb-4 flex space-x-2">
        <div className="relative flex-grow">
          <Input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => toggleSort('name')}
            className="flex items-center bg-gray-100 px-3 py-2 rounded"
            title="Sort by Name"
          >
            {sortField === 'name' && sortDirection === 'asc' ? (
              <ArrowUp size={16} />
            ) : sortField === 'name' && sortDirection === 'desc' ? (
              <ArrowDown size={16} />
            ) : (
              <Filter size={16} />
            )}
          </button>

       
          <button 
            onClick={() => toggleSort('company')}
            className="flex items-center bg-gray-100 px-3 py-2 rounded"
            title="Sort by Company"
          >
            {sortField === 'company' && sortDirection === 'asc' ? (
              <ArrowUp size={16} />
            ) : sortField === 'company' && sortDirection === 'desc' ? (
              <ArrowDown size={16} />
            ) : (
              <Filter size={16} />
            )}
          </button>
        </div>
      </div>

   
      <div className="space-y-4">
        {processedUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No users found
          </div>
        ) : (
          processedUsers.map((user) => (
            <div 
              key={user.id}
              className={`
                p-4 rounded-lg cursor-pointer transition-colors 
                ${selectedUserId === user.id 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }
              `}
              onClick={() => onUserSelect(user.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.company.name}</p>
                </div>
                <button onClick={() => handleNavigation(user.id)}>
    View Details
  </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}