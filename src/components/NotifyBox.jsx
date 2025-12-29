import { db, useAuth, useUsers } from "../hooks";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

export default function NotifyBox(props) {
  const auth = useAuth(db);
  const users = useUsers(db);
  const currentUser = users.find((user) => user.email === auth?.email);

  const getNotificationDetails = () => {
    switch (props.type) {
      case "follow":
        return {
          path: `/${props.currentUserUsername}`,
        };
      case "like":
        return {
          path: `/${props.username}/post/${props.postId}`,
        };
      case "comment":
        return {
          path: `/${props.username}/post/${props.postId}`,
        };
      default:
        return {};
    }
  };

  const { path } = getNotificationDetails();

  return (
    <>
      {props.targetUserId === currentUser?.id && (
        <Link to={path} className="w-full min-h-14 py-2 flex items-start gap-2">
          <Avatar {...props} />
          <div className="w-full flex">
            <div className="w-full">
              <div className="text-sm">
                {props.currentUserName && props.currentUserUsername && (
                  <b className="text-sm">{`@${props.currentUserUsername}, `}</b>
                )}
                {props.type && (
                  <>
                    {props.type === "follow" ? (
                      <>empezó a seguirte. ✨</>
                    ) : null}
                    {props.type === "like" ? (
                      <>le gustó tu publicación. ❤️</>
                    ) : null}
                    {props.type === "comment" ? (
                      <>comentó tu publicación. 🪶</>
                    ) : null}
                  </>
                )}
              </div>
              {props.time && (
                <div className="text-xs">
                  {new Date(props.time.seconds * 1000).toLocaleDateString(
                    "es",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )}
                </div>
              )}
            </div>
            <div
              className="min-w-12.5 hidden md:flex items-center justify-center rounded-xl overflow-hidden"
              title={props.text ? props.text : ""}
            >
              {props.photos?.length > 0 ? (
                <img
                  src={props.photos}
                  alt={props.text}
                  width={50}
                  height={50}
                  loading="lazy"
                  className="size-12.5"
                  />
                ) : (
                  props.poster && (
                    <img
                    src={props.poster}
                    alt={props.text}
                    width={50}
                    height={50}
                    loading="lazy"
                    className="size-12.5"
                  />
                )
              )}
              {props.photos?.length <= 0 && !props.video && props.text && (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    justifyContent: "center",
                    backgroundColor: "#121212",
                    color: "var(--compose-secondary-text)",
                    border: "1px solid var(--compose-border-color)",
                  }}
                >
                  {/* <LetterText size={28} /> */}
                </div>
              )}
              {props.type === "follow" && (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    justifyContent: "center",
                    backgroundColor: "#121212",
                    color: "var(--compose-secondary-text)",
                    border: "1px solid var(--compose-border-color)",
                  }}
                >
                  {/* <UserCheck size={28} /> */}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
