type Props = {
    htmlFor: string
    title?: string
    type: string
    onChange: any
    value: number | string
    placeholder?: string,
    className?: string
    styleTitle?: string
}

function InputForm({ htmlFor, title, type, onChange, value, placeholder, className, styleTitle }: Props) {
    return (
        <div className={`mb-3 ${className}`} >
            <label htmlFor={htmlFor} className={`${styleTitle}`}>
                {title}
            </label>
            <input
                className="h-10 p-4 rounded-md outline-none w-full bg-slate-100"
                type={type}
                name={htmlFor}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
            />
        </div>
    )
}

export default InputForm