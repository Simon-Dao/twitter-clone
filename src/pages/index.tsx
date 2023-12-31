import { type NextPage } from "next";
import { NewTweetForm } from "~/components/NewTweetForm";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import { api } from "~/utils/api";

export default function Home() {

  return (
    <>
      <header className='sticky top-0 z-10 border-b bg-white pt-2'>
        <h1 className="mb-2 px-4 text-lg font-bold">
          Home
        </h1>
      </header>
      <NewTweetForm />
      <RecentTweets />
    </>
  );
}

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: lastPage => lastPage.nextCursor }
  )

  console.log(tweets.data?.pages)

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage ? true : false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  )
}