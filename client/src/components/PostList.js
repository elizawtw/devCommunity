import React from 'react';
import PostListItem from './PostListItem';

function PostList(props) {
  const postArray = props.posts;
  // console.log("Postlist postArray:",postArray)
  const postItem = postArray.map((post) => { 
    return <PostListItem 
      key={post.id}
      id={post.id}
      content={post.content}
      first_name={post.first_name}
      avatar={post.avatar}
      photo={post.photo}
      deletePost={props.deletePost}
      user_id={post.user_id}
    /> 
  })

  return (
    <div className="postList">
      <div className="postListItem">
        {postItem}
      </div> 
    </div>
  )
}

export default PostList
