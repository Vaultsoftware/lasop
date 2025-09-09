import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import PostHead from './PostHead'
import PostMain from './PostMain'

function PostPage() {
    return (
        <div className='w-full h-full '>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <PostHead />
            <PostMain />
        </div>
    )
}

export default PostPage