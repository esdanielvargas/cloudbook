import { Button, PageBox, PageHeader, PageLine } from "../components";

export default function PreferencesTopics() {
  const topics = [
    {
      title: "Videojuegos",
    },
    {
      title: "Música",
    },
    {
      title: "Educación",
    },
    {
      title: "Tecnología",
    },
    {
      title: "Viajes",
    },
    {
      title: "Turismo",
    },
    {
      title: "Internet",
    },
    {
      title: "Programación",
    },
  ];

  return (
    <>
      <PageHeader title="Temas" />
      <PageBox active>
        <div className="size-full">
          <div className="w-full mx-auto grid gap-1 grid-cols-4">
            {topics.map((topic) => (
              <div className="py-2 px-3 rounded-lg border">{topic?.title}</div>
            ))}
          </div>
        </div>
        <PageLine />
        <div className="w-full mx-auto flex items-center justify-between gap-2">
          <Button full to="/preferences/users">
            Anterior
          </Button>
          <Button full variant="follow" to="/preferences/hashtags">
            Siguiente
          </Button>
        </div>
      </PageBox>
    </>
  );
}
