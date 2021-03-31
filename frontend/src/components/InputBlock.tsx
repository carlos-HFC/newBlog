import { FC, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, useState } from "react"
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"

import { Button } from '.'

interface IInputBlock extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  password?: boolean
  type?: 'text' | 'email' | 'password' | 'textarea'
}

const InputBlock: FC<IInputBlock> = ({ label, password, type = 'text', ...props }) => {
  const [isTypePass, setIsTypePass] = useState(true)

  const htmlFor = `${label?.toString().split(' ').join('_').toLowerCase()}__${Math.random() * 1000}`

  return (
    !password ? (
      <div className="row mb-2">
        <div className="col mb-2">
          <label htmlFor={htmlFor}>{label}</label>{props.required && <span>*</span>}
          {type !== 'textarea'
            ? <input {...props} id={htmlFor} autoComplete="off" type={type} className="form-control" />
            : <textarea {...props as TextareaHTMLAttributes<HTMLTextAreaElement>} id={htmlFor} className="form-control" rows={10} />
          }
        </div>
      </div>
    ) : (
      <div className="row mb-2">
        <div className="col mb-2">
          <label htmlFor={htmlFor}>{label}</label>{props.required && <span>*</span>}
          <div className="input-group">
            <input {...props} id={htmlFor} autoComplete="off" type={isTypePass ? 'password' : 'text'} className="form-control" />
            <div className="input-group-prepend">
              <Button type="button" variant="secondary" onClick={() => setIsTypePass(!isTypePass)}>
                {isTypePass ? <BsEyeFill /> : <BsEyeSlashFill />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default InputBlock

