export default function Form({ children, ...rest }) {
  return (
    <form {...rest} className="w-full flex flex-col">{children}</form>
  )
}