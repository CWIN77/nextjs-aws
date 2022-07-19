import { withSSRContext } from 'aws-amplify'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head';
import styled from 'styled-components'
import { listPosts, getPost } from "../../graphql/queries"
const SSR = withSSRContext();

const SsgPage: NextPage = ({ post }: any) => {
  return (
    <Container>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.descript} />
        <meta property="og:image" content={post.img} />
        <meta name="twitter:image" content={post.img} />
      </Head>
      <div>아이디 : {post.id}</div>
      <div>제목 : {post.title}</div>
      <div>설명 : {post.descript}</div>
    </Container>
  )
}
//test
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await SSR.API.graphql({ query: listPosts });
<<<<<<< HEAD
  const paths = data.listPosts.items.slice(0, 9).map((post: any) => ({
=======
  const paths = data.listPosts.items.slice(0,9).map((post: any) => ({
>>>>>>> c1715f407777146cb37b3f890d53098f303fc713
    params: { id: post.id }
  }));
  return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params?.id
    }
  });
  return {
    props: {
      post: data.getPost
    },
    revalidate: 60,
  }
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`

export default SsgPage
