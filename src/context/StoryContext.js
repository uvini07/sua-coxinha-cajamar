import { createContext, useContext } from 'react'

export const StoryContext = createContext({
  active: 0,
  goTo: () => {},
  linkTo: () => () => {},
  progressRef: { current: null },
})

export const useStoryContext = () => useContext(StoryContext)
