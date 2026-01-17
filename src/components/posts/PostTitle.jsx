export default function PostTitle(props) {
  return (
    <div className={`w-full mx-2 md:mx-4 ${props?.caption ? "mb-1 md:mb-2" : "mb-2 md:mb-4"} line-clamp-2`}>
      <div className="font-bold text-base font-sans" title={props?.title}>
        {props?.title}
      </div>
    </div>
  );
}
