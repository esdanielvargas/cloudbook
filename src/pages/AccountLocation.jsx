import { Button, Form, FormField, PageBox, PageHeader } from "../components";
import { useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { db, useUsers } from "../hooks";
import { useEffect, useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";

export default function AccountLocation() {
  const auth = getAuth();
  const users = useUsers(db);
  const navigate = useNavigate();

  const currentUser = users.find((user) => user?.uid === auth.currentUser?.uid);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const [dataLoaded, setDataLoaded] = useState(false);

  const sortSpanish = (a, b) => {
    return a.label.localeCompare(b.label, "es", { sensitivity: "base" });
  };

  const countriesOptions = useMemo(() => {
    const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

    return Country.getAllCountries()
      .map((c) => {
        let label = c.name;
        try {
          label = regionNames.of(c.isoCode);
        } catch (e) {
          console.warn(e);
        }
        return { value: c.isoCode, label };
      })
      .sort(sortSpanish);
  }, []);

  const statesOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry)
      .map((s) => ({
        value: s.isoCode,
        label: s.name,
      }))
      .sort(sortSpanish);
  }, [selectedCountry]);

  const citiesOptions = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState)
      .map((c) => ({
        value: c.name,
        label: c.name,
      }))
      .sort(sortSpanish);
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    if (currentUser?.location?.country && !dataLoaded) {
      setValue("country", currentUser.location.country);
    }
  }, [currentUser, setValue, dataLoaded]);

  useEffect(() => {
    if (selectedCountry && currentUser?.location?.state && !dataLoaded) {
      if (currentUser.location.country === selectedCountry) {
         setValue("state", currentUser.location.state);
      }
    }
  }, [selectedCountry, currentUser, setValue, dataLoaded]);

  useEffect(() => {
    if (selectedState && currentUser?.location?.city && !dataLoaded) {
       if (currentUser.location.state === selectedState) {
          setValue("city", currentUser.location.city);
          setDataLoaded(true);
       }
    }
  }, [selectedState, currentUser, setValue, dataLoaded]);

  const onSubmit = async (data) => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, {
        location: {
          country: data.country,
          state: data.state,
          city: data.city,
        },
      });

      navigate("/settings/account");
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <>
      <PageHeader title="Ubicación" />
      <PageBox active>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="País"
            text="Selecciona tu país de residencia."
            placeholder="Selecciona un país"
            {...register("country")}
            select
            options={[
              { value: "", label: "Selecciona un país" },
              ...countriesOptions,
            ]}
          />
          <FormField
            label="Estado, Provincia o Región"
            text="Selecciona tu estado o provincia."
            placeholder={
              statesOptions.length > 0
                ? "Selecciona un estado"
                : "No aplica o selecciona un país primero"
            }
            {...register("state")}
            select
            disabled={!selectedCountry || statesOptions.length === 0}
            options={[
              { value: "", label: "Selecciona una opción" },
              ...statesOptions,
            ]}
          />
          <FormField
            label="Ciudad"
            text="Selecciona tu ciudad."
            placeholder={
              citiesOptions.length
                ? "Selecciona..."
                : "Selecciona un estado primero"
            }
            {...register("city")}
            select
            disabled={!citiesOptions.length}
            options={[{ value: "", label: "Selecciona..." }, ...citiesOptions]}
          />
          <Button full type="submit" variant="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Form>
      </PageBox>
    </>
  );
}
