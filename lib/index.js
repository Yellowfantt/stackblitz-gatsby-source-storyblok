export default () => 6

// TODOs
// Test Gatsby SDK works with all current features with Storyblok
// Implement what we have from React SDK (import & export APIs)
// Implement parse approach around content query

// import { useState, useEffect } from "react";
// import {
//   useStoryblokBridge as useSbBridge,
//   storyblokInit as sbInit,
// } from "@storyblok/js";

// export { default as StoryblokComponent } from "./components/storyblok-component";
// export {
//   storyblokEditable,
//   apiPlugin,
//   useStoryblokBridge,
// } from "@storyblok/js";

// export function useStoryblok(originalStory, bridgeOptions = {}) {
//   const storyCopy = { ...originalStory }
//   if (typeof storyCopy.content === "string") storyCopy.content = JSON.parse(storyCopy.content)

//   const modifiedId = storyCopy.id.split('-')
//   storyCopy.id = parseInt(modifiedId[1])

//   let [story, setStory] = useState(storyCopy);

//   useEffect(() => {
//     // eslint-disable-next-line
//     useStoryblokBridge(story.id, (newStory) => setStory(newStory), bridgeOptions);
//   }, []);

//   return story;
// };

// export const useStoryblokState = (initialStory = {}, bridgeOptions = {}) => {
//   let [story, setStory] = useState(initialStory);

//   useSbBridge(story.id, (newStory) => setStory(newStory), bridgeOptions);

//   useEffect(() => {
//     setStory(initialStory);
//   }, [initialStory]);

//   return story;
// };

// let storyblokApiInstance = null;

// export const useStoryblokApi = () => {
//   if (!storyblokApiInstance) {
//     console.error(
//       "You can't use getStoryblokApi if you're not loading apiPlugin."
//     );
//   }

//   return storyblokApiInstance;
// };

// export { useStoryblokApi as getStoryblokApi };

// let componentsMap = {};

// export const getComponent = (componentKey) => {
//   if (!componentsMap[componentKey]) {
//     console.error(`Component ${componentKey} doesn't exist.`);
//     return false;
//   }
//   return componentsMap[componentKey];
// };

// export const storyblokInit = (pluginOptions = {}) => {
//   const { storyblokApi } = sbInit(pluginOptions);
//   storyblokApiInstance = storyblokApi;

//   componentsMap = pluginOptions.components;
// };