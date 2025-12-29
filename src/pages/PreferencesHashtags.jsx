import { Button, PageBox, PageHeader, PageLine } from "../components";

export default function PreferencesHashtags() {
  return (
    <>
      <PageHeader title="Hashtags" />
      <PageBox active>
        <div className="size-full"></div>
        <PageLine />
        <div className="w-full flex items-center justify-between gap-2">
          <Button full to="/preferences/topics">
            Anterior
          </Button>
          <Button full variant="follow" to="/">
            Finalizar
          </Button>
        </div>
      </PageBox>
    </>
  );
}
