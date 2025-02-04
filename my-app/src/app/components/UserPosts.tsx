import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Post } from '../types'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription } from './ui/alert'

interface UserPostsProps {
  userId: number
}

interface PostsResponse {
  posts: Post[]
  nextPage: number | undefined
}

const POSTS_PER_PAGE = 5

export default function UserPosts({ userId }: UserPostsProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery<PostsResponse, Error>({
    queryKey: ['posts', userId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      )
      if (!response.ok) throw new Error('Failed to fetch posts')
      const allPosts: Post[] = await response.json()
      
      const start = (pageParam as number) * POSTS_PER_PAGE
      const end = start + POSTS_PER_PAGE
      const posts = allPosts.slice(start, end)
      
      return {
        posts,
        nextPage: end < allPosts.length ? (pageParam as number) + 1 : undefined
      }
    },
    getNextPageParam: (lastPage: PostsResponse) => lastPage.nextPage
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading posts: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">User Posts</h2>
      
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="space-y-4">
          {page.posts.map((post: Post) => (
            <div 
              key={post.id} 
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.body}</p>
            </div>
          ))}
        </div>
      ))}
      
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Load More Posts
          </button>
        ) : data?.pages[0]?.posts.length ? (
          <p className="text-gray-500">No more posts to load</p>
        ) : (
          <p className="text-gray-500">No posts found</p>
        )}
      </div>
    </div>
  )
}