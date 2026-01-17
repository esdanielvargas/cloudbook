import React from "react";
import { Link } from "react-router-dom";
import { stripParamsAndWWW } from "./stripParamsAndWWW";

const urlRegex = /(https?:\/\/[^\s]+)/gi;
const usernameRegex = /@\w+/g;
const hashtagRegex = /#\w+/g;

export const formatText = (text, users, premium = false) => {
  const parts = text?.split(urlRegex); // separar las URLs del texto

  return parts?.map((part, index) => {
    if (part.match(urlRegex)) {
      // Mostrar como link externo (o embebido si querés después)
      return (
        <span key={index}>
          {premium ? (
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="active:underline hover:underline"
              style={{ color: "var(--accent-color)" }}
              title={`CloudBook no garantiza la seguridad ni el contenido de este enlace externo. Ingresa bajo tu propio riesgo: ${stripParamsAndWWW(
                part
              )}`}
            >
              {stripParamsAndWWW(part)}
            </a>
          ) : (
            <span
              className="underline"
              title="Solo los usuarios premium pueden compartir enlaces accesibles."
            >
              {stripParamsAndWWW(part)}
            </span>
          )}
        </span>
      );
    }

    // Ahora procesamos menciones y hashtags solo si NO es una URL
    const subparts = part.split(/(\s+|[^\w@#]+)/); // mantener separadores

    return subparts.map((sub, subIndex) => {
      if (sub.match(usernameRegex)) {
        const username = sub.slice(1).replace(/\./g, ""); // quitar @
        const userExists = users.some((user) => user.username === username);

        return (
          <React.Fragment key={`${index}-${subIndex}`}>
            {userExists ? (
              <Link
                to={`/${username}`}
                className="hover:underline"
                style={{ color: "var(--accent-color)" }}
                title={`Ver perfil de @${username}`}
              >
                {sub}
              </Link>
            ) : (
              <span
                className="text-red-500 cursor-pointer hover:underline"
                title={`El usuario ${sub} no existe.`}
              >
                {sub}
              </span>
            )}
          </React.Fragment>
        );
      }

      if (sub.match(hashtagRegex)) {
        const hashtag = sub.slice(1); // quitar #
        return (
          <React.Fragment key={`${index}-${subIndex}`}>
            <Link
              to={`/search/posts?tag=${hashtag}`}
              className="hover:underline"
              style={{ color: "var(--accent-color)" }}
              title={`Ver publicaciones con el hashtag #${hashtag}`}
            >
              {sub}
            </Link>
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={`${index}-${subIndex}`}>{sub}</React.Fragment>
      );
    });
  });
};
