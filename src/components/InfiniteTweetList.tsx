import InfiniteScroll from "react-infinite-scroll-component"
import { ProfileImage } from "./ProfileImage"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { VscHeartFilled, VscHeart } from 'react-icons/vsc'
import { IconHoverEffect } from "./IconHoverEffect"

type Tweet = {
    id: string,
    content: string,
    createAt: Date,
    likeCount: number,
    likedByMe: boolean, 
    user: { id: string, image: string | null, name: string | null }
}

type InfiniteTweetListProps = {
    isLoading: boolean,
    isError: boolean,
    hasMore: boolean,
    fetchNewTweet: () => Promise<unknown>,
    tweets?: Tweet[]
}

export function InfiniteTweetList({tweets, isError, isLoading, fetchNewTweet, hasMore} : InfiniteTweetListProps) {

    if (isLoading) return <h1>Loading...</h1>

    if(isError) return <h1>Error...</h1>

    if(tweets == null || tweets.length == 0) { 
        return <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    } 

    return <ul>
        <InfiniteScroll dataLength={tweets.length} next={fetchNewTweet} hasMore={hasMore} loader={'Loading...'}>
            {
                tweets.map(tweet => {
                    return <TweetCard key={tweet.id} {...tweet}/>
                })
            }

        </InfiniteScroll>
    </ul>
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {dateStyle: 'short'})

function TweetCard({id, user, content, createAt, likeCount, likedByMe}: Tweet) {
    
    return (
        <li className="flex gap-4 border-b px-4 py-4">
            <Link href={`/profiles/${user.id}`}>
                <ProfileImage src={user.image} />
            </Link>
            <div className='flex flex-grow flex-col'>
                <div className="flex gap-1">
                    <Link href={`/profiles/${user.id}`} className="font-bold hover:underline focus-visible:underline">{user.name}</Link>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-500">{dateTimeFormatter.format(createAt)}</span>
                </div>
                <p>{content}</p>
                <HeartButton likedByMe={likedByMe} likeCount={likeCount} />
            </div>
        </li>)
}

type HeartButtonProps = {
    likedByMe: boolean,
    likeCount: number
}

function HeartButton({likedByMe, likeCount} : HeartButtonProps) {

    const session = useSession()
    const HeartIcon = likedByMe ? VscHeartFilled : VscHeart

    if(session.status !== 'authenticated') {
        return <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
            <HeartIcon />
            <span>{likeCount}</span>
        </div>
    }

    return (
        <button className={`group items-center gap-1 self-start flex transition-colors duration-200 ${likedByMe ? 'text-red-500' : 'text-gray-500'}
        hover:text-red-500 focus-visible:text-red-500`}>
            <IconHoverEffect red>
                <HeartIcon className={`transition-colors duration-200 ${likedByMe ? 'fill-red-500' : 'fill-gray-500'} group-hover:fill-red-500 group-focus-visible:fill-red-500`}/>
            </IconHoverEffect>
        <span>{likeCount}</span>
        </button>
    )
}