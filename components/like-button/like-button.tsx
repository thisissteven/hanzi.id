import React from "react";
import { LucideCircle, LucideHeart } from "lucide-react";
import { useAnimate } from "framer-motion";
import { cn } from "@/utils";
import { useLikeButton } from "./context";

export function LikeButton() {
  const [scope, animate] = useAnimate();
  const [isAnimating, setIsAnimating] = React.useState(false);

  const { liked, setLiked } = useLikeButton();

  React.useEffect(() => {
    async function handleLike() {
      if (liked == null) return;
      setIsAnimating(true);
      if (liked) {
        animate(
          ".circle-1",
          { opacity: [0, 1, 0], scale: [0, 1, 0], color: ["#b891be", "#b455ce", "#af47c0"] },
          { duration: 0.4 }
        );
        animate(
          ".circle-2",
          { opacity: [0, 1, 0], scale: [0.2, 1.5, 0.5], color: ["#a88aa8", "#af4ac1", "#b33ead"] },
          { duration: 0.4, delay: 0.1 }
        );
        animate(
          ".circle-3",
          { opacity: [0, 1, 0], scale: [0.3, 1.5, 1], color: ["#bc98bc", "#cf4bc0", "#9917a0"] },
          { duration: 0.4, delay: 0.2 }
        );

        animate(".heart", { color: "#f688ef", fill: "#af4dc5", scale: [1.1, 1.3, 1.2, 1] }, { duration: 0.2 });

        animate(".small-heart-1", { y: -28, opacity: [0, 1, 0], scale: [0, 0.6, 0.2] }, { duration: 0.2, delay: 0.2 });
        animate(".small-heart-2", { y: -36, opacity: [0, 1, 0], scale: [0, 0.5, 0.1] }, { duration: 0.2, delay: 0.25 });
        animate(".small-heart-3", { y: -35, opacity: [0, 1, 0], scale: [0, 0.4, 0.1] }, { duration: 0.2, delay: 0.1 });
        animate(".small-heart-4", { y: -32, opacity: [0, 1, 0], scale: [0, 0.6, 0.1] }, { duration: 0.2, delay: 0.15 });
        await animate(
          ".small-heart-5",
          { y: -32, opacity: [0, 1, 0], scale: [0, 0.5, 0.1] },
          { duration: 0.2, delay: 0.2 }
        );
      } else {
        await animate(
          ".heart",
          {
            color: "rgb(212, 212, 216)",
            scale: [1, 1.2, 1],
            rotate: [18, -18, 12, -24, 15, 0],
            fill: "rgba(0, 0, 0, 0)",
          },
          {
            ease: "easeOut",
            duration: 0.4,
          }
        );
      }
      setIsAnimating(false);
    }

    handleLike();
  }, [animate, liked, setLiked]);

  return (
    <button
      disabled={isAnimating}
      ref={scope}
      onClick={() => setLiked((prev) => !prev)}
      className="group relative scale-125 ml-3"
    >
      {liked && (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <LucideCircle
              key={i}
              strokeWidth={1}
              className={cn(`-left-1 top-2 absolute w-6 h-6`, `circle-${i + 1}`)}
              style={{ opacity: 0 }}
            />
          ))}

          <LucideHeart
            strokeWidth={1}
            style={{ opacity: 0 }}
            className="absolute top-6 -left-1 small-heart-1 translate-x-2 fill-zinc-300"
          />
          <LucideHeart
            strokeWidth={1}
            style={{ opacity: 0 }}
            className="absolute top-6 -left-2 small-heart-2 translate-x-4 fill-zinc-300"
          />
          <LucideHeart
            strokeWidth={1}
            style={{ opacity: 0 }}
            className="absolute top-6 left-0 small-heart-3 -translate-x-2 fill-zinc-300"
          />
          <LucideHeart
            strokeWidth={1}
            style={{ opacity: 0 }}
            className="absolute top-6 left-1 small-heart-4 translate-x-1 fill-zinc-300"
          />
          <LucideHeart
            strokeWidth={1}
            style={{ opacity: 0 }}
            className="absolute top-6 left-2 small-heart-5 -translate-x-1 fill-zinc-300"
          />
        </>
      )}
      <LucideHeart className="heart w-4 h-4 origin-center text-zinc-300 group-hover:text-zinc-50" />
    </button>
  );
}
