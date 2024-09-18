import React from 'react'
import TextEditor from '../components/fragments/TextEditor/TextEditor'

type Props = {}

const CreateArticles = (props: Props) => {
    return (
        <div className='container mx-auto'>
            <div className="mt-10 ">
                <TextEditor />
            </div>
        </div>
    )
}

export default CreateArticles