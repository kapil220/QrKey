'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User } from '@components/app/types'
import { Skeleton } from '@components/app/components/ui/skeleton'
import { Alert, AlertDescription } from '@components/app/components/ui/alert'
import UserPosts from '@components/app/components/UserPosts'

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams() // Use useParams() instead of props
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params // Unwrap params
      if (!resolvedParams.id) return

      const userId = String(resolvedParams.id)

      const fetchUserDetails = async () => {
        try {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
          )
          if (!response.ok) {
            throw new Error('User not found')
          }
          const userData = await response.json()
          setUser(userData)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch user')
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserDetails()
    }

    fetchParams()
  }, [params])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-500 hover:underline"
        >
          ← Go back
        </button>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-500 hover:underline"
          >
            ← Go back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">Contact Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
                <p><span className="font-medium">Website:</span> {user.website}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">Address</h2>
              <div className="space-y-2">
                <p>{user.address.street}, {user.address.suite}</p>
                <p>{user.address.city}, {user.address.zipcode}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">Company</h2>
              <div className="space-y-2">
                <p className="font-medium">{user.company.name}</p>
                <p className="text-gray-600 italic">{user.company.catchPhrase}</p>
                <p className="text-sm text-gray-500">{user.company.bs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
      <UserPosts userId={parseInt(params.id as string, 10)} />

      </div>
    </div>
  )
}
