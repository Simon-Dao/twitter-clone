import next from "next/types";
import { z } from "zod";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({

  infiniteFeed: publicProcedure.input(
    z.object(
    {
      limit: z.number().optional(),
      cursor: z.object({id:z.string(), createAt: z.date()}).
      optional()
    }
    ))
    .query(
      async ( {input: { limit = 10, cursor }, ctx}) => {

        const currentUserId = ctx.session?.user.id

        const data = await ctx.prisma.tweet.findMany(
          {
            take: limit + 1,
            cursor: cursor ? { } : undefined,
            orderBy: [{ createAt: 'desc' }, { id: 'desc' }],
            select: {
              id: true,
              content: true,
              createAt: true,
              _count: {select: {likes: true}},
              likes: currentUserId == null ? false : {where: {userId: currentUserId}},
              user: {
                select: { name: true, image: true }
              }
        }})

        const test = await ctx.prisma.user.findMany({

        })

        console.log(test)

        let nextCursor: typeof cursor | undefined

        if(data.length > limit) {
          const nextItem = data.pop()

          if(nextItem != null) {
            nextCursor = { id: nextItem.id, createAt: nextItem.createAt }
          }
        }

        return {tweets: data.map(tweet => {


          return {
            id: tweet.id,
            content: tweet.content,
            createAt: tweet.createAt,
            likeCount: tweet._count.likes,
            user: tweet.user,
            likedByMe: tweet.likes?.length > 0, 
          }
        }), nextCursor}
      }
    ),
 
    create: protectedProcedure
      .input(z.object({ content: z.string() }))
      .mutation(async ( {input: {content}, ctx}) => {
        //making a call to the database
        return await ctx.prisma.tweet.create({ data: {content, userId: ctx.session.user.id } })
      })    
});
