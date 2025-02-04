// app/page.tsx
'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { User } from './types'
import UserList from './components/UserList'
import UserPosts from './components/UserPosts'
import SearchBar from './components/SearchBar'
import { Alert, AlertDescription } from './components/ui/alert'
import { Card, CardContent } from './components/ui/card'

export default function Dashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    }
  })

  const filteredUsers = users?.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Users & Posts Dashboard</h1>
      
      <SearchBar 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <UserList 
              users={filteredUsers}
              isLoading={isLoading}
              selectedUserId={selectedUserId}
              onUserSelect={setSelectedUserId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {selectedUserId ? (
              <UserPosts userId={selectedUserId} />
            ) : (
              <p className="text-gray-500">Select a user to view their posts</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}