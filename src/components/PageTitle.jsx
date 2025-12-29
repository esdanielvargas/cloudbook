export default function PageTitle({ title }) {
  return (
    <div className="w-full  flex items-center justify-center">
      <div className="w-full text-left text-lg font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </div>
    </div>
  );
}
