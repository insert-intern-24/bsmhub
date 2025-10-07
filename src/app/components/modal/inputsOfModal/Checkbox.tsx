import React, { useState } from 'react'
import { IconSquareCheckFilled, IconSquareCheck } from '@tabler/icons-react'

const Checkbox = () => {
    const [checked, setChecked] = useState(false)

    return (
        <label className='flex flex-row items-center gap-2 cursor-pointer select-none' onClick={() => setChecked(!checked)}>
            {
                checked ? (
                    <IconSquareCheckFilled className='w-8' />
                ) : (
                    <IconSquareCheck className='w-8 bg-transparent' />
                )
            } {'체크박스'}
        </label>
    )
}

export default Checkbox