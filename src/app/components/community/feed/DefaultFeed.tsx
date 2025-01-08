import React from "react";
import CommentHeader from "./header/CommentHeader";
import CommentText from "./content/CommentText";
import CommentReaction from "./reaction/CommentReaction";

export default function DefaultFeed() {
  return (
    <>
      <article className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl bg-white">
        <CommentHeader />
        <CommentText />
        <CommentReaction />
      </article>
    </>
  );
}
