import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, FormField, PageBox, PageHeader, PageLine } from "../components";

export default function FeedCreate() {
  const { register, handleSubmit, watch } = useForm();
  const [status, setStatus] = useState(true);

  const title = watch("title");

  const onSubmit = (data) => {
    const feed = {
      ...data,
      status: status,
    }
    console.log(feed);
  };

  return (
    <>
      <PageHeader title={title || "Nuevo feed"} />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Título"
            text="Este título saldrá en el botón del feed"
            placeholder="Ingresa el título del feed"
            {...register("title")}
          />
          <FormField
            label="Descripción"
            text="Esta es la descripción del feed"
            textarea
            placeholder="Ingresa la descripción del feed"
            {...register("description")}
          />
          <FormField
            label="Feed público"
            text="Cuando esta opción este activada, cualquier usuario puede ver y/o agregar este feed a su perfil. El Feed puede ser sugerido a otros usuarios para que lo sigan."
            boolean
            value={status}
            onClick={() => setStatus(!status)}
          />
          <PageLine />
          <FormField
            label="Hashtags"
            text="Ingresa los hashtags del feed"
            textarea
            rows={3}
            placeholder="Ej. #hashtag1, #hashtag2"
            {...register("hashtags")}
            />
          <FormField
            label="Usuarios"
            text="Ingresa los usuarios del feed"
            textarea
            rows={3}
            placeholder="Ej. @usuario1, @usuario2"
            {...register("users")}
          />
          <Button variant="follow" full>Crear feed</Button>
          <PageLine />
        </Form>
      </PageBox>
    </>
  );
}
