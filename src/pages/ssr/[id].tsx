import { withSSRContext } from 'aws-amplify'
import type { GetServerSideProps, NextPage } from 'next'
import styled from 'styled-components'
import { listPosts } from "../../graphql/queries"

const SsrPage: NextPage = ({ post }: any) => {
  return (
    <Container>
      <div>아이디 : {post.id}</div>
      <div>제목 : {post.title}</div>
      <div>설명 : {post.descript}</div>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const SSR = withSSRContext({ req });
  const res = (await SSR.API.graphql({ query: listPosts }));
  const id = query.id as string || "0";
  return {
    props: {
      post: res.data.listPosts.items[id]
    }
  }
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`

export default SsrPage
