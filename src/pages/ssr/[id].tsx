import { withSSRContext } from 'aws-amplify'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import { getPost } from "../../graphql/queries"

const SsrPage: NextPage = ({ post }: any) => {
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

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const SSR = withSSRContext({ req });
  const { data } = await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params?.id
    }
  });
  return {
    props: {
      post: data.getPost
    }
  }
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`

export default SsrPage
