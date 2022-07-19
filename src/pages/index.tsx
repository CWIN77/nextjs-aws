import { withSSRContext } from 'aws-amplify'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { listPosts } from '../graphql/queries'

const Home: NextPage = ({ posts }: any) => {
  return (
    <Container>
      <h1>SSG Page</h1>
      {
        posts.map((post: any, key: string) => (
          <Link href={`/ssg/${post.id}`} key={key}><a>{post.title}</a></Link>
        ))
      }
      <div>change!!!</div>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({ query: listPosts });
  return {
    props: {
      posts: data.listPosts.items
    },
    revalidate: 60,
  }
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  a{
    display:block;
    color:white;
    font-size: 14px;
  }
`

export default Home
