import { Button, PageBox, PageHeader, PageLine } from "../components";

export default function Preferences() {
  return (
    <>
      <PageHeader title="Preferencias" />
      <PageBox active>
        <div className="size-full"></div>
        <PageLine />
        <div className="w-full flex items-center justify-between gap-2">
          <Button full disabled>Omitir</Button>
          <Button full variant="follow" to="/preferences/users">
            Siguiente
          </Button>
        </div>
      </PageBox>
    </>
  );
}
