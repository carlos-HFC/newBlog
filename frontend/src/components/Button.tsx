import { ButtonHTMLAttributes, FC } from 'react'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "danger" | "success" | "warning" | "navy" | "primary" | "secondary"
}

const Button: FC<IButtonProps> = ({ variant, className, ...props }) => {
  let classes = `btn`
  if (variant) classes += ` btn__${variant}`
  if (className) classes += ` ${className}`

  return (
    <button className={classes} {...props}>{props.children}</button>
  )
}

export default Button
