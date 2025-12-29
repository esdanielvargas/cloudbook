export default function PostTitle(props) {
  return (
    <div className={`mx-2 md:mx-4 ${props?.text ? "mb-2" : "mb-4"} line-clamp-2`}>
      <div className="font-bold text-[14.5px] font-sans" title={props?.title}>
        {props?.title}
      </div>
    </div>
  );
}
