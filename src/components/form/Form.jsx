export default function Form({ children, ...rest }) {
  return (
    <form {...rest} className="w-full space-y-3">{children}</form>
  )
}