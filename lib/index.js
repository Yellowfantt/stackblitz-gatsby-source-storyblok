export default () => 6

// TODOs
// Test Gatsby SDK works with all current features with Storyblok
// Implement what we have from React SDK (import & export APIs)
// Implement parse approach around content query

import { useEffect, useState } from "react";
import { useStoryblokBridge } from "@storyblok/react";

export function useStoryblok(originalStory) {
  if (typeof originalStory.content === "string") originalStory.content = JSON.parse(originalStory.content);

  let [story, setStory] = useState(originalStory);
  useEffect(() => {
    // eslint-disable-next-line
    useStoryblokBridge(story.internalId, (newStory) => setStory(newStory));
  }, []);

  return story;
}