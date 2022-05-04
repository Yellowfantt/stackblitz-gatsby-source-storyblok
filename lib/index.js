import { useEffect, useState } from "react";
import { useStoryblokBridge } from "@storyblok/react";
export { storyblokInit, apiPlugin, StoryblokComponent, storyblokEditable } from "@storyblok/react";

export function useStoryblok(originalStory, apiOptions = {}, bridgeOptions = {}) {
  if (typeof originalStory.content === "string") originalStory.content = JSON.parse(originalStory.content);

  let [story, setStory] = useState(originalStory);
  useEffect(() => {
    // eslint-disable-next-line
    apiOptions = (newStory) => setStory(newStory)
    useStoryblokBridge(story.internalId, apiOptions, bridgeOptions);
  }, []);

  return story;
}