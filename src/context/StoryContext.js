import { createContext, useContext } from 'react'

export const StoryContext = createContext({
  current: { id: 'inicio', theme: 'dark', inStory: false },
  storyIndex: 0,
  isStory: false,
  goTo: () => {},
  linkTo: () => () => {},
  progressRef: { current: null },
})

export const useStoryContext = () => useContext(StoryContext)
