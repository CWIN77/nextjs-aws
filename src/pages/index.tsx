import { API, withSSRContext } from 'aws-amplify'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { getPost, listPosts, postsByDate } from '../graphql/queries'
import { createPost as createPostQuery } from "../graphql/mutations"
import { useState } from 'react'
import { IPost } from '../types'

const Home: NextPage<{posts:IPost[]}> = ({ posts }: {posts:IPost[]}) => {
  const [title,setTitle] = useState("");
  const [descript,setDescript] = useState("");
  const [postList,setPostList] = useState(posts);
  const getRandomUid = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'; // 63
    let uid = '';
    for (let i = 0; i < 8; i++) {
      const randomNum = Math.floor(Math.random() * chars.length);
      uid += chars.substring(randomNum, randomNum + 1);
    }
    return uid;
  }
  const createPost = async () => {
    if(confirm("새 게시물을 포스트 하시겠습니까?")){
      let uid = getRandomUid();
      const isOver = await API.graphql({
        query: getPost,
        variables: {
          id: uid
        }
      }) as {data:{getPost:IPost | null}};
      if(isOver.data.getPost === null){
        const {data} = await API.graphql({
          query: createPostQuery,
          variables: {
            input:{
              id:uid,
              title,
              descript,
              img:"https://i.ibb.co/60S7pbD/page1.png",
              type: "Post"
            }
          }
        }) as {data:{createPost:IPost | null}};
        if (data.createPost === null) window.alert("포스트에 실패했습니다.");
        else {
          setPostList([data.createPost, ...postList]);
          setTitle("");
          setDescript("");
        };
      }else{
        alert("오류! 다시 시도해주세요.");
      }
    }
  }

  return (
    <Container>
      <h1>Create</h1>
      <input value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="제목을 작성하세요." type="text" />
      <input value={descript} onChange={(e)=>{setDescript(e.target.value)}} placeholder="설명을 작성하세요." type="text" />
      <CreatePostBtn onClick={createPost}>새 글 생성</CreatePostBtn>
      <br/>
      <br/>
      <h1>List</h1>
      {
        postList.map((post: IPost, key) => (
          <Link href={`/ssg/${post.id}`} key={key}><a>{post.title}</a></Link>
        ))
      }
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const SSR = withSSRContext();
  const {data} = await SSR.API.graphql({
    query: postsByDate,
    variables: {
      type: "Post"
    }
  }) as {data:{postsByDate:{items:IPost[]}}};
  return {
    props: {
      posts: data.postsByDate.items
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
    font-size: 16px;
  }
  h1{
    font-size: 18px;
  }
  input{
    font-size: 14px;
    display:block;
    padding: 6px 8px;
    margin-top: 6px;
    border: 1px solid rgba(255,255,255,0.6);
  }
`
const CreatePostBtn = styled.button`
  margin: 16px 2px;
  padding: 4px 8px;
  border-radius: 2px;
  background-color: rgba(255,255,255,1);
  color: #121212;
`

export default Home
